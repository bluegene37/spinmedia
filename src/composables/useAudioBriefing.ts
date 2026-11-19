// Gene - Nov, 19, 2026: Shared audio/podcast briefing player store wired to SPIN Media broadcasts and show hosts
import { computed, ref, watch } from 'vue'
import { useSpinData } from '@/composables/useSpinData'
import {
  estimateDurationSeconds,
  formatClockTime,
  formatEditorialHeadline,
} from '@/utils/editorialFormat'
import type { MediaItem } from '@/types/spin'

export interface AudioTrack {
  id: string
  title: string
  showLabel: string
  hostLabel: string
  publishedAt: string
  durationSeconds: number
  thumbnailUrl?: string
  externalUrl: string
  mediaItem: MediaItem
}

const RATES = [1, 1.25, 1.5] as const
type PlaybackRate = (typeof RATES)[number]

const activeTrackId = ref<string | null>(null)
const customItem = ref<MediaItem | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const playbackRate = ref<PlaybackRate>(1)
const volume = ref(0.85)
const isMuted = ref(false)
const isMinimized = ref(false)
const queueOpen = ref(false)

let timer: ReturnType<typeof setInterval> | null = null
let watcherBound = false

export function useAudioBriefing() {
  const { media, shows } = useSpinData()

  const hostLookup = computed(() => {
    const map = new Map<string, string>()
    for (const show of shows.value) {
      map.set(show.slug, show.hosts.join(' & '))
    }
    return map
  })

  const tracks = computed<AudioTrack[]>(() => {
    if (media.value.length === 0) return []

    const episodes = media.value.filter((m) => m.format === 'episode')
    const reports = media.value.filter((m) => m.format === 'report')
    const shorts = media.value.filter((m) => m.format === 'short')
    const posts = media.value.filter((m) => m.format === 'post')

    const ordered = [...episodes, ...reports, ...shorts, ...posts].slice(0, 10)
    if (customItem.value && !ordered.some((m) => m.id === customItem.value?.id)) {
      ordered.unshift(customItem.value)
    }

    return ordered.map((item) => ({
      id: item.id,
      title: formatEditorialHeadline(item.title),
      showLabel: item.showLabel,
      hostLabel: hostLookup.value.get(item.showSlug) ?? 'SPIN Media News Desk',
      publishedAt: item.publishedAt,
      durationSeconds: estimateDurationSeconds(item),
      thumbnailUrl: item.thumbnailUrl,
      externalUrl: item.externalUrl,
      mediaItem: item,
    }))
  })

  const activeIndex = computed(() => {
    if (tracks.value.length === 0) return -1
    if (activeTrackId.value) {
      const idx = tracks.value.findIndex((t) => t.id === activeTrackId.value)
      if (idx !== -1) return idx
    }
    return 0
  })

  const activeTrack = computed<AudioTrack | null>(() => {
    if (activeIndex.value === -1) return null
    return tracks.value[activeIndex.value] ?? null
  })

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const startTimer = () => {
    stopTimer()
    timer = setInterval(() => {
      const track = activeTrack.value
      if (!track || !isPlaying.value) return
      const next = currentTime.value + 0.25 * playbackRate.value
      if (next >= track.durationSeconds) {
        if (tracks.value.length > 1) {
          const nextIdx = (activeIndex.value + 1) % tracks.value.length
          activeTrackId.value = tracks.value[nextIdx].id
          currentTime.value = 0
        } else {
          currentTime.value = 0
          isPlaying.value = false
        }
      } else {
        currentTime.value = next
      }
    }, 250)
  }

  if (!watcherBound) {
    watcherBound = true
    watch(
      isPlaying,
      (playing) => {
        if (playing) {
          startTimer()
        } else {
          stopTimer()
        }
      },
      { immediate: true },
    )

    watch(
      tracks,
      (list) => {
        if (list.length > 0 && !activeTrackId.value) {
          activeTrackId.value = list[0].id
          currentTime.value = 42 // Start slightly into the briefing for an authentic preview state
        }
      },
      { immediate: true },
    )
  }

  const playTrack = (itemOrId: MediaItem | string) => {
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id

    if (activeTrackId.value === id) {
      isPlaying.value = !isPlaying.value
      isMinimized.value = false
      return
    }

    // Keep external/filtered items playable by pinning them into the active queue
    if (typeof itemOrId !== 'string') {
      customItem.value = itemOrId
    }

    activeTrackId.value = id
    currentTime.value = 0
    isPlaying.value = true
    isMinimized.value = false
  }

  const togglePlay = () => {
    if (!activeTrack.value) return
    isPlaying.value = !isPlaying.value
  }

  const seekTo = (seconds: number) => {
    const track = activeTrack.value
    if (!track) return
    currentTime.value = Math.max(0, Math.min(track.durationSeconds, seconds))
  }

  const skipBy = (delta: number) => {
    seekTo(currentTime.value + delta)
  }

  const nextTrack = () => {
    if (tracks.value.length === 0) return
    const nextIdx = (activeIndex.value + 1) % tracks.value.length
    activeTrackId.value = tracks.value[nextIdx].id
    currentTime.value = 0
    isPlaying.value = true
  }

  const prevTrack = () => {
    if (tracks.value.length === 0) return
    if (currentTime.value > 5) {
      currentTime.value = 0
      return
    }
    const prevIdx = (activeIndex.value - 1 + tracks.value.length) % tracks.value.length
    activeTrackId.value = tracks.value[prevIdx].id
    currentTime.value = 0
    isPlaying.value = true
  }

  const cycleRate = () => {
    const idx = RATES.indexOf(playbackRate.value)
    playbackRate.value = RATES[(idx + 1) % RATES.length]
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }

  const setVolume = (val: number) => {
    volume.value = Math.max(0, Math.min(1, val))
    if (volume.value > 0 && isMuted.value) {
      isMuted.value = false
    }
  }

  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value
    if (isMinimized.value) {
      queueOpen.value = false
    }
  }

  const toggleQueue = () => {
    queueOpen.value = !queueOpen.value
  }

  const isTrackPlaying = (id: string) => isPlaying.value && activeTrack.value?.id === id

  const progressPercent = computed(() => {
    const track = activeTrack.value
    if (!track || track.durationSeconds <= 0) return 0
    return Math.min(100, Math.max(0, (currentTime.value / track.durationSeconds) * 100))
  })

  const formattedElapsed = computed(() => formatClockTime(currentTime.value))
  const formattedDuration = computed(() =>
    activeTrack.value ? formatClockTime(activeTrack.value.durationSeconds) : '0:00',
  )

  return {
    tracks,
    activeTrack,
    activeTrackId,
    isPlaying,
    currentTime,
    playbackRate,
    volume,
    isMuted,
    isMinimized,
    queueOpen,
    progressPercent,
    formattedElapsed,
    formattedDuration,
    isTrackPlaying,
    playTrack,
    togglePlay,
    seekTo,
    skipBy,
    nextTrack,
    prevTrack,
    cycleRate,
    toggleMute,
    setVolume,
    toggleMinimize,
    toggleQueue,
  }
}
