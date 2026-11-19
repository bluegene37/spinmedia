<script setup lang="ts">
// Gene - Nov, 19, 2026: Citizen Essentials Bento Hub with Live PH Weather, MMDA Coding, OFW FX, Hotlines, Advisories & Holidays
import { computed, onMounted } from 'vue'
import {
  ArrowUpRight,
  CalendarDays,
  Car,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Coins,
  Droplets,
  ExternalLink,
  LocateFixed,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  Sun,
  Umbrella,
  Wind,
} from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'
import { useSpinData } from '@/composables/useSpinData'
import { useLiveEssentials, type WeatherIconName } from '@/composables/useLiveEssentials'

const { publicInfo } = useSpinData()
const {
  cities,
  selectedCityId,
  weather,
  weatherLoading,
  geoNotice,
  currencyRates,
  ratesLoading,
  ratesUpdatedLabel,
  ratesFallback,
  selectCity,
  requestMyLocation,
  refreshAll,
  bootstrap,
  getCodingStatus,
  getUpcomingHolidays,
} = useLiveEssentials()

onMounted(() => {
  bootstrap()
})

const codingToday = computed(() => getCodingStatus(publicInfo.value?.holidays ?? []))
const upcomingHolidays = computed(() =>
  getUpcomingHolidays(publicInfo.value?.holidays ?? [], 4),
)
const hotlines = computed(() => publicInfo.value?.hotlines ?? [])
const advisories = computed(() => publicInfo.value?.advisories ?? [])
const isRefreshing = computed(() => weatherLoading.value || ratesLoading.value)

function resolveWeatherIcon(name: WeatherIconName) {
  switch (name) {
    case 'sun':
      return Sun
    case 'cloud-sun':
      return CloudSun
    case 'cloud':
      return Cloud
    case 'cloud-drizzle':
      return CloudDrizzle
    case 'cloud-rain':
      return CloudRain
    case 'cloud-lightning':
      return CloudLightning
  }
}

function formatPhpRate(value: number, decimals: number): string {
  return `₱${value.toFixed(decimals)}`
}
</script>

<template>
  <section aria-labelledby="citizen-essentials-heading" class="space-y-6">
    <!-- Section Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="mb-1.5 flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-civic/10 px-2.5 py-0.5 text-[11px] font-bold tracking-[0.14em] text-civic uppercase dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-civic dark:bg-emerald-400"></span>
            Live Citizen Desk • Philippines
          </span>
        </div>
        <h2
          id="citizen-essentials-heading"
          class="font-serif text-2xl font-bold tracking-tight text-slate-ink sm:text-3xl dark:text-slate-100"
        >
          Weather & Daily Public Essentials
        </h2>
        <p class="mt-1 text-sm text-slate-body dark:text-slate-400">
          Real-time Philippine weather, commuter coding rules, OFW remittance rates, and verified 24/7 citizen hotlines.
        </p>
      </div>

      <button
        type="button"
        @click="refreshAll"
        :disabled="isRefreshing"
        class="inline-flex self-start items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-ink shadow-float-chip transition-all hover:-translate-y-0.5 hover:bg-white disabled:opacity-60 sm:self-auto dark:border dark:border-white/10 dark:bg-obsidian-float dark:text-slate-200 dark:hover:bg-white/10"
      >
        <RefreshCw class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" :class="{ 'animate-spin': isRefreshing }" />
        {{ isRefreshing ? 'Updating Live Feeds...' : 'Refresh Live Data' }}
      </button>
    </div>

    <!-- Top Bento Row: Live Weather + MMDA Coding & OFW Rates -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <!-- Live Weather Hero Card -->
      <AntigravityCard
        depth="elevated"
        :max-tilt="1.2"
        as="div"
        class="xl:col-span-7 flex flex-col justify-between p-6 sm:p-7"
      >
        <div>
          <!-- City Selector Pills + GPS Opt-in -->
          <div class="flex flex-wrap items-center justify-between gap-2 pb-5">
            <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Select Philippine city">
              <button
                v-for="city in cities"
                :key="city.id"
                type="button"
                @click="selectCity(city.id)"
                class="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                :class="
                  !weather.isCustomLocation && selectedCityId === city.id
                    ? 'bg-slate-ink text-white shadow-float-chip dark:bg-white dark:text-obsidian-canvas'
                    : 'bg-slate-100/90 text-slate-body hover:bg-slate-200/80 hover:text-slate-ink dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/12 dark:hover:text-white'
                "
              >
                {{ city.name }}
              </button>
              <button
                type="button"
                @click="requestMyLocation"
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                :class="
                  weather.isCustomLocation
                    ? 'bg-civic text-white shadow-float-chip dark:bg-emerald-500 dark:text-obsidian-canvas'
                    : 'bg-civic/10 text-civic hover:bg-civic/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25'
                "
              >
                <LocateFixed class="h-3.5 w-3.5" />
                My Location
              </button>
            </div>

            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="
                weather.isFallback
                  ? 'bg-ochre/10 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright'
                  : 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
              "
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="weather.isFallback ? 'bg-ochre' : 'bg-emerald-500 animate-pulse'"
              ></span>
              {{ weather.isFallback ? 'Snapshot' : `Live • ${weather.updatedLabel}` }}
            </span>
          </div>

          <p v-if="geoNotice" class="mb-3 text-xs font-medium text-ochre dark:text-ochre-bright">
            {{ geoNotice }}
          </p>

          <!-- Current Temp + Condition -->
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4 sm:gap-5">
              <div
                class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-amber-50 text-ochre shadow-float-chip dark:from-sky-500/15 dark:to-amber-500/15 dark:text-ochre-bright"
              >
                <component :is="resolveWeatherIcon(weather.icon)" class="h-9 w-9" />
              </div>
              <div>
                <div class="flex items-baseline gap-2">
                  <span class="font-serif text-4xl font-bold tracking-tight tabular-nums text-slate-ink sm:text-5xl dark:text-white">
                    {{ weather.temperatureC }}°C
                  </span>
                  <span class="text-sm font-semibold text-slate-body dark:text-slate-300">
                    {{ weather.conditionLabel }}
                  </span>
                </div>
                <p class="mt-1 text-xs font-medium text-slate-meta dark:text-slate-400">
                  <span class="font-semibold text-slate-ink dark:text-slate-200">{{ weather.locationLabel }}</span>
                  • {{ weather.regionLabel }}
                </p>
              </div>
            </div>

            <a
              href="https://www.pagasa.dost.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex self-start items-center gap-1.5 rounded-full bg-slate-100/90 px-3.5 py-2 text-xs font-semibold text-slate-ink transition-all hover:bg-slate-200/80 sm:self-auto dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/12"
            >
              DOST-PAGASA Bulletins
              <ExternalLink class="h-3.5 w-3.5 text-slate-meta" />
            </a>
          </div>

          <!-- 4 Atmospheric Metrics -->
          <div class="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div class="rounded-2xl bg-slate-50/90 px-3.5 py-2.5 dark:bg-white/[0.04]">
              <p class="text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                Feels Like
              </p>
              <p class="mt-0.5 text-base font-bold tabular-nums text-slate-ink dark:text-white">
                {{ weather.feelsLikeC }}°C
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50/90 px-3.5 py-2.5 dark:bg-white/[0.04]">
              <p class="flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                <Droplets class="h-3 w-3 text-sky-600 dark:text-sky-400" />
                Humidity
              </p>
              <p class="mt-0.5 text-base font-bold tabular-nums text-slate-ink dark:text-white">
                {{ weather.humidity }}%
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50/90 px-3.5 py-2.5 dark:bg-white/[0.04]">
              <p class="flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                <Wind class="h-3 w-3 text-civic dark:text-emerald-400" />
                Wind
              </p>
              <p class="mt-0.5 text-base font-bold tabular-nums text-slate-ink dark:text-white">
                {{ weather.windSpeedKmh }} km/h
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50/90 px-3.5 py-2.5 dark:bg-white/[0.04]">
              <p class="flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                <Umbrella class="h-3 w-3 text-crimson dark:text-crimson-bright" />
                Rain Chance
              </p>
              <p class="mt-0.5 text-base font-bold tabular-nums text-slate-ink dark:text-white">
                {{ weather.rainChance }}%
              </p>
            </div>
          </div>

          <!-- Weather Advisory Banner -->
          <div
            class="mt-4 rounded-2xl bg-civic/[0.07] px-4 py-2.5 text-xs font-medium leading-relaxed text-civic dark:bg-emerald-500/12 dark:text-emerald-300"
          >
            {{ weather.advisory }}
          </div>
        </div>

        <!-- 3-Day Forecast -->
        <div class="mt-5 grid grid-cols-3 gap-2.5">
          <div
            v-for="day in weather.daily"
            :key="day.date"
            class="flex flex-col justify-between rounded-2xl bg-slate-50/90 p-3 dark:bg-white/[0.04]"
          >
            <div class="flex items-center justify-between gap-1">
              <span class="text-xs font-bold text-slate-ink dark:text-slate-100">{{ day.dayLabel }}</span>
              <component
                :is="resolveWeatherIcon(day.icon)"
                class="h-4 w-4 shrink-0 text-ochre dark:text-ochre-bright"
              />
            </div>
            <p class="mt-1.5 text-[11px] font-medium text-slate-body line-clamp-1 dark:text-slate-400">
              {{ day.conditionLabel }}
            </p>
            <div class="mt-2 flex items-baseline justify-between gap-1 text-xs tabular-nums">
              <span class="font-bold text-slate-ink dark:text-white">{{ day.tempMax }}° / {{ day.tempMin }}°</span>
              <span class="text-[11px] text-sky-700 dark:text-sky-300">{{ day.rainChance }}%</span>
            </div>
          </div>
        </div>
      </AntigravityCard>

      <!-- Right Column: MMDA Coding + OFW Remittance Watch -->
      <div class="xl:col-span-5 flex flex-col gap-6">
        <!-- MMDA Number Coding Card -->
        <AntigravityCard depth="elevated" :max-tilt="1.2" as="div" class="p-6">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson/10 text-crimson dark:bg-crimson/20 dark:text-crimson-bright"
              >
                <Car class="h-5 w-5" />
              </div>
              <div>
                <p class="text-[11px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                  MMDA UVVRP • Metro Manila
                </p>
                <h3 class="font-serif text-lg font-bold text-slate-ink dark:text-white">
                  Number Coding ({{ codingToday.weekdayLabel }})
                </h3>
              </div>
            </div>

            <span
              class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
              :class="{
                'bg-crimson/12 text-crimson dark:bg-crimson/20 dark:text-crimson-bright':
                  codingToday.statusTone === 'crimson',
                'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300':
                  codingToday.statusTone === 'civic',
                'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-slate-300':
                  codingToday.statusTone === 'slate',
                'bg-ochre/15 text-ochre dark:bg-ochre-bright/20 dark:text-ochre-bright':
                  codingToday.statusTone === 'ochre',
              }"
            >
              {{ codingToday.statusBadge }}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-slate-50/90 p-4 dark:bg-white/[0.04]">
            <div>
              <p class="text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                Restricted Plate Endings Today
              </p>
              <p class="mt-1 font-serif text-3xl font-bold tracking-tight tabular-nums text-slate-ink dark:text-white">
                {{ codingToday.digitsLabel }}
              </p>
            </div>
            <div class="text-right text-[11px] font-medium text-slate-meta dark:text-slate-400">
              <p class="font-semibold text-slate-ink dark:text-slate-200">PHT Schedule</p>
              <p>{{ codingToday.manilaDateIso }}</p>
            </div>
          </div>

          <p class="mt-3 text-xs leading-relaxed text-slate-body dark:text-slate-300">
            {{ codingToday.scheduleSummary }}
          </p>
          <p class="mt-1 text-[11px] text-slate-meta dark:text-slate-400">
            {{ codingToday.makatiNote }}
          </p>
        </AntigravityCard>

        <!-- Live OFW Currency & Remittance Watch -->
        <AntigravityCard depth="elevated" :max-tilt="1.2" as="div" class="flex-1 p-6">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-ochre/10 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
              >
                <Coins class="h-5 w-5" />
              </div>
              <div>
                <p class="text-[11px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                  OFW Remittance Watch
                </p>
                <h3 class="font-serif text-lg font-bold text-slate-ink dark:text-white">
                  PHP Exchange Rates
                </h3>
              </div>
            </div>

            <span
              class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="
                ratesFallback
                  ? 'bg-slate-100 text-slate-meta dark:bg-white/[0.06] dark:text-slate-400'
                  : 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
              "
            >
              {{ ratesUpdatedLabel }}
            </span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <div
              v-for="fx in currencyRates"
              :key="fx.code"
              class="rounded-2xl bg-slate-50/90 px-3.5 py-2.5 dark:bg-white/[0.04]"
            >
              <div class="flex items-center justify-between gap-1">
                <span class="text-xs font-extrabold tracking-wide text-slate-ink dark:text-slate-100">
                  1 {{ fx.code }}
                </span>
                <span class="text-[10px] font-medium text-slate-meta dark:text-slate-400">
                  PHP
                </span>
              </div>
              <p class="mt-1 text-base font-bold tabular-nums text-crimson dark:text-ochre-bright">
                {{ formatPhpRate(fx.phpValue, fx.decimals) }}
              </p>
              <p class="mt-0.5 text-[10px] text-slate-meta truncate dark:text-slate-400">
                {{ fx.regionTag }}
              </p>
            </div>
          </div>

          <p class="mt-3 text-[11px] text-slate-meta dark:text-slate-400">
            Indicative mid-market spot rates to Philippine Peso (₱). Check your licensed bank or remittance center for payout fees.
          </p>
        </AntigravityCard>
      </div>
    </div>

    <!-- Bottom Citizen Trio: Hotlines, Advisories, Upcoming PH Holidays -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Philippine Emergency & Citizen Hotlines -->
      <AntigravityCard depth="recessed" :max-tilt="1" as="div" class="p-6">
        <div class="mb-4 flex items-center gap-2.5">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson/10 text-crimson dark:bg-crimson/20 dark:text-crimson-bright"
          >
            <PhoneCall class="h-4.5 w-4.5" />
          </div>
          <div>
            <p class="text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
              1-Tap Dial Directory
            </p>
            <h3 class="font-serif text-lg font-bold text-slate-ink dark:text-white">
              Emergency & Citizen Hotlines
            </h3>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <a
            v-for="line in hotlines"
            :key="line.id"
            :href="line.telHref"
            class="group flex items-center justify-between gap-3 rounded-2xl bg-slate-50/90 px-3.5 py-2.5 transition-all hover:bg-white hover:shadow-float-chip dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
          >
            <div class="min-w-0">
              <p class="truncate text-xs font-bold text-slate-ink dark:text-slate-100">
                {{ line.name }}
              </p>
              <p class="truncate text-[11px] text-slate-meta dark:text-slate-400">
                {{ line.category }}
              </p>
            </div>
            <span
              class="shrink-0 rounded-full bg-crimson px-3 py-1 text-xs font-extrabold tabular-nums text-white transition-transform group-hover:scale-105"
            >
              {{ line.number }}
            </span>
          </a>
        </div>
      </AntigravityCard>

      <!-- Official Public Advisories -->
      <AntigravityCard depth="recessed" :max-tilt="1" as="div" class="p-6">
        <div class="mb-4 flex items-center gap-2.5">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-civic/10 text-civic dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <ShieldAlert class="h-4.5 w-4.5" />
          </div>
          <div>
            <p class="text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
              Verified Sources
            </p>
            <h3 class="font-serif text-lg font-bold text-slate-ink dark:text-white">
              Official Public Advisories
            </h3>
          </div>
        </div>

        <div class="space-y-2.5">
          <a
            v-for="adv in advisories"
            :key="adv.id"
            :href="adv.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-start justify-between gap-3 rounded-2xl bg-slate-50/90 p-3.5 transition-all hover:bg-white hover:shadow-float-chip dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-extrabold text-civic dark:text-emerald-300">
                  {{ adv.agency }}
                </span>
                <span
                  class="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-meta dark:bg-white/10 dark:text-slate-300"
                >
                  {{ adv.badge }}
                </span>
              </div>
              <p class="mt-1 text-xs font-semibold text-slate-ink dark:text-slate-100">
                {{ adv.title }}
              </p>
              <p class="mt-0.5 text-[11px] leading-snug text-slate-meta line-clamp-2 dark:text-slate-400">
                {{ adv.description }}
              </p>
            </div>
            <ArrowUpRight
              class="mt-0.5 h-4 w-4 shrink-0 text-slate-meta transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-civic dark:group-hover:text-emerald-300"
            />
          </a>
        </div>
      </AntigravityCard>

      <!-- Upcoming Philippine Holidays -->
      <AntigravityCard depth="recessed" :max-tilt="1" as="div" class="p-6">
        <div class="mb-4 flex items-center gap-2.5">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-ochre/10 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
          >
            <CalendarDays class="h-4.5 w-4.5" />
          </div>
          <div>
            <p class="text-[10px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
              Calendar & Workweek
            </p>
            <h3 class="font-serif text-lg font-bold text-slate-ink dark:text-white">
              Upcoming PH Holidays
            </h3>
          </div>
        </div>

        <div v-if="upcomingHolidays.length > 0" class="space-y-2.5">
          <div
            v-for="holiday in upcomingHolidays"
            :key="holiday.id"
            class="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/90 p-3.5 dark:bg-white/[0.04]"
          >
            <div class="min-w-0">
              <p class="truncate text-xs font-bold text-slate-ink dark:text-slate-100">
                {{ holiday.name }}
              </p>
              <div class="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-meta dark:text-slate-400">
                <span>{{ holiday.formattedDate }}</span>
                <span>•</span>
                <span>{{ holiday.type }}</span>
              </div>
            </div>
            <span
              class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums"
              :class="
                holiday.type === 'Regular Holiday'
                  ? 'bg-crimson/10 text-crimson dark:bg-crimson/20 dark:text-crimson-bright'
                  : 'bg-ochre/12 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright'
              "
            >
              {{ holiday.countdownLabel }}
            </span>
          </div>
        </div>

        <p v-else class="text-xs text-slate-meta dark:text-slate-400">
          National holiday calendar updates soon.
        </p>
      </AntigravityCard>
    </div>
  </section>
</template>
