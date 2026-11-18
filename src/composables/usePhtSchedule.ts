import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { ShowProgram } from '@/types/spin'

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

function getManilaTimeParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(date)
  const weekdayStr = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const hourStr = parts.find((p) => p.type === 'hour')?.value ?? '12'
  const day = DAY_INDEX[weekdayStr] ?? 1
  const hour = Number(hourStr) % 24

  // const displayClock = new Intl.DateTimeFormat('en-PH', {
  //   timeZone: 'Asia/Manila',
  //   weekday: 'short',
  //   hour: 'numeric',
  //   minute: '2-digit',
  //   hour12: true,
  // }).format(date)
  //
  // return { day, hour, displayClock }
  // Gene - Nov, 19, 2026: Provide full Manila dateline alongside live PHT broadcast clock
  const displayClock = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  const displayDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)

  return { day, hour, displayClock, displayDate }
}

export function formatPublishedDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatViewCount(views?: number): string | null {
  if (views === undefined || views === null) return null
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
  return `${views} views`
}

export function usePhtSchedule(shows: Ref<ShowProgram[]>) {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, 30_000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  const manila = computed(() => getManilaTimeParts(now.value))

  const flagshipShows = computed(() =>
    shows.value.filter((s) => s.slug !== 'breaking-news'),
  )

  const liveShow = computed<ShowProgram | null>(() => {
    const { day, hour } = manila.value
    return (
      flagshipShows.value.find(
        (s) => s.dayOfWeek.includes(day) && hour >= s.startHourPht && hour < s.endHourPht,
      ) ?? null
    )
  })

  const nextShow = computed<ShowProgram | null>(() => {
    if (flagshipShows.value.length === 0) return null
    const { day, hour } = manila.value
    let best: { show: ShowProgram; offsetHours: number } | null = null

    for (const show of flagshipShows.value) {
      for (const showDay of show.dayOfWeek) {
        let dayDiff = (showDay - day + 7) % 7
        if (dayDiff === 0 && hour >= show.endHourPht) {
          dayDiff = 7
        }
        const offsetHours = dayDiff * 24 + (show.startHourPht - hour)
        if (offsetHours >= 0 && (!best || offsetHours < best.offsetHours)) {
          best = { show, offsetHours }
        }
      }
    }

    return best?.show ?? flagshipShows.value[0] ?? null
  })

  // return {
  //   manilaClock: computed(() => manila.value.displayClock),
  //   liveShow,
  //   nextShow,
  // }
  // Gene - Nov, 19, 2026: Expose formatted Manila date for editorial masthead dateline
  return {
    manilaClock: computed(() => manila.value.displayClock),
    manilaDate: computed(() => manila.value.displayDate),
    liveShow,
    nextShow,
  }
}
