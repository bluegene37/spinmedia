// Gene - Nov, 19, 2026: Live Philippine weather (Open-Meteo), OFW remittance FX rates, and MMDA PHT coding composable
import { computed, ref } from 'vue'
import type { PhilippineHoliday } from '@/types/spin'

export type WeatherIconName =
  | 'sun'
  | 'cloud-sun'
  | 'cloud'
  | 'cloud-drizzle'
  | 'cloud-rain'
  | 'cloud-lightning'

export interface PhilippineCityConfig {
  id: 'manila' | 'cebu' | 'davao' | 'baguio' | 'iloilo'
  name: string
  region: string
  latitude: number
  longitude: number
  fallbackTempC: number
  fallbackFeelsC: number
  fallbackHumidity: number
  fallbackWindKmh: number
  fallbackRainChance: number
  fallbackCode: number
}

export interface DailyForecastItem {
  date: string
  dayLabel: string
  tempMax: number
  tempMin: number
  rainChance: number
  conditionLabel: string
  icon: WeatherIconName
}

export interface LiveWeatherState {
  locationLabel: string
  regionLabel: string
  temperatureC: number
  feelsLikeC: number
  humidity: number
  windSpeedKmh: number
  rainChance: number
  weatherCode: number
  conditionLabel: string
  icon: WeatherIconName
  advisory: string
  daily: DailyForecastItem[]
  updatedLabel: string
  isFallback: boolean
  isCustomLocation: boolean
}

export interface CurrencyRateItem {
  code: 'USD' | 'AED' | 'SAR' | 'SGD' | 'EUR' | 'JPY'
  name: string
  regionTag: string
  phpValue: number
  decimals: number
}

export interface MmdaCodingState {
  weekdayLabel: string
  manilaDateIso: string
  digitsLabel: string
  statusBadge: 'Active Now' | 'Window Hours' | 'Off-Hours' | 'Lifted Today'
  statusTone: 'crimson' | 'civic' | 'ochre' | 'slate'
  scheduleSummary: string
  makatiNote: string
}

export interface UpcomingHolidayView extends PhilippineHoliday {
  formattedDate: string
  daysAway: number
  countdownLabel: string
}

export const PH_CITIES: PhilippineCityConfig[] = [
  {
    id: 'manila',
    name: 'Manila',
    region: 'Metro Manila (NCR)',
    latitude: 14.5995,
    longitude: 120.9842,
    fallbackTempC: 31,
    fallbackFeelsC: 35,
    fallbackHumidity: 68,
    fallbackWindKmh: 14,
    fallbackRainChance: 25,
    fallbackCode: 2,
  },
  {
    id: 'cebu',
    name: 'Cebu City',
    region: 'Central Visayas',
    latitude: 10.3157,
    longitude: 123.8854,
    fallbackTempC: 30,
    fallbackFeelsC: 34,
    fallbackHumidity: 72,
    fallbackWindKmh: 16,
    fallbackRainChance: 30,
    fallbackCode: 2,
  },
  {
    id: 'davao',
    name: 'Davao City',
    region: 'Davao Region',
    latitude: 7.1907,
    longitude: 125.4553,
    fallbackTempC: 31,
    fallbackFeelsC: 35,
    fallbackHumidity: 74,
    fallbackWindKmh: 11,
    fallbackRainChance: 35,
    fallbackCode: 3,
  },
  {
    id: 'baguio',
    name: 'Baguio',
    region: 'Cordillera',
    latitude: 16.4023,
    longitude: 120.596,
    fallbackTempC: 21,
    fallbackFeelsC: 21,
    fallbackHumidity: 80,
    fallbackWindKmh: 12,
    fallbackRainChance: 40,
    fallbackCode: 3,
  },
  {
    id: 'iloilo',
    name: 'Iloilo City',
    region: 'Western Visayas',
    latitude: 10.7202,
    longitude: 122.5621,
    fallbackTempC: 30,
    fallbackFeelsC: 34,
    fallbackHumidity: 70,
    fallbackWindKmh: 15,
    fallbackRainChance: 25,
    fallbackCode: 1,
  },
]

const CURRENCY_META: Array<{
  code: CurrencyRateItem['code']
  name: string
  regionTag: string
  fallbackPhp: number
  decimals: number
}> = [
  { code: 'USD', name: 'US Dollar', regionTag: 'Americas / Global', fallbackPhp: 58.65, decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', regionTag: 'Dubai / UAE', fallbackPhp: 15.97, decimals: 2 },
  { code: 'SAR', name: 'Saudi Riyal', regionTag: 'Middle East', fallbackPhp: 15.64, decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', regionTag: 'ASEAN', fallbackPhp: 43.78, decimals: 2 },
  { code: 'EUR', name: 'Euro', regionTag: 'Europe', fallbackPhp: 62.1, decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', regionTag: 'Japan', fallbackPhp: 0.38, decimals: 2 },
]

function describeWmoCode(code: number): { label: string; icon: WeatherIconName } {
  if (code === 0) return { label: 'Clear Sky', icon: 'sun' }
  if (code === 1 || code === 2) return { label: 'Partly Cloudy', icon: 'cloud-sun' }
  if (code === 3 || code === 45 || code === 48) {
    return { label: code === 3 ? 'Mostly Cloudy' : 'Morning Mist', icon: 'cloud' }
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { label: 'Light Drizzle', icon: 'cloud-drizzle' }
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: 'Passing Rain Showers', icon: 'cloud-rain' }
  }
  if ([95, 96, 99].includes(code)) {
    return { label: 'Thunderstorm Watch', icon: 'cloud-lightning' }
  }
  return { label: 'Tropical Breeze', icon: 'cloud-sun' }
}

function buildWeatherAdvisory(
  tempC: number,
  feelsLikeC: number,
  rainChance: number,
  weatherCode: number,
): string {
  if (weatherCode >= 95) {
    return 'Thunderstorm watch: monitor DOST-PAGASA advisories and allow extra commute time.'
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode) || rainChance >= 60) {
    return 'Keep an umbrella handy and give yourself buffer time for passing rain showers.'
  }
  if (feelsLikeC >= 37 || tempC >= 34) {
    return 'Warm heat index expected — hydrate regularly and plan outdoor errands early.'
  }
  if (tempC <= 23) {
    return 'Cool highland air — pack a light jacket for morning and evening trips.'
  }
  return 'Fair tropical weather across the city — smooth window for travel and outdoor plans.'
}

function formatManilaDayLabel(isoDate: string, index: number): string {
  if (index === 0) return 'Today'
  const parsed = new Date(`${isoDate}T00:00:00+08:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return new Intl.DateTimeFormat('en-PH', {
    weekday: 'short',
    timeZone: 'Asia/Manila',
  }).format(parsed)
}

function formatManilaTimeNow(): string {
  return `${new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())} PHT`
}

function getManilaIsoDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function buildFallbackWeather(city: PhilippineCityConfig): LiveWeatherState {
  const { label, icon } = describeWmoCode(city.fallbackCode)
  const baseDate = new Date(`${getManilaIsoDate()}T00:00:00+08:00`)
  const daily: DailyForecastItem[] = [0, 1, 2].map((offset) => {
    const d = new Date(baseDate.getTime() + offset * 86_400_000)
    const iso = getManilaIsoDate(d)
    return {
      date: iso,
      dayLabel: formatManilaDayLabel(iso, offset),
      tempMax: city.fallbackTempC + (offset === 1 ? 1 : 0),
      tempMin: city.fallbackTempC - 5,
      rainChance: Math.min(80, city.fallbackRainChance + offset * 5),
      conditionLabel: label,
      icon,
    }
  })

  return {
    locationLabel: city.name,
    regionLabel: city.region,
    temperatureC: city.fallbackTempC,
    feelsLikeC: city.fallbackFeelsC,
    humidity: city.fallbackHumidity,
    windSpeedKmh: city.fallbackWindKmh,
    rainChance: city.fallbackRainChance,
    weatherCode: city.fallbackCode,
    conditionLabel: label,
    icon,
    advisory: buildWeatherAdvisory(
      city.fallbackTempC,
      city.fallbackFeelsC,
      city.fallbackRainChance,
      city.fallbackCode,
    ),
    daily,
    updatedLabel: 'Offline Snapshot',
    isFallback: true,
    isCustomLocation: false,
  }
}

function buildFallbackRates(): CurrencyRateItem[] {
  return CURRENCY_META.map((item) => ({
    code: item.code,
    name: item.name,
    regionTag: item.regionTag,
    phpValue: item.fallbackPhp,
    decimals: item.decimals,
  }))
}

const defaultCity = PH_CITIES[0]!

const selectedCityId = ref<PhilippineCityConfig['id']>('manila')
const weather = ref<LiveWeatherState>(buildFallbackWeather(defaultCity))
const weatherLoading = ref(false)
const geoNotice = ref<string | null>(null)

const currencyRates = ref<CurrencyRateItem[]>(buildFallbackRates())
const ratesLoading = ref(false)
const ratesUpdatedLabel = ref('Reference Snapshot')
const ratesFallback = ref(true)

const phtNow = ref(new Date())
let clockTimer: ReturnType<typeof setInterval> | null = null
let activeBootstrapped = false

async function fetchWithTimeout(url: string, timeoutMs = 6000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number
    relative_humidity_2m?: number
    apparent_temperature?: number
    weather_code?: number
    wind_speed_10m?: number
  }
  daily?: {
    time?: string[]
    weather_code?: number[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    precipitation_probability_max?: number[]
  }
}

interface ExchangeRateResponse {
  result?: string
  rates?: Record<string, number>
}

async function loadWeatherForCoords(
  latitude: number,
  longitude: number,
  locationLabel: string,
  regionLabel: string,
  isCustomLocation: boolean,
  fallbackCity: PhilippineCityConfig,
) {
  weatherLoading.value = true
  try {
    const params = new URLSearchParams({
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'Asia/Manila',
      forecast_days: '3',
    })
    const res = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    if (!res.ok) throw new Error(`Weather HTTP ${res.status}`)
    const data = (await res.json()) as OpenMeteoResponse
    const cur = data.current
    const dayData = data.daily
    if (!cur || typeof cur.temperature_2m !== 'number') {
      throw new Error('Incomplete weather payload')
    }

    const tempC = Math.round(cur.temperature_2m)
    const feelsC = Math.round(cur.apparent_temperature ?? cur.temperature_2m)
    const humidity = Math.round(cur.relative_humidity_2m ?? fallbackCity.fallbackHumidity)
    const windKmh = Math.round(cur.wind_speed_10m ?? fallbackCity.fallbackWindKmh)
    const wmoCode = cur.weather_code ?? fallbackCity.fallbackCode
    const todayRainChance = Math.round(dayData?.precipitation_probability_max?.[0] ?? 20)
    const { label, icon } = describeWmoCode(wmoCode)

    const dates = dayData?.time ?? []
    const daily: DailyForecastItem[] = dates.slice(0, 3).map((dateStr, idx) => {
      const code = dayData?.weather_code?.[idx] ?? wmoCode
      const described = describeWmoCode(code)
      return {
        date: dateStr,
        dayLabel: formatManilaDayLabel(dateStr, idx),
        tempMax: Math.round(dayData?.temperature_2m_max?.[idx] ?? tempC + 1),
        tempMin: Math.round(dayData?.temperature_2m_min?.[idx] ?? tempC - 5),
        rainChance: Math.round(dayData?.precipitation_probability_max?.[idx] ?? todayRainChance),
        conditionLabel: described.label,
        icon: described.icon,
      }
    })

    weather.value = {
      locationLabel,
      regionLabel,
      temperatureC: tempC,
      feelsLikeC: feelsC,
      humidity,
      windSpeedKmh: windKmh,
      rainChance: todayRainChance,
      weatherCode: wmoCode,
      conditionLabel: label,
      icon,
      advisory: buildWeatherAdvisory(tempC, feelsC, todayRainChance, wmoCode),
      daily: daily.length > 0 ? daily : buildFallbackWeather(fallbackCity).daily,
      updatedLabel: formatManilaTimeNow(),
      isFallback: false,
      isCustomLocation,
    }
  } catch {
    const fallback = buildFallbackWeather(fallbackCity)
    fallback.locationLabel = locationLabel
    fallback.regionLabel = regionLabel
    fallback.isCustomLocation = isCustomLocation
    weather.value = fallback
  } finally {
    weatherLoading.value = false
  }
}

async function loadCurrencyRates() {
  ratesLoading.value = true
  try {
    const res = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD')
    if (!res.ok) throw new Error(`FX HTTP ${res.status}`)
    const data = (await res.json()) as ExchangeRateResponse
    const usdToPhp = data.rates?.PHP
    if (!data.rates || typeof usdToPhp !== 'number' || usdToPhp <= 0) {
      throw new Error('Incomplete FX rates')
    }

    const updated: CurrencyRateItem[] = CURRENCY_META.map((meta) => {
      const perUsd = meta.code === 'USD' ? 1 : data.rates?.[meta.code]
      const phpVal =
        typeof perUsd === 'number' && perUsd > 0 ? usdToPhp / perUsd : meta.fallbackPhp
      return {
        code: meta.code,
        name: meta.name,
        regionTag: meta.regionTag,
        phpValue: phpVal,
        decimals: meta.decimals,
      }
    })

    currencyRates.value = updated
    ratesUpdatedLabel.value = formatManilaTimeNow()
    ratesFallback.value = false
  } catch {
    currencyRates.value = buildFallbackRates()
    ratesUpdatedLabel.value = 'Offline Reference'
    ratesFallback.value = true
  } finally {
    ratesLoading.value = false
  }
}

export function useLiveEssentials() {
  const selectCity = async (cityId: PhilippineCityConfig['id']) => {
    selectedCityId.value = cityId
    geoNotice.value = null
    const city = PH_CITIES.find((c) => c.id === cityId) ?? defaultCity
    await loadWeatherForCoords(city.latitude, city.longitude, city.name, city.region, false, city)
  }

  const requestMyLocation = () => {
    geoNotice.value = null
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      geoNotice.value = 'Browser geolocation unavailable — showing selected city.'
      return
    }
    weatherLoading.value = true
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const activeCity = PH_CITIES.find((c) => c.id === selectedCityId.value) ?? defaultCity
        void loadWeatherForCoords(
          pos.coords.latitude,
          pos.coords.longitude,
          'Your Location',
          'GPS Local Forecast',
          true,
          activeCity,
        )
      },
      () => {
        weatherLoading.value = false
        geoNotice.value = `Location access declined — showing ${weather.value.locationLabel}.`
      },
      { timeout: 7000, maximumAge: 300_000 },
    )
  }

  const refreshAll = async () => {
    phtNow.value = new Date()
    const activeCity = PH_CITIES.find((c) => c.id === selectedCityId.value) ?? defaultCity
    await Promise.all([
      loadWeatherForCoords(
        activeCity.latitude,
        activeCity.longitude,
        activeCity.name,
        activeCity.region,
        false,
        activeCity,
      ),
      loadCurrencyRates(),
    ])
  }

  const bootstrap = () => {
    if (!clockTimer && typeof window !== 'undefined') {
      clockTimer = setInterval(() => {
        phtNow.value = new Date()
      }, 30_000)
    }
    if (!activeBootstrapped) {
      activeBootstrapped = true
      void refreshAll()
    }
  }

  const getCodingStatus = (holidays: PhilippineHoliday[] = []): MmdaCodingState => {
    const now = phtNow.value
    const manilaDateIso = getManilaIsoDate(now)
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)

    const weekdayLabel = parts.find((p) => p.type === 'weekday')?.value ?? 'Weekday'
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '12') % 24
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
    const minsOfDay = hour * 60 + minute

    const holidayToday = holidays.find((h) => h.date === manilaDateIso)
    const plateByWeekday: Record<string, string> = {
      Monday: '1 & 2',
      Tuesday: '3 & 4',
      Wednesday: '5 & 6',
      Thursday: '7 & 8',
      Friday: '9 & 0',
      Saturday: 'None',
      Sunday: 'None',
    }

    if (weekdayLabel === 'Saturday' || weekdayLabel === 'Sunday') {
      return {
        weekdayLabel,
        manilaDateIso,
        digitsLabel: 'None',
        statusBadge: 'Lifted Today',
        statusTone: 'civic',
        scheduleSummary: 'Weekend suspension in effect across Metro Manila.',
        makatiNote: 'Check local mall/city ordinances where applicable.',
      }
    }

    if (holidayToday) {
      return {
        weekdayLabel,
        manilaDateIso,
        digitsLabel: 'Lifted',
        statusBadge: 'Lifted Today',
        statusTone: 'civic',
        scheduleSummary: `UVVRP suspended for ${holidayToday.name} (${holidayToday.type}).`,
        makatiNote: 'Standard public holiday suspension applies.',
      }
    }

    const digitsLabel = plateByWeekday[weekdayLabel] ?? 'Check MMDA'
    const isMorningPeak = minsOfDay >= 420 && minsOfDay < 600 // 07:00 - 10:00
    const isEveningPeak = minsOfDay >= 1020 && minsOfDay < 1200 // 17:00 - 20:00
    const isWindowHours = minsOfDay >= 600 && minsOfDay < 1020 // 10:00 - 17:00

    let statusBadge: MmdaCodingState['statusBadge'] = 'Off-Hours'
    let statusTone: MmdaCodingState['statusTone'] = 'slate'
    if (isMorningPeak || isEveningPeak) {
      statusBadge = 'Active Now'
      statusTone = 'crimson'
    } else if (isWindowHours) {
      statusBadge = 'Window Hours'
      statusTone = 'civic'
    }

    return {
      weekdayLabel,
      manilaDateIso,
      digitsLabel,
      statusBadge,
      statusTone,
      scheduleSummary: 'Peak hours: 7:00–10:00 AM & 5:00–8:00 PM (Window: 10:01 AM–4:59 PM).',
      makatiNote: 'Makati CBD enforces 7:00 AM–7:00 PM with no window hours.',
    }
  }

  const getUpcomingHolidays = (
    holidays: PhilippineHoliday[],
    limit = 4,
  ): UpcomingHolidayView[] => {
    const todayIso = getManilaIsoDate(phtNow.value)
    const todayMidnight = new Date(`${todayIso}T00:00:00+08:00`).getTime()

    return holidays
      .filter((h) => h.date >= todayIso)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit)
      .map((h) => {
        const target = new Date(`${h.date}T00:00:00+08:00`)
        const daysAway = Math.max(0, Math.round((target.getTime() - todayMidnight) / 86_400_000))
        let countdownLabel = `In ${daysAway} days`
        if (daysAway === 0) countdownLabel = 'Today'
        else if (daysAway === 1) countdownLabel = 'Tomorrow'

        const formattedDate = new Intl.DateTimeFormat('en-PH', {
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          timeZone: 'Asia/Manila',
        }).format(target)

        return {
          ...h,
          formattedDate,
          daysAway,
          countdownLabel,
        }
      })
  }

  const activeCity = computed(
    () => PH_CITIES.find((c) => c.id === selectedCityId.value) ?? defaultCity,
  )

  return {
    cities: PH_CITIES,
    selectedCityId,
    activeCity,
    weather,
    weatherLoading,
    geoNotice,
    currencyRates,
    ratesLoading,
    ratesUpdatedLabel,
    ratesFallback,
    phtNow,
    selectCity,
    requestMyLocation,
    refreshAll,
    bootstrap,
    getCodingStatus,
    getUpcomingHolidays,
  }
}
