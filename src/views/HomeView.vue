<script setup lang="ts">
// import { computed } from 'vue'
// Gene - Nov, 19, 2026: Support interactive Lead Wire selection on Front Page
// import { computed, ref } from 'vue'
// Gene - Nov, 19, 2026: Live essentials bootstrap and Good News reader modal lifecycle hooks
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// import {
//   ArrowRight,
//   CalendarClock,
//   ExternalLink,
//   Facebook,
//   PlayCircle,
//   Radio,
//   Tv,
//   Users,
//   Youtube,
// } from 'lucide-vue-next'
// import { useSpinData } from '@/composables/useSpinData'
// import { useTheme } from '@/composables/useTheme'
// Gene - Nov, 19, 2026: Editorial Front Page icons & date/view formatting helpers
// import {
//   ArrowRight,
//   CalendarClock,
//   ExternalLink,
//   Radio,
//   Tv,
//   Users,
//   Youtube,
// } from 'lucide-vue-next'
// Gene - Nov, 19, 2026: Icons for Antigravity hero controls, desk filters, and inline audio triggers
// import {
//   ArrowUpRight,
//   CalendarClock,
//   ExternalLink,
//   Facebook,
//   Headphones,
//   Pause,
//   Play,
//   Radio,
//   Sparkles,
//   Users,
//   Volume2,
//   Youtube,
// } from 'lucide-vue-next'
// Gene - Nov, 19, 2026: Remove audio briefing icons & sidebar panel in favor of SocialSnipsSidebar
/*
import {
  ArrowUpRight,
  CalendarClock,
  ExternalLink,
  Facebook,
  Pause,
  Play,
  Radio,
  Sparkles,
  Users,
  Youtube,
} from 'lucide-vue-next'
*/
/*
// Gene - Nov, 19, 2026: Added weather, citizen essentials, and Good News PH reader icons
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Car,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  ExternalLink,
  Facebook,
  Heart,
  MapPin,
  Pause,
  Play,
  Radio,
  Sparkles,
  Sun,
  Users,
  X,
  Youtube,
} from 'lucide-vue-next'
*/
/*
// Gene - Nov, 20, 2026: Added Award, Calendar, and Images icons for Gawad Parangal Annual Awards Spotlight
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  CalendarClock,
  Car,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  ExternalLink,
  Facebook,
  Heart,
  Images,
  MapPin,
  Pause,
  Play,
  Radio,
  Sparkles,
  Sun,
  Users,
  X,
  Youtube,
} from 'lucide-vue-next'
*/
// Gene - Nov, 23, 2026: Added Briefcase and Handshake icons for Initiatives & PSEPRI Institutional Partnership spotlight
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarClock,
  Car,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  ExternalLink,
  Facebook,
  Handshake,
  Heart,
  Images,
  MapPin,
  Pause,
  Play,
  Radio,
  Sparkles,
  Sun,
  Users,
  X,
  Youtube,
} from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
// import { formatPublishedDate, formatViewCount } from '@/composables/usePhtSchedule'
// import TheaterPlayer from '@/components/media/TheaterPlayer.vue'
// import MediaCard from '@/components/media/MediaCard.vue'
// Gene - Nov, 19, 2026: Antigravity floating cards, audio store, and editorial headline formatting
// import { useAudioBriefing } from '@/composables/useAudioBriefing'
// import FacebookTimelinePanel from '@/components/media/FacebookTimelinePanel.vue'
import { formatPublishedDate, formatViewCount, usePhtSchedule } from '@/composables/usePhtSchedule'
import { useLiveEssentials, type WeatherIconName } from '@/composables/useLiveEssentials'
import PublicEssentialsHub from '@/components/essentials/PublicEssentialsHub.vue'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'
import SocialSnipsSidebar from '@/components/media/SocialSnipsSidebar.vue'
import {
  estimateDurationLabel,
  formatEditorialHeadline,
  formatEditorialSummary,
  isPositiveMediaItem,
} from '@/utils/editorialFormat'
import type { MediaItem, PositiveNewsCategory, PositiveNewsItem } from '@/types/spin'

/*
type DeskFilter = 'all' | 'shows' | 'dispatches' | 'shorts' | 'facebook'

const router = useRouter()
const { site, shows, media } = useSpinData()
const { manilaDate, liveShow, nextShow } = usePhtSchedule(shows)

const selectedLeadId = ref<string | null>(null)
const isHeroPlaying = ref(false)
const heroThumbFailed = ref(false)
const activeDeskFilter = ref<DeskFilter>('all')
const failedCardThumbs = ref<Record<string, boolean>>({})

const deskFilterOptions: { id: DeskFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'shows', label: 'Shows' },
  { id: 'dispatches', label: 'Dispatches' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'facebook', label: 'Facebook' },
]

const featuredBroadcast = computed<MediaItem | null>(() => {
  return (
    media.value.find((m) => m.featured && m.platform === 'youtube') ??
    media.value.find((m) => m.platform === 'youtube' && m.format === 'episode') ??
    media.value[0] ??
    null
  )
})

const activeLeadBroadcast = computed<MediaItem | null>(() => {
  if (selectedLeadId.value) {
    const picked = media.value.find((m) => m.id === selectedLeadId.value)
    if (picked) return picked
  }
  return featuredBroadcast.value
})
*/
// Gene - Nov, 19, 2026: Positive-news front-page filtering, live citizen desk telemetry, and Good News PH reader state
type DeskFilter = 'all' | 'shows' | 'reports' | 'facebook'
type PositiveNewsFilter = 'all' | PositiveNewsCategory

const router = useRouter()
const { site, shows, media, positiveNews, publicInfo } = useSpinData()
const { manilaDate, liveShow, nextShow } = usePhtSchedule(shows)
// Gene - Nov, 24, 2026: Resolve permanent YouTube Live URL for On Air pill click-through
const youtubeLiveUrl = computed(() =>
  site.value?.youtubeChannelId
    ? `https://www.youtube.com/channel/${site.value.youtubeChannelId}/live`
    : 'https://www.youtube.com/@spinmediatvphilippines/live',
)
const { weather, bootstrap: bootstrapEssentials, getCodingStatus } = useLiveEssentials()

const selectedLeadId = ref<string | null>(null)
const isHeroPlaying = ref(false)
const heroThumbFailed = ref(false)
const activeDeskFilter = ref<DeskFilter>('all')
const activePositiveCategory = ref<PositiveNewsFilter>('all')
const activeGoodNewsStory = ref<PositiveNewsItem | null>(null)
const failedCardThumbs = ref<Record<string, boolean>>({})

const deskFilterOptions: { id: DeskFilter; label: string }[] = [
  { id: 'all', label: 'All Uplifting' },
  { id: 'shows', label: 'Shows' },
  { id: 'reports', label: 'Reports' },
  { id: 'facebook', label: 'Facebook' },
]

const positiveCategoryOptions: { id: PositiveNewsFilter; label: string }[] = [
  { id: 'all', label: 'All Good News' },
  { id: 'community', label: 'Community Hero' },
  { id: 'ofw', label: 'OFW & Bayanihan' },
  { id: 'family', label: 'Family & Values' },
  { id: 'progress', label: 'Innovation' },
]

const datelineCoding = computed(() => getCodingStatus(publicInfo.value?.holidays ?? []))

const positiveMedia = computed<MediaItem[]>(() => media.value.filter(isPositiveMediaItem))

const filteredPositiveNews = computed<PositiveNewsItem[]>(() => {
  if (activePositiveCategory.value === 'all') return positiveNews.value
  return positiveNews.value.filter((story) => story.category === activePositiveCategory.value)
})

/*
const featuredBroadcast = computed<MediaItem | null>(() => {
  const pool = positiveMedia.value
  return (
    pool.find((m) => m.featured && m.platform === 'youtube') ??
    pool.find((m) => m.platform === 'youtube' && m.format === 'episode') ??
    pool[0] ??
    null
  )
})
*/
// Gene - Nov, 19, 2026: Auto-promote newest positive horizontal YouTube video to Lead Hero when live uploads arrive
const featuredBroadcast = computed<MediaItem | null>(() => {
  const pool = positiveMedia.value
  return (
    pool.find(
      (m) => m.platform === 'youtube' && (m.format === 'episode' || m.format === 'report'),
    ) ??
    pool.find((m) => m.platform === 'youtube') ??
    pool[0] ??
    null
  )
})

const activeLeadBroadcast = computed<MediaItem | null>(() => {
  if (selectedLeadId.value) {
    const picked = positiveMedia.value.find((m) => m.id === selectedLeadId.value)
    if (picked) return picked
  }
  return featuredBroadcast.value
})

watch(
  () => activeLeadBroadcast.value?.id,
  () => {
    heroThumbFailed.value = false
  },
)

const heroYoutubeEmbedSrc = computed(() => {
  const lead = activeLeadBroadcast.value
  if (!lead || lead.platform !== 'youtube') return ''
  if (!lead.videoId) return lead.embedUrl ?? ''
  return `https://www.youtube-nocookie.com/embed/${lead.videoId}?autoplay=1&rel=0`
})

/*
const filteredStories = computed<MediaItem[]>(() => {
  const leadId = activeLeadBroadcast.value?.id
  return media.value.filter((item) => {
    if (item.id === leadId) return false
    if (activeDeskFilter.value === 'shows') {
      return item.format === 'episode'
    }
    if (activeDeskFilter.value === 'dispatches') {
      return item.showSlug === 'breaking-news' && item.platform === 'youtube'
    }
    if (activeDeskFilter.value === 'shorts') {
      return item.platform === 'youtube' && item.format === 'short'
    }
    if (activeDeskFilter.value === 'facebook') {
      return item.platform === 'facebook'
    }
    return true
  })
})

const elevatedFeaturePair = computed(() => filteredStories.value.slice(0, 2))
const secondaryTrio = computed(() => filteredStories.value.slice(2, 5))
const wireDispatches = computed(() => media.value.slice(0, 5))
*/
// Gene - Nov, 19, 2026: Filter positive-only dispatches on Homepage while keeping /media archive complete
const filteredStories = computed<MediaItem[]>(() => {
  const leadId = activeLeadBroadcast.value?.id
  return positiveMedia.value.filter((item) => {
    if (item.id === leadId) return false
    if (activeDeskFilter.value === 'shows') {
      return item.format === 'episode'
    }
    if (activeDeskFilter.value === 'reports') {
      return item.platform === 'youtube' && (item.format === 'report' || item.format === 'short')
    }
    if (activeDeskFilter.value === 'facebook') {
      return item.platform === 'facebook'
    }
    return true
  })
})

const elevatedFeaturePair = computed(() => filteredStories.value.slice(0, 2))
const secondaryTrio = computed(() => filteredStories.value.slice(2, 5))
const wireDispatches = computed(() => positiveMedia.value.slice(0, 5))
// Gene - Nov, 19, 2026: Exclude prominent lead/feature story IDs from the right social snips sidebar
const visibleMainIds = computed(() => {
  const ids: string[] = []
  if (activeLeadBroadcast.value) ids.push(activeLeadBroadcast.value.id)
  for (const item of elevatedFeaturePair.value) ids.push(item.id)
  return ids
})

// const wireStories = computed(() => media.value.slice(0, 5))
//
// const latestHighlights = computed(() => media.value.slice(0, 6))
//
// const accentBorder = (accent: string) => {
//   if (accent === 'crimson') return 'border-t-red-600'
//   if (accent === 'gold') return 'border-t-amber-500'
//   return 'border-t-blue-600'
// }
// Gene - Nov, 19, 2026: Replace SwitchFiber blue top border with civic teal editorial accent
// const accentBorder = (accent: string) => {
//   if (accent === 'crimson') return 'border-t-crimson dark:border-t-crimson-bright'
//   if (accent === 'gold') return 'border-t-ochre dark:border-t-ochre-bright'
//   return 'border-t-civic dark:border-t-[#2DD4BF]'
// }
//
// const selectLeadStory = (item: MediaItem) => {
//   selectedLeadId.value = item.id
// }
// Gene - Nov, 19, 2026: Soft floating indicator dot accents and Antigravity lead/card helpers
const accentDot = (accent: string) => {
  if (accent === 'crimson') return 'bg-crimson dark:bg-crimson-bright'
  if (accent === 'gold') return 'bg-ochre dark:bg-ochre-bright'
  return 'bg-civic dark:bg-[#2DD4BF]'
}

const selectLeadStory = (item: MediaItem, autoplay = true) => {
  selectedLeadId.value = item.id
  isHeroPlaying.value = autoplay && item.platform === 'youtube'
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const onCardThumbError = (id: string) => {
  failedCardThumbs.value = { ...failedCardThumbs.value, [id]: true }
}

const platformBadgeLabel = (item: MediaItem) => {
  if (item.platform === 'facebook') return 'Facebook Dispatch'
  if (item.format === 'short') return 'YouTube Short'
  if (item.format === 'report') return 'Special Report'
  return 'Broadcast Episode'
}

const openInMediaHub = (item: MediaItem) => {
  void router.push({ path: '/media', query: { play: item.id } })
}

// Gene - Nov, 19, 2026: Weather icon mapping, citizen desk scroll helper, and Good News Reader modal controls
const resolveWeatherIcon = (name: WeatherIconName) => {
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

const scrollToEssentials = () => {
  if (typeof document === 'undefined') return
  const target = document.getElementById('citizen-essentials')
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const openGoodNewsStory = (story: PositiveNewsItem) => {
  activeGoodNewsStory.value = story
}

const closeGoodNewsStory = () => {
  activeGoodNewsStory.value = null
}

const positiveAccentBadge = (accent: PositiveNewsItem['accentColor']) => {
  if (accent === 'crimson') {
    return 'bg-crimson/10 text-crimson dark:bg-crimson/20 dark:text-crimson-bright'
  }
  if (accent === 'ochre') {
    return 'bg-ochre/12 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright'
  }
  return 'bg-civic/10 text-civic dark:bg-emerald-500/15 dark:text-emerald-300'
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && activeGoodNewsStory.value) {
    closeGoodNewsStory()
  }
}

onMounted(() => {
  bootstrapEssentials()
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <!--
  <div>
  -->
    <!-- Hero Broadcast Stage -->
  <!--
    <section
      class="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80"
      :class="isDark ? 'studio-grid-bg bg-[#070D1F]' : 'newsroom-grid-bg bg-white'"
    >
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div class="grid items-center gap-10 lg:grid-cols-12">
  -->
          <!-- Copy Column -->
  <!--
          <div class="space-y-6 lg:col-span-6">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold tracking-wide text-red-600 uppercase ring-1 ring-red-600/20 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-500/30"
              >
                <Radio class="h-3.5 w-3.5" />
                {{ site?.parentOrg ?? 'Secure the Philippines Information Network' }}
              </span>
            </div>

            <div class="space-y-3">
              <h1
                class="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white"
              >
                One Digital Hub for Every
                <span class="text-red-600 dark:text-red-500">SPIN Media TV</span>
                Broadcast
              </h1>
              <p class="text-base font-semibold text-amber-600 dark:text-amber-400">
                &ldquo;{{ site?.tagline ?? 'Adding Value, Creating Significance.' }}&rdquo;
              </p>
              <p class="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                {{
                  site?.description ??
                  'Watch full public affairs forums, daily national and international news dispatches, and live Facebook updates across all official SPIN Media channels in one place.'
                }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <RouterLink
                to="/media"
                class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
              >
                <PlayCircle class="h-4 w-4" />
                Explore Media Hub
              </RouterLink>
              <a
                v-if="site"
                :href="site.facebookPageUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                <Facebook class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Follow on Facebook
              </a>
            </div>
  -->
            <!-- Official Social Strip -->
  <!--
            <div class="pt-2">
              <p
                class="mb-2.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
              >
                Verified Social Channels
              </p>
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="social in site?.socials ?? []"
                  :key="social.id"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-500/40 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-amber-400/40 dark:hover:text-amber-300"
                >
                  <span>{{ social.label }}</span>
                  <span class="text-slate-400">{{ social.handle }}</span>
                  <ExternalLink class="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
  -->
          <!-- Featured Stage Column -->
  <!--
          <div class="lg:col-span-6">
            <div class="mb-2 flex items-center justify-between text-xs">
              <span
                class="inline-flex items-center gap-1.5 font-bold tracking-wider text-red-600 uppercase dark:text-amber-400"
              >
                <Tv class="h-3.5 w-3.5" />
                Featured Broadcast Spotlight
              </span>
              <RouterLink
                to="/media"
                class="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-white"
              >
                All videos
                <ArrowRight class="h-3.5 w-3.5" />
              </RouterLink>
            </div>
            <TheaterPlayer
              v-if="featuredBroadcast"
              :item="featuredBroadcast"
              :autoplay-on-change="false"
            />
          </div>
        </div>
      </div>
    </section>
  -->
    <!-- Weekly Program Schedule -->
  <!--
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p class="text-xs font-bold tracking-wider text-red-600 uppercase dark:text-amber-400">
            Program Lineup (Philippine Standard Time)
          </p>
          <h2 class="font-display mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            Public Affairs Shows &amp; Daily Coverage
          </h2>
        </div>
        <RouterLink
          to="/about"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 transition hover:text-red-600 dark:text-slate-300 dark:hover:text-amber-400"
        >
          Meet our hosts &amp; leadership
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="show in shows"
          :key="show.id"
          :to="{ path: '/media', query: { show: show.slug } }"
          class="group flex flex-col justify-between rounded-2xl border border-slate-200 border-t-4 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0E1730]"
          :class="accentBorder(show.accentColor)"
        >
          <div>
            <div class="flex items-center justify-between gap-2 text-xs">
              <span class="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-amber-300">
                <CalendarClock class="h-3.5 w-3.5" />
                {{ show.dayLabel }}
              </span>
              <span class="font-medium text-slate-500 dark:text-slate-400">
                {{ show.timeLabel }}
              </span>
            </div>

            <h3
              class="font-display mt-3 text-lg font-extrabold text-slate-900 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-amber-300"
            >
              {{ show.title }}
            </h3>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {{ show.subtitle }}
            </p>
            <p class="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {{ show.summary }}
            </p>
          </div>

          <div
            class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800/80"
          >
            <span class="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <Users class="h-3.5 w-3.5 text-slate-400" />
              {{ show.hosts.join(', ') }}
            </span>
            <span class="font-bold text-red-600 dark:text-amber-400">Episodes &rarr;</span>
          </div>
        </RouterLink>
      </div>
    </section>
  -->
    <!-- Latest Highlights + Live Facebook Sidebar -->
  <!--
    <section
      class="border-t border-slate-200/80 bg-slate-100/70 py-12 dark:border-slate-800/80 dark:bg-[#050A18]/60"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p class="text-xs font-bold tracking-wider text-red-600 uppercase dark:text-red-400">
              YouTube &amp; Facebook Unified Stream
            </p>
            <h2 class="font-display mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              Latest Broadcasts &amp; Dispatches
            </h2>
          </div>
          <RouterLink
            to="/media"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase transition hover:bg-red-600 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
          >
            <Youtube class="h-4 w-4" />
            Open Full Media Hub ({{ media.length }})
          </RouterLink>
        </div>

        <div class="grid gap-8 lg:grid-cols-12">
          <div class="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            <MediaCard
              v-for="item in latestHighlights"
              :key="item.id"
              :item="item"
              @select="openInMediaHub"
            />
          </div>

          <div class="lg:col-span-4">
            <div class="lg:sticky lg:top-20">
              <FacebookTimelinePanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Editorial Broadsheet Front Page & Broadcast Media Center -->
  <!-- <div> -->
    <!-- Section 1: Front Page Lead Desk -->
  <!--
    <section class="border-b border-rule bg-white dark:border-obsidian-rule dark:bg-obsidian-card">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div
          class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 dark:border-obsidian-rule"
        >
          <span
            class="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
          >
            <Radio class="h-3.5 w-3.5" />
            Lead Broadcast &amp; Breaking Wire
          </span>

          <div class="flex flex-wrap items-center gap-1.5">
            <a
              v-for="social in site?.socials ?? []"
              :key="social.id"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink-muted transition hover:border-crimson/50 hover:text-crimson dark:border-obsidian-rule dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:border-ochre-bright/50 dark:hover:text-ochre-bright"
            >
              <span>{{ social.label }}</span>
              <ExternalLink class="h-2.5 w-2.5 opacity-70" />
            </a>
          </div>
        </div>

        <div class="grid items-start gap-8 lg:grid-cols-12">
          <div class="lg:col-span-8">
            <div class="mb-2.5 flex items-center justify-between text-xs">
              <span
                class="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-ink uppercase dark:text-[#F5F4F0]"
              >
                <Tv class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                Featured Broadcast Spotlight
              </span>
              <RouterLink
                to="/media"
                class="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tracking-wider text-crimson uppercase hover:underline dark:text-ochre-bright"
              >
                All Broadcasts
                <ArrowRight class="h-3.5 w-3.5" />
              </RouterLink>
            </div>
            <TheaterPlayer
              v-if="activeLeadBroadcast"
              :item="activeLeadBroadcast"
              :autoplay-on-change="selectedLeadId !== null"
            />
          </div>

          <aside class="border-t-2 border-ink pt-3 lg:col-span-4 dark:border-crimson-bright">
            <p
              class="font-mono text-[10px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
            >
              Latest Wire
            </p>
            <h2 class="font-display mt-0.5 text-xl font-extrabold text-ink dark:text-[#F5F4F0]">
              Top Dispatches
            </h2>

            <div
              class="mt-3 divide-y divide-rule border-t border-b border-rule dark:divide-obsidian-rule dark:border-obsidian-rule"
            >
              <button
                v-for="(item, idx) in wireStories"
                :key="item.id"
                type="button"
                class="group flex w-full cursor-pointer items-start gap-3 border-l-2 py-3 pr-2 pl-2.5 text-left transition"
                :class="
                  activeLeadBroadcast?.id === item.id
                    ? 'border-l-crimson bg-paper dark:border-l-crimson-bright dark:bg-white/5'
                    : 'border-l-transparent hover:bg-paper/70 dark:hover:bg-white/5'
                "
                @click="selectLeadStory(item)"
              >
                <span
                  class="mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums"
                  :class="
                    activeLeadBroadcast?.id === item.id
                      ? 'text-crimson dark:text-crimson-bright'
                      : 'text-ink-subtle dark:text-[#9A968D]'
                  "
                >
                  {{ String(idx + 1).padStart(2, '0') }}
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center justify-between gap-1.5">
                    <span
                      class="text-[10px] font-bold tracking-wider text-ochre uppercase dark:text-ochre-bright"
                    >
                      {{ item.showLabel }}
                    </span>
                    <span class="font-mono text-[10px] text-ink-subtle dark:text-[#9A968D]">
                      {{ formatPublishedDate(item.publishedAt) }}
                    </span>
                  </div>
                  <h3
                    class="font-display mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink transition group-hover:text-crimson dark:text-[#F5F4F0] dark:group-hover:text-ochre-bright"
                  >
                    {{ item.title }}
                  </h3>
                  <p
                    v-if="formatViewCount(item.views)"
                    class="mt-1 font-mono text-[10px] tabular-nums text-ink-subtle dark:text-[#9A968D]"
                  >
                    {{ formatViewCount(item.views) }}
                  </p>
                </div>
              </button>
            </div>

            <RouterLink
              to="/media"
              class="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-crimson uppercase hover:underline dark:text-ochre-bright"
            >
              Open Full Media Hub ({{ media.length }})
              <ArrowRight class="h-3.5 w-3.5" />
            </RouterLink>
          </aside>
        </div>
      </div>
    </section>
  -->

    <!-- Section 2: Video Desk & Social Wire -->
  <!--
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div
        class="mb-6 flex flex-col justify-between gap-3 border-t-2 border-ink pt-3 sm:flex-row sm:items-end dark:border-obsidian-rule"
      >
        <div>
          <p
            class="font-mono text-[11px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
          >
            Video Desk &bull; YouTube &amp; Facebook
          </p>
          <h2
            class="font-display mt-1 text-2xl font-extrabold text-ink sm:text-3xl dark:text-[#F5F4F0]"
          >
            Latest Broadcasts &amp; Dispatches
          </h2>
        </div>
        <RouterLink
          to="/media"
          class="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 font-mono text-xs font-semibold tracking-wider text-[#F5F4F0] uppercase transition hover:bg-crimson dark:bg-crimson dark:hover:bg-crimson-dark"
        >
          <Youtube class="h-4 w-4" />
          Full Media Archive ({{ media.length }})
        </RouterLink>
      </div>

      <div class="grid gap-8 lg:grid-cols-12">
        <div class="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          <MediaCard
            v-for="item in latestHighlights"
            :key="item.id"
            :item="item"
            @select="openInMediaHub"
          />
        </div>

        <div class="lg:col-span-4">
          <div class="lg:sticky lg:top-16">
            <FacebookTimelinePanel />
          </div>
        </div>
      </div>
    </section>
  -->

    <!-- Section 3: Weekly On-Air Program Guide (PHT) -->
  <!--
    <section
      class="border-t border-rule bg-paper-alt/80 py-12 dark:border-obsidian-rule dark:bg-obsidian-alt"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          class="mb-6 flex flex-col justify-between gap-3 border-t-2 border-ink pt-3 sm:flex-row sm:items-end dark:border-obsidian-rule"
        >
          <div>
            <p
              class="font-mono text-[11px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
            >
              On-Air Schedule &bull; Philippine Standard Time
            </p>
            <h2
              class="font-display mt-1 text-2xl font-extrabold text-ink sm:text-3xl dark:text-[#F5F4F0]"
            >
              Public Affairs Programs &amp; Daily Coverage
            </h2>
          </div>
          <RouterLink
            to="/about"
            class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-ink uppercase transition hover:text-crimson dark:text-[#C4C1B8] dark:hover:text-ochre-bright"
          >
            Meet our hosts &amp; anchors
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="show in shows"
            :key="show.id"
            :to="{ path: '/media', query: { show: show.slug } }"
            class="group flex flex-col justify-between rounded-sm border border-rule border-t-[3px] bg-white p-5 transition hover:border-ink/40 hover:shadow-md dark:border-obsidian-rule dark:bg-obsidian-card dark:hover:border-white/25"
            :class="accentBorder(show.accentColor)"
          >
            <div>
              <div class="flex items-center justify-between gap-2 font-mono text-[11px]">
                <span class="inline-flex items-center gap-1 font-semibold text-ink dark:text-[#F5F4F0]">
                  <CalendarClock class="h-3.5 w-3.5 text-crimson dark:text-ochre-bright" />
                  {{ show.dayLabel }}
                </span>
                <span class="tabular-nums text-ink-subtle dark:text-[#9A968D]">
                  {{ show.timeLabel }}
                </span>
              </div>

              <h3
                class="font-display mt-3 text-xl font-extrabold text-ink transition group-hover:text-crimson dark:text-[#F5F4F0] dark:group-hover:text-ochre-bright"
              >
                {{ show.title }}
              </h3>
              <p class="font-display text-xs italic text-ink-muted dark:text-[#C4C1B8]">
                {{ show.subtitle }}
              </p>
              <p class="mt-2.5 text-xs leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
                {{ show.summary }}
              </p>
            </div>

            <div
              class="mt-4 flex items-center justify-between border-t border-rule pt-3 text-xs dark:border-obsidian-rule"
            >
              <span
                class="inline-flex items-center gap-1.5 font-medium text-ink-muted dark:text-[#C4C1B8]"
              >
                <Users class="h-3.5 w-3.5 text-ink-subtle dark:text-[#9A968D]" />
                {{ show.hosts.join(', ') }}
              </span>
              <span
                class="font-mono text-[11px] font-semibold tracking-wider text-crimson uppercase dark:text-ochre-bright"
              >
                Episodes &rarr;
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  -->

    <!-- Section 4: Compact Editorial Network Band -->
  <!--
    <section class="border-t border-rule bg-white py-10 dark:border-obsidian-rule dark:bg-obsidian-card">
      <div
        class="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8"
      >
        <div class="max-w-2xl space-y-2">
          <p
            class="font-mono text-[10px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
          >
            {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }}
          </p>
          <h2 class="font-display text-2xl font-extrabold text-ink dark:text-[#F5F4F0]">
            Independent Philippine Digital Journalism &mdash;
            <span class="italic text-ochre dark:text-ochre-bright">
              &ldquo;{{ site?.tagline ?? 'Adding Value, Creating Significance.' }}&rdquo;
            </span>
          </h2>
          <p class="text-sm leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
            {{
              site?.description ??
              'Independent Philippine digital broadcast network delivering public affairs dialogue, breaking local and international news, and community journalism across YouTube and Facebook.'
            }}
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-3">
          <RouterLink
            to="/about"
            class="rounded-sm border border-ink px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-ink uppercase transition hover:bg-ink hover:text-white dark:border-white/30 dark:text-[#F5F4F0] dark:hover:bg-white dark:hover:text-obsidian"
          >
            About Our Newsroom
          </RouterLink>
          <RouterLink
            to="/contact"
            class="rounded-sm bg-crimson px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-crimson-dark"
          >
            Send a News Tip
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Antigravity editorial homepage with floating borderless cards & Z-axis ambient depth -->
  <!--
  <div class="mx-auto max-w-6xl space-y-16 px-4 pt-6 pb-16 sm:space-y-20 sm:px-6 lg:px-8">
  -->
    <!-- Floating Editorial Dateline Strip -->
  <!--
    <section
      class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      aria-label="Edition Dateline"
    >
      <div class="flex flex-wrap items-center gap-2.5">
        <span
          class="text-[11px] font-bold tracking-[0.16em] text-slate-meta uppercase dark:text-slate-400"
        >
          Philippines Edition &bull; {{ manilaDate }}
        </span>

        <RouterLink
          v-if="liveShow"
          :to="{ path: '/media', query: { show: liveShow.slug } }"
          class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-float-chip transition hover:bg-crimson-dark"
        >
          <span class="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
          On Air &bull; {{ liveShow.title }}
        </RouterLink>
        <RouterLink
          v-else-if="nextShow"
          :to="{ path: '/media', query: { show: nextShow.slug } }"
          class="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-body backdrop-blur-md shadow-float-chip ring-1 ring-white/90 transition hover:text-crimson dark:bg-slate-900/80 dark:text-slate-300 dark:ring-white/10 dark:hover:text-ochre-bright"
        >
          <Radio class="h-3 w-3 text-crimson dark:text-crimson-bright" />
          Up Next: {{ nextShow.title }} ({{ nextShow.dayLabel.replace('Every ', '') }},
          {{ nextShow.timeLabel }})
        </RouterLink>
      </div>

      <p class="font-display text-sm italic text-slate-body dark:text-slate-400">
        &ldquo;{{ site?.tagline ?? 'Adding Value, Creating Significance.' }}&rdquo;
      </p>
    </section>
  -->

    <!-- Z-Plane 3 (Closest): Lead Hero Story -->
  <!--
    <AntigravityCard
      v-if="activeLeadBroadcast"
      depth="hero"
      :max-tilt="1.4"
      :interactive="!isHeroPlaying"
      as="section"
      aria-label="Lead Hero Story"
    >
      <div class="grid items-center gap-6 p-3.5 sm:gap-8 sm:p-5 lg:grid-cols-12">
  -->
        <!-- Hero Visual / Inline Broadcast Stage -->
  <!--
        <div class="lg:col-span-7">
          <div
            class="relative overflow-hidden rounded-[22px] bg-slate-950"
            :class="
              isHeroPlaying && activeLeadBroadcast.format === 'short'
                ? 'flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black py-4'
                : 'aspect-video w-full'
            "
          >
            <template v-if="activeLeadBroadcast.platform === 'youtube'">
              <div
                v-if="isHeroPlaying"
                :class="
                  activeLeadBroadcast.format === 'short'
                    ? 'aspect-[9/16] w-full max-w-[270px] overflow-hidden rounded-2xl bg-black shadow-2xl'
                    : 'h-full w-full'
                "
              >
                <iframe
                  :src="heroYoutubeEmbedSrc"
                  :title="formatEditorialHeadline(activeLeadBroadcast.title)"
                  class="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>

              <button
                v-else
                type="button"
                class="group/play relative block h-full w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :aria-label="`Play ${formatEditorialHeadline(activeLeadBroadcast.title)}`"
                @click="isHeroPlaying = true"
              >
                <img
                  v-if="activeLeadBroadcast.thumbnailUrl && !heroThumbFailed"
                  :src="activeLeadBroadcast.thumbnailUrl"
                  :alt="formatEditorialHeadline(activeLeadBroadcast.title)"
                  class="h-full w-full object-cover transition duration-700 group-hover/play:scale-[1.03]"
                  @error="heroThumbFailed = true"
                />
                <div
                  v-else
                  class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6"
                >
                  <Youtube class="h-8 w-8 text-crimson-bright" />
                  <p class="font-display text-lg font-bold text-white">
                    {{ activeLeadBroadcast.showLabel }}
                  </p>
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-black/20 transition duration-300 group-hover/play:from-slate-950/65"
                />

                <div class="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 uppercase backdrop-blur-md shadow-sm"
                  >
                    <Sparkles class="h-3 w-3 text-crimson" />
                    Lead Story &bull; {{ platformBadgeLabel(activeLeadBroadcast) }}
                  </span>
                </div>

                <div class="absolute inset-0 flex items-center justify-center">
                  <span
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-slate-950 backdrop-blur-md shadow-float-pill transition duration-300 group-hover/play:scale-110 group-hover/play:bg-crimson group-hover/play:text-white"
                  >
                    <Play class="ml-0.5 h-6 w-6 fill-current" />
                  </span>
                </div>
              </button>
            </template>

            <template v-else>
              <div
                class="flex aspect-video w-full flex-col justify-between bg-gradient-to-br from-slate-900 via-[#16213E] to-slate-950 p-6 sm:p-8"
              >
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-md"
                  >
                    <Facebook class="h-3.5 w-3.5 text-[#60A5FA]" />
                    Lead Story &bull; Facebook Dispatch
                  </span>
                </div>
                <div>
                  <p class="font-display text-xl font-bold text-white sm:text-2xl">
                    {{ formatEditorialHeadline(activeLeadBroadcast.title) }}
                  </p>
                </div>
                <div>
                  <a
                    :href="activeLeadBroadcast.externalUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1565C0]"
                  >
                    Open on Facebook
                    <ExternalLink class="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </template>
          </div>
        </div>
  -->

        <!-- Hero Editorial Copy & Metadata -->
  <!--
        <div class="flex flex-col justify-between space-y-5 px-2 py-2 lg:col-span-5 lg:pr-4">
          <div class="space-y-3.5">
            <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span
                class="rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
              >
                {{ activeLeadBroadcast.showLabel }}
              </span>
              <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-meta tabular-nums dark:text-slate-400">
                <span>{{ formatPublishedDate(activeLeadBroadcast.publishedAt) }}</span>
                <span aria-hidden="true" class="text-slate-300 dark:text-slate-600">&bull;</span>
                <span>{{ estimateDurationLabel(activeLeadBroadcast) }} listen</span>
              </span>
            </div>

            <h1
              class="font-display text-2xl font-extrabold leading-[1.12] tracking-tight text-slate-ink sm:text-3xl lg:text-[2.1rem] dark:text-white"
            >
              {{ formatEditorialHeadline(activeLeadBroadcast.title) }}
            </h1>

            <p class="text-sm leading-relaxed text-slate-body sm:text-[15px] dark:text-slate-300">
              {{ formatEditorialSummary(activeLeadBroadcast.summary) }}
            </p>
          </div>

          <div class="space-y-4 pt-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <button
                v-if="activeLeadBroadcast.platform === 'youtube'"
                type="button"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
                @click="isHeroPlaying = !isHeroPlaying"
              >
                <Play v-if="!isHeroPlaying" class="h-3.5 w-3.5 fill-current" />
                <Pause v-else class="h-3.5 w-3.5 fill-current" />
                {{ isHeroPlaying ? 'Pause Stage' : 'Watch Broadcast' }}
              </button>

              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :class="
                  isTrackPlaying(activeLeadBroadcast.id)
                    ? 'bg-crimson text-white shadow-sm'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15'
                "
                @click="playTrack(activeLeadBroadcast)"
              >
                <Volume2 v-if="isTrackPlaying(activeLeadBroadcast.id)" class="h-3.5 w-3.5" />
                <Headphones v-else class="h-3.5 w-3.5" />
                {{ isTrackPlaying(activeLeadBroadcast.id) ? 'Listening' : 'Listen' }}
              </button>

              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2.5 text-xs font-semibold text-slate-body transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                @click="openInMediaHub(activeLeadBroadcast)"
              >
                Open Hub
                <ArrowUpRight class="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              class="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-meta dark:text-slate-400"
            >
              <span v-if="formatViewCount(activeLeadBroadcast.views)" class="tabular-nums">
                {{ formatViewCount(activeLeadBroadcast.views) }}
              </span>
              <span v-else>SPIN Media Newsroom</span>

              <a
                :href="activeLeadBroadcast.externalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 transition hover:text-crimson dark:hover:text-ochre-bright"
              >
                Watch on {{ activeLeadBroadcast.platform === 'youtube' ? 'YouTube' : 'Facebook' }}
                <ExternalLink class="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AntigravityCard>
  -->

    <!-- Z-Plane 2 (Mid-Depth): Floating Secondary Stories -->
  <!--
    <section class="space-y-8" aria-label="Featured Dispatches">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
            Editorial Selection
          </p>
          <h2 class="font-display mt-1 text-3xl font-extrabold tracking-tight text-slate-ink dark:text-white">
            Suspended Dispatches &amp; Reports
          </h2>
        </div>
  -->

        <!-- Floating Filter Chips -->
  <!--
        <div class="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter dispatches">
          <button
            v-for="filter in deskFilterOptions"
            :key="filter.id"
            type="button"
            role="tab"
            :aria-selected="activeDeskFilter === filter.id"
            class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              activeDeskFilter === filter.id
                ? 'bg-slate-900 text-white shadow-float-chip dark:bg-white dark:text-slate-950'
                : 'bg-white/85 text-slate-body shadow-float-chip ring-1 ring-white/90 hover:bg-white hover:text-slate-900 dark:bg-slate-900/75 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-slate-800 dark:hover:text-white'
            "
            @click="activeDeskFilter = filter.id"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
  -->

      <!-- Asymmetric Prominent Pair (7 cols + 5 cols) -->
  <!--
      <div v-if="elevatedFeaturePair.length > 0" class="grid gap-7 lg:grid-cols-12">
        <AntigravityCard
          v-for="(item, idx) in elevatedFeaturePair"
          :key="item.id"
          depth="elevated"
          :max-tilt="1.8"
          :class="idx === 0 ? 'lg:col-span-7' : 'lg:col-span-5'"
        >
          <div class="flex h-full flex-col justify-between p-4 sm:p-5">
            <div>
              <button
                type="button"
                class="group/thumb relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                @click="selectLeadStory(item, true)"
              >
                <img
                  v-if="item.thumbnailUrl && !failedCardThumbs[item.id]"
                  :src="item.thumbnailUrl"
                  :alt="formatEditorialHeadline(item.title)"
                  loading="lazy"
                  class="h-full w-full object-cover transition duration-500 group-hover/thumb:scale-105"
                  @error="onCardThumbError(item.id)"
                />
                <div
                  v-else
                  class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-5"
                >
                  <div class="flex justify-end">
                    <Facebook class="h-6 w-6 text-[#60A5FA]/85" />
                  </div>
                  <p class="font-display text-base font-bold text-white">{{ item.showLabel }}</p>
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-black/15"
                />

                <div class="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    class="rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase backdrop-blur-md"
                  >
                    {{ platformBadgeLabel(item) }}
                  </span>
                </div>

                <div class="absolute right-3 bottom-3">
                  <span
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-950 backdrop-blur-md shadow-md transition group-hover/thumb:scale-110 group-hover/thumb:bg-crimson group-hover/thumb:text-white"
                  >
                    <Play class="ml-0.5 h-4 w-4 fill-current" />
                  </span>
                </div>
              </button>

              <div class="mt-4 space-y-2.5 px-1">
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span class="font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                    {{ item.showLabel }}
                  </span>
                  <span class="font-medium tabular-nums text-slate-meta dark:text-slate-400">
                    {{ formatPublishedDate(item.publishedAt) }} &bull; {{ estimateDurationLabel(item) }}
                  </span>
                </div>

                <button
                  type="button"
                  class="cursor-pointer text-left"
                  @click="selectLeadStory(item, true)"
                >
                  <h3
                    class="font-display line-clamp-2 font-bold leading-snug text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                    :class="idx === 0 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'"
                  >
                    {{ formatEditorialHeadline(item.title) }}
                  </h3>
                </button>

                <p class="line-clamp-2 text-sm leading-relaxed text-slate-body dark:text-slate-300">
                  {{ formatEditorialSummary(item.summary) }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-2 px-1 pt-2">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-900/6 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white dark:hover:text-slate-950"
                  @click="selectLeadStory(item, true)"
                >
                  <Play class="h-3 w-3 fill-current" />
                  Elevate to Lead
                </button>
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition"
                  :class="
                    isTrackPlaying(item.id)
                      ? 'bg-crimson text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/15'
                  "
                  @click="playTrack(item)"
                >
                  <Headphones class="h-3 w-3" />
                  {{ isTrackPlaying(item.id) ? 'Listening' : 'Listen' }}
                </button>
              </div>

              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-slate-meta transition hover:text-crimson dark:text-slate-400 dark:hover:text-ochre-bright"
                @click="openInMediaHub(item)"
              >
                Hub
                <ArrowUpRight class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </AntigravityCard>
      </div>
  -->

      <!-- Secondary Floating Trio -->
  <!--
      <div v-if="secondaryTrio.length > 0" class="grid gap-7 md:grid-cols-3">
        <AntigravityCard
          v-for="item in secondaryTrio"
          :key="item.id"
          depth="elevated"
          :max-tilt="1.8"
        >
          <div class="flex h-full flex-col justify-between p-4">
            <div>
              <button
                type="button"
                class="group/thumb relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                @click="openInMediaHub(item)"
              >
                <img
                  v-if="item.thumbnailUrl && !failedCardThumbs[item.id]"
                  :src="item.thumbnailUrl"
                  :alt="formatEditorialHeadline(item.title)"
                  loading="lazy"
                  class="h-full w-full object-cover transition duration-500 group-hover/thumb:scale-105"
                  @error="onCardThumbError(item.id)"
                />
                <div
                  v-else
                  class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-950 p-4"
                >
                  <div class="flex justify-end">
                    <Facebook class="h-5 w-5 text-[#60A5FA]/85" />
                  </div>
                  <p class="font-display text-sm font-bold text-white">{{ item.showLabel }}</p>
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                <span
                  class="absolute top-2.5 left-2.5 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase backdrop-blur-md"
                >
                  {{ item.format === 'short' ? 'Short' : item.platform === 'facebook' ? 'Facebook' : 'Report' }}
                </span>
              </button>

              <div class="mt-3.5 space-y-2 px-0.5">
                <div class="flex items-center justify-between gap-2 text-[11px]">
                  <span class="font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                    {{ item.showLabel }}
                  </span>
                  <span class="tabular-nums text-slate-meta dark:text-slate-400">
                    {{ formatPublishedDate(item.publishedAt) }}
                  </span>
                </div>

                <button
                  type="button"
                  class="cursor-pointer text-left"
                  @click="openInMediaHub(item)"
                >
                  <h3
                    class="font-display line-clamp-2 text-lg font-bold leading-snug text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                  >
                    {{ formatEditorialHeadline(item.title) }}
                  </h3>
                </button>

                <p class="line-clamp-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ formatEditorialSummary(item.summary) }}
                </p>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between gap-2 px-0.5 pt-2">
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition"
                :class="
                  isTrackPlaying(item.id)
                    ? 'bg-crimson text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15'
                "
                @click="playTrack(item)"
              >
                <Headphones class="h-3 w-3" />
                {{ isTrackPlaying(item.id) ? 'Playing' : 'Listen' }}
              </button>

              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-crimson transition hover:underline dark:text-ochre-bright"
                @click="openInMediaHub(item)"
              >
                Watch
                <ArrowUpRight class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </AntigravityCard>
      </div>
    </section>
  -->

    <!-- Z-Plane 1 (Deepest): On the Wire + Facebook Newsroom -->
  <!--
    <section class="grid items-start gap-8 lg:grid-cols-12" aria-label="Latest Wire and Social Desk">
      <div class="space-y-5 lg:col-span-7">
        <div class="flex items-end justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
              Latest Wire
            </p>
            <h2 class="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
              Top Dispatches
            </h2>
          </div>

          <RouterLink
            to="/media"
            class="inline-flex items-center gap-1 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-float-chip ring-1 ring-white/90 transition hover:text-crimson dark:bg-slate-900/80 dark:text-slate-200 dark:ring-white/10 dark:hover:text-ochre-bright"
          >
            All {{ media.length }} Dispatches
            <ArrowUpRight class="h-3.5 w-3.5" />
          </RouterLink>
        </div>

        <div class="space-y-3.5">
          <AntigravityCard
            v-for="(item, idx) in wireDispatches"
            :key="item.id"
            depth="recessed"
            :max-tilt="1.2"
          >
            <div
              class="flex items-start justify-between gap-4 rounded-[22px] p-4 transition"
              :class="
                activeLeadBroadcast?.id === item.id
                  ? 'ring-2 ring-crimson/35 dark:ring-crimson-bright/45'
                  : ''
              "
            >
              <button
                type="button"
                class="flex min-w-0 flex-1 cursor-pointer items-start gap-3.5 text-left"
                @click="selectLeadStory(item, true)"
              >
                <span
                  class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition"
                  :class="
                    activeLeadBroadcast?.id === item.id
                      ? 'bg-crimson text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                  "
                >
                  {{ String(idx + 1).padStart(2, '0') }}
                </span>

                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex flex-wrap items-center gap-2 text-[11px]">
                    <span class="font-bold tracking-wider text-ochre uppercase dark:text-ochre-bright">
                      {{ item.showLabel }}
                    </span>
                    <span class="text-slate-300 dark:text-slate-600">&bull;</span>
                    <span class="tabular-nums text-slate-meta dark:text-slate-400">
                      {{ formatPublishedDate(item.publishedAt) }}
                    </span>
                    <span v-if="formatViewCount(item.views)" class="tabular-nums text-slate-meta dark:text-slate-400">
                      &bull; {{ formatViewCount(item.views) }}
                    </span>
                  </div>

                  <h3
                    class="font-display line-clamp-2 text-base font-bold leading-snug text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                  >
                    {{ formatEditorialHeadline(item.title) }}
                  </h3>
                </div>
              </button>

              <button
                type="button"
                class="mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :class="
                  isTrackPlaying(item.id)
                    ? 'bg-crimson text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950'
                "
                :aria-label="`Listen to ${formatEditorialHeadline(item.title)}`"
                :title="isTrackPlaying(item.id) ? 'Pause audio briefing' : 'Listen in audio bar'"
                @click.stop="playTrack(item)"
              >
                <Volume2 v-if="isTrackPlaying(item.id)" class="h-4 w-4" />
                <Headphones v-else class="h-4 w-4" />
              </button>
            </div>
          </AntigravityCard>
        </div>
      </div>

      <div class="lg:sticky lg:top-24 lg:col-span-5">
        <FacebookTimelinePanel />
      </div>
    </section>
  -->

    <!-- Z-Plane 1: Weekly On-Air Program Guide (PHT) -->
  <!--
    <section class="space-y-7" aria-label="Weekly On-Air Schedule">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
            On-Air Schedule &bull; Philippine Standard Time
          </p>
          <h2 class="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
            Public Affairs Programs &amp; Coverage
          </h2>
        </div>
        <RouterLink
          to="/about"
          class="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-700 transition hover:text-crimson dark:text-slate-300 dark:hover:text-ochre-bright"
        >
          Meet our hosts &amp; anchors
          <ArrowUpRight class="h-4 w-4" />
        </RouterLink>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AntigravityCard
          v-for="show in shows"
          :key="show.id"
          depth="recessed"
          :max-tilt="1.6"
        >
          <RouterLink
            :to="{ path: '/media', query: { show: show.slug } }"
            class="flex h-full flex-col justify-between p-6"
          >
            <div>
              <div class="flex items-center justify-between gap-2 text-xs">
                <span class="inline-flex items-center gap-2 font-semibold text-slate-ink dark:text-slate-100">
                  <span class="h-2 w-2 rounded-full" :class="accentDot(show.accentColor)" />
                  {{ show.dayLabel }}
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-meta dark:bg-white/10 dark:text-slate-300"
                >
                  <CalendarClock class="h-3 w-3 text-crimson dark:text-ochre-bright" />
                  {{ show.timeLabel }}
                </span>
              </div>

              <h3
                class="font-display mt-4 text-xl font-extrabold text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
              >
                {{ show.title }}
              </h3>
              <p class="font-display mt-0.5 text-xs italic text-slate-meta dark:text-slate-400">
                {{ show.subtitle }}
              </p>
              <p class="mt-3 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                {{ show.summary }}
              </p>
            </div>

            <div class="mt-5 flex items-center justify-between gap-2 pt-2 text-xs">
              <span class="inline-flex items-center gap-1.5 font-medium text-slate-body dark:text-slate-300">
                <Users class="h-3.5 w-3.5 text-slate-meta dark:text-slate-400" />
                {{ show.hosts.join(', ') }}
              </span>
              <span class="inline-flex items-center gap-1 font-bold text-crimson dark:text-ochre-bright">
                Episodes
                <ArrowUpRight class="h-3.5 w-3.5" />
              </span>
            </div>
          </RouterLink>
        </AntigravityCard>
      </div>
    </section>
  -->

    <!-- Floating Editorial Network Statement -->
  <!--
    <AntigravityCard depth="elevated" :max-tilt="1.0" as="section" aria-label="Network Profile">
      <div class="flex flex-col justify-between gap-6 p-7 sm:p-10 lg:flex-row lg:items-center">
        <div class="max-w-2xl space-y-2.5">
          <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
            {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }}
          </p>
          <h2 class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
            Independent Philippine Digital Journalism &mdash;
            <span class="italic text-ochre dark:text-ochre-bright">
              &ldquo;{{ site?.tagline ?? 'Adding Value, Creating Significance.' }}&rdquo;
            </span>
          </h2>
          <p class="text-sm leading-relaxed text-slate-body dark:text-slate-300">
            {{
              site?.description ??
              'Independent Philippine digital broadcast network delivering public affairs dialogue, breaking local and international news, and community journalism across YouTube and Facebook.'
            }}
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-3">
          <RouterLink
            to="/about"
            class="rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            About Our Newsroom
          </RouterLink>
          <RouterLink
            to="/contact"
            class="rounded-full bg-crimson px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark"
          >
            Send a News Tip
          </RouterLink>
        </div>
      </div>
    </AntigravityCard>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Full-width Antigravity editorial homepage with sticky right Social Media Snips sidebar -->
  <!--
  <div class="w-full space-y-10 px-4 pt-5 pb-16 sm:px-6 lg:px-8 xl:px-10">
  -->
  <!-- Gene - Nov, 19, 2026: Capped max-w-[1600px] Antigravity homepage with single-row filters & deduplicated sidebar -->
  <div class="mx-auto w-full max-w-[1600px] space-y-10 px-4 pt-5 pb-16 sm:px-6 lg:px-8 xl:px-10">
    <!-- Full-Width Editorial Dateline Strip -->
    <section
      class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      aria-label="Edition Dateline"
    >
      <div class="flex flex-wrap items-center gap-2.5">
        <span
          class="text-[11px] font-bold tracking-[0.16em] text-slate-meta uppercase dark:text-slate-400"
        >
          Philippines Edition &bull; {{ manilaDate }}
        </span>

        <!--
        <RouterLink
          v-if="liveShow"
          :to="{ path: '/media', query: { show: liveShow.slug } }"
          class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-float-chip transition hover:bg-crimson-dark"
        >
          <span class="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
          On Air &bull; {{ liveShow.title }}
        </RouterLink>
        -->
        <!-- Gene - Nov, 24, 2026: Open permanent YouTube channel /live URL directly when clicking the On Air pill -->
        <a
          v-if="liveShow"
          :href="youtubeLiveUrl"
          target="_blank"
          rel="noopener noreferrer"
          :title="`Watch ${liveShow.title} live on YouTube`"
          class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-float-chip transition hover:bg-crimson-dark"
        >
          <span class="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
          <span>On Air &bull; {{ liveShow.title }}</span>
          <ExternalLink class="h-3 w-3 opacity-90" />
        </a>
        <RouterLink
          v-else-if="nextShow"
          :to="{ path: '/media', query: { show: nextShow.slug } }"
          class="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-body backdrop-blur-md shadow-float-chip ring-1 ring-white/90 transition hover:text-crimson dark:bg-slate-900/80 dark:text-slate-300 dark:ring-white/10 dark:hover:text-ochre-bright"
        >
          <Radio class="h-3 w-3 text-crimson dark:text-crimson-bright" />
          Up Next: {{ nextShow.title }} ({{ nextShow.dayLabel.replace('Every ', '') }},
          {{ nextShow.timeLabel }})
        </RouterLink>

        <!-- Gene - Nov, 19, 2026: Live Philippine Weather & MMDA Coding quick pills scrolling to Citizen Essentials -->
        <button
          type="button"
          @click="scrollToEssentials"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-ink backdrop-blur-md shadow-float-chip ring-1 ring-white/90 transition hover:-translate-y-0.5 hover:text-crimson dark:bg-slate-900/80 dark:text-slate-200 dark:ring-white/10 dark:hover:text-ochre-bright"
        >
          <component :is="resolveWeatherIcon(weather.icon)" class="h-3.5 w-3.5 text-ochre dark:text-ochre-bright" />
          <span class="tabular-nums">{{ weather.locationLabel }} {{ weather.temperatureC }}°C</span>
          <span class="hidden text-slate-400 sm:inline">&bull;</span>
          <span class="hidden text-slate-meta sm:inline dark:text-slate-400">{{ weather.conditionLabel }}</span>
        </button>

        <button
          type="button"
          @click="scrollToEssentials"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-ink backdrop-blur-md shadow-float-chip ring-1 ring-white/90 transition hover:-translate-y-0.5 hover:text-crimson dark:bg-slate-900/80 dark:text-slate-200 dark:ring-white/10 dark:hover:text-ochre-bright"
        >
          <Car class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
          <span>Coding: {{ datelineCoding.digitsLabel }}</span>
        </button>
      </div>

      <p class="font-display text-sm italic text-slate-body dark:text-slate-400">
        &ldquo;{{ site?.tagline ?? 'Adding Value, Creating Significance.' }}&rdquo;
      </p>
    </section>

    <!-- Full-Width Two-Column Editorial Workspace + Sticky Social Sidebar -->
    <div
      class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]"
    >
      <!-- Left Main Editorial Column -->
      <div class="min-w-0 space-y-14 sm:space-y-16">
        <!-- Z-Plane 3 (Closest): Lead Hero Story -->
        <AntigravityCard
          v-if="activeLeadBroadcast"
          depth="hero"
          :max-tilt="1.4"
          :interactive="!isHeroPlaying"
          as="section"
          aria-label="Lead Hero Story"
        >
          <div class="grid items-center gap-6 p-3.5 sm:gap-8 sm:p-5 xl:grid-cols-12">
            <!-- Hero Visual / Inline Broadcast Stage -->
            <div class="xl:col-span-7">
              <div
                class="relative overflow-hidden rounded-[22px] bg-slate-950"
                :class="
                  isHeroPlaying && activeLeadBroadcast.format === 'short'
                    ? 'flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black py-4'
                    : 'aspect-video w-full'
                "
              >
                <template v-if="activeLeadBroadcast.platform === 'youtube'">
                  <div
                    v-if="isHeroPlaying"
                    :class="
                      activeLeadBroadcast.format === 'short'
                        ? 'aspect-[9/16] w-full max-w-[270px] overflow-hidden rounded-2xl bg-black shadow-2xl'
                        : 'h-full w-full'
                    "
                  >
                    <iframe
                      :src="heroYoutubeEmbedSrc"
                      :title="formatEditorialHeadline(activeLeadBroadcast.title)"
                      class="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                  </div>

                  <button
                    v-else
                    type="button"
                    class="group/play relative block h-full w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                    :aria-label="`Play ${formatEditorialHeadline(activeLeadBroadcast.title)}`"
                    @click="isHeroPlaying = true"
                  >
                    <img
                      v-if="activeLeadBroadcast.thumbnailUrl && !heroThumbFailed"
                      :src="activeLeadBroadcast.thumbnailUrl"
                      :alt="formatEditorialHeadline(activeLeadBroadcast.title)"
                      class="h-full w-full object-cover transition duration-700 group-hover/play:scale-[1.03]"
                      @error="heroThumbFailed = true"
                    />
                    <div
                      v-else
                      class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6"
                    >
                      <Youtube class="h-8 w-8 text-crimson-bright" />
                      <p class="font-display text-lg font-bold text-white">
                        {{ activeLeadBroadcast.showLabel }}
                      </p>
                    </div>

                    <div
                      class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-black/20 transition duration-300 group-hover/play:from-slate-950/65"
                    />

                    <div class="absolute top-4 left-4 flex items-center gap-2">
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 uppercase backdrop-blur-md shadow-sm"
                      >
                        <Sparkles class="h-3 w-3 text-crimson" />
                        Lead Story &bull; {{ platformBadgeLabel(activeLeadBroadcast) }}
                      </span>
                    </div>

                    <div class="absolute inset-0 flex items-center justify-center">
                      <span
                        class="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-slate-950 backdrop-blur-md shadow-float-pill transition duration-300 group-hover/play:scale-110 group-hover/play:bg-crimson group-hover/play:text-white"
                      >
                        <Play class="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                    </div>
                  </button>
                </template>

                <template v-else>
                  <div
                    class="flex aspect-video w-full flex-col justify-between bg-gradient-to-br from-slate-900 via-[#16213E] to-slate-950 p-6 sm:p-8"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-md"
                      >
                        <Facebook class="h-3.5 w-3.5 text-[#60A5FA]" />
                        Lead Story &bull; Facebook Dispatch
                      </span>
                    </div>
                    <div>
                      <p class="font-display text-xl font-bold text-white sm:text-2xl">
                        {{ formatEditorialHeadline(activeLeadBroadcast.title) }}
                      </p>
                    </div>
                    <div>
                      <a
                        :href="activeLeadBroadcast.externalUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1565C0]"
                      >
                        Open on Facebook
                        <ExternalLink class="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Hero Editorial Copy & Metadata -->
            <div class="flex flex-col justify-between space-y-5 px-2 py-2 xl:col-span-5 xl:pr-4">
              <div class="space-y-3.5">
                <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span
                    class="rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
                  >
                    {{ activeLeadBroadcast.showLabel }}
                  </span>
                  <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-meta tabular-nums dark:text-slate-400">
                    <span>{{ formatPublishedDate(activeLeadBroadcast.publishedAt) }}</span>
                    <span aria-hidden="true" class="text-slate-300 dark:text-slate-600">&bull;</span>
                    <span>{{ estimateDurationLabel(activeLeadBroadcast) }}</span>
                  </span>
                </div>

                <h1
                  class="font-display text-2xl font-extrabold leading-[1.12] tracking-tight text-slate-ink sm:text-3xl xl:text-[2.1rem] dark:text-white"
                >
                  {{ formatEditorialHeadline(activeLeadBroadcast.title) }}
                </h1>

                <p class="text-sm leading-relaxed text-slate-body sm:text-[15px] dark:text-slate-300">
                  {{ formatEditorialSummary(activeLeadBroadcast.summary) }}
                </p>
              </div>

              <div class="space-y-4 pt-1">
                <div class="flex flex-wrap items-center gap-2.5">
                  <button
                    v-if="activeLeadBroadcast.platform === 'youtube'"
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
                    @click="isHeroPlaying = !isHeroPlaying"
                  >
                    <Play v-if="!isHeroPlaying" class="h-3.5 w-3.5 fill-current" />
                    <Pause v-else class="h-3.5 w-3.5 fill-current" />
                    {{ isHeroPlaying ? 'Pause Stage' : 'Watch Broadcast' }}
                  </button>

                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
                    @click="openInMediaHub(activeLeadBroadcast)"
                  >
                    Open Hub
                    <ArrowUpRight class="h-3.5 w-3.5" />
                  </button>
                </div>

                <div
                  class="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-meta dark:text-slate-400"
                >
                  <span v-if="formatViewCount(activeLeadBroadcast.views)" class="tabular-nums">
                    {{ formatViewCount(activeLeadBroadcast.views) }}
                  </span>
                  <span v-else>SPIN Media Newsroom</span>

                  <a
                    :href="activeLeadBroadcast.externalUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 transition hover:text-crimson dark:hover:text-ochre-bright"
                  >
                    Watch on {{ activeLeadBroadcast.platform === 'youtube' ? 'YouTube' : 'Facebook' }}
                    <ExternalLink class="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AntigravityCard>

        <!-- Gene - Nov, 19, 2026: Citizen Public Essentials Hub (Live Weather, MMDA Coding, OFW FX, Hotlines, Advisories & Holidays) -->
        <PublicEssentialsHub id="citizen-essentials" />

        <!-- Gene - Nov, 19, 2026: Dedicated Good News Philippines positive journalism showcase with reader modal -->
        <section class="space-y-6" aria-labelledby="good-news-heading">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div class="mb-1.5 flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-2.5 py-0.5 text-[11px] font-bold tracking-[0.14em] text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  <Heart class="h-3 w-3 fill-current" />
                  Positive Edition • Good News PH
                </span>
              </div>
              <h2
                id="good-news-heading"
                class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                Good News &amp; Bayanihan Stories
              </h2>
              <p class="mt-1 text-sm text-slate-body dark:text-slate-400">
                Uplifting Philippine community wins, OFW milestones, family empowerment, and local solutions.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter good news categories">
              <button
                v-for="cat in positiveCategoryOptions"
                :key="cat.id"
                type="button"
                role="tab"
                :aria-selected="activePositiveCategory === cat.id"
                class="cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :class="
                  activePositiveCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-float-chip dark:bg-white dark:text-slate-950'
                    : 'bg-white/85 text-slate-body shadow-float-chip ring-1 ring-white/90 hover:bg-white hover:text-slate-900 dark:bg-slate-900/75 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-slate-800 dark:hover:text-white'
                "
                @click="activePositiveCategory = cat.id"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AntigravityCard
              v-for="story in filteredPositiveNews"
              :key="story.id"
              depth="elevated"
              :max-tilt="1.5"
              as="article"
              class="flex flex-col justify-between p-5"
            >
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    :class="positiveAccentBadge(story.accentColor)"
                  >
                    {{ story.categoryLabel }}
                  </span>
                  <span class="text-[11px] font-semibold text-slate-meta dark:text-slate-400">
                    {{ story.readTime }}
                  </span>
                </div>

                <h3 class="font-display mt-3 text-lg font-bold leading-snug text-slate-ink dark:text-white">
                  {{ story.title }}
                </h3>

                <p class="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ story.summary }}
                </p>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3 pt-3">
                <span class="inline-flex items-center gap-1 truncate text-[11px] font-medium text-slate-meta dark:text-slate-400">
                  <MapPin class="h-3.5 w-3.5 shrink-0 text-civic dark:text-emerald-400" />
                  <span class="truncate">{{ story.location }}</span>
                </span>

                <button
                  type="button"
                  @click="openGoodNewsStory(story)"
                  class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-ink transition hover:bg-crimson hover:text-white dark:bg-white/10 dark:text-slate-100 dark:hover:bg-crimson-bright"
                >
                  <BookOpen class="h-3.5 w-3.5" />
                  Read Story
                </button>
              </div>
            </AntigravityCard>
          </div>
        </section>

        <!-- Z-Plane 2 (Mid-Depth): Floating Secondary Stories -->
        <section class="space-y-8" aria-label="Featured Dispatches">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
                Editorial Selection
              </p>
              <!--
              <h2 class="font-display mt-1 text-3xl font-extrabold tracking-tight text-slate-ink dark:text-white">
                Suspended Dispatches &amp; Reports
              </h2>
              -->
              <!-- Gene - Nov, 19, 2026: Replace prompt-echo "Suspended" label with standard newsroom heading -->
              <h2 class="font-display mt-1 text-3xl font-extrabold tracking-tight text-slate-ink dark:text-white">
                Featured Dispatches &amp; Reports
              </h2>
            </div>

            <!-- Floating Filter Chips -->
            <div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter dispatches">
              <button
                v-for="filter in deskFilterOptions"
                :key="filter.id"
                type="button"
                role="tab"
                :aria-selected="activeDeskFilter === filter.id"
                class="cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :class="
                  activeDeskFilter === filter.id
                    ? 'bg-slate-900 text-white shadow-float-chip dark:bg-white dark:text-slate-950'
                    : 'bg-white/85 text-slate-body shadow-float-chip ring-1 ring-white/90 hover:bg-white hover:text-slate-900 dark:bg-slate-900/75 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-slate-800 dark:hover:text-white'
                "
                @click="activeDeskFilter = filter.id"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <!-- Asymmetric Prominent Pair -->
          <div v-if="elevatedFeaturePair.length > 0" class="grid gap-6 xl:grid-cols-12">
            <AntigravityCard
              v-for="(item, idx) in elevatedFeaturePair"
              :key="item.id"
              depth="elevated"
              :max-tilt="1.8"
              :class="idx === 0 ? 'xl:col-span-7' : 'xl:col-span-5'"
            >
              <div class="flex h-full flex-col justify-between p-4 sm:p-5">
                <div>
                  <button
                    type="button"
                    class="group/thumb relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                    @click="selectLeadStory(item, true)"
                  >
                    <img
                      v-if="item.thumbnailUrl && !failedCardThumbs[item.id]"
                      :src="item.thumbnailUrl"
                      :alt="formatEditorialHeadline(item.title)"
                      loading="lazy"
                      class="h-full w-full object-cover transition duration-500 group-hover/thumb:scale-105"
                      @error="onCardThumbError(item.id)"
                    />
                    <div
                      v-else
                      class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-5"
                    >
                      <div class="flex justify-end">
                        <Facebook class="h-6 w-6 text-[#60A5FA]/85" />
                      </div>
                      <p class="font-display text-base font-bold text-white">{{ item.showLabel }}</p>
                    </div>

                    <div
                      class="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-black/15"
                    />

                    <div class="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        class="rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase backdrop-blur-md"
                      >
                        {{ platformBadgeLabel(item) }}
                      </span>
                    </div>

                    <div class="absolute right-3 bottom-3">
                      <span
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-950 backdrop-blur-md shadow-md transition group-hover/thumb:scale-110 group-hover/thumb:bg-crimson group-hover/thumb:text-white"
                      >
                        <Play class="ml-0.5 h-4 w-4 fill-current" />
                      </span>
                    </div>
                  </button>

                  <div class="mt-4 space-y-2.5 px-1">
                    <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span class="font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                        {{ item.showLabel }}
                      </span>
                      <span class="font-medium tabular-nums text-slate-meta dark:text-slate-400">
                        {{ formatPublishedDate(item.publishedAt) }} &bull; {{ estimateDurationLabel(item) }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="cursor-pointer text-left"
                      @click="selectLeadStory(item, true)"
                    >
                      <h3
                        class="font-display line-clamp-2 font-bold leading-snug text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                        :class="idx === 0 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'"
                      >
                        {{ formatEditorialHeadline(item.title) }}
                      </h3>
                    </button>

                    <p class="line-clamp-2 text-sm leading-relaxed text-slate-body dark:text-slate-300">
                      {{ formatEditorialSummary(item.summary) }}
                    </p>
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap items-center justify-between gap-2 px-1 pt-2">
                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-900/6 px-3.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white dark:hover:text-slate-950"
                    @click="selectLeadStory(item, true)"
                  >
                    <Play class="h-3 w-3 fill-current" />
                    Elevate to Lead
                  </button>

                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-slate-meta transition hover:text-crimson dark:text-slate-400 dark:hover:text-ochre-bright"
                    @click="openInMediaHub(item)"
                  >
                    Open Hub
                    <ArrowUpRight class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </AntigravityCard>
          </div>

          <!-- Secondary Floating Trio -->
          <div v-if="secondaryTrio.length > 0" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AntigravityCard
              v-for="item in secondaryTrio"
              :key="item.id"
              depth="elevated"
              :max-tilt="1.8"
            >
              <div class="flex h-full flex-col justify-between p-4">
                <div>
                  <button
                    type="button"
                    class="group/thumb relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                    @click="openInMediaHub(item)"
                  >
                    <img
                      v-if="item.thumbnailUrl && !failedCardThumbs[item.id]"
                      :src="item.thumbnailUrl"
                      :alt="formatEditorialHeadline(item.title)"
                      loading="lazy"
                      class="h-full w-full object-cover transition duration-500 group-hover/thumb:scale-105"
                      @error="onCardThumbError(item.id)"
                    />
                    <div
                      v-else
                      class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-950 p-4"
                    >
                      <div class="flex justify-end">
                        <Facebook class="h-5 w-5 text-[#60A5FA]/85" />
                      </div>
                      <p class="font-display text-sm font-bold text-white">{{ item.showLabel }}</p>
                    </div>

                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    <span
                      class="absolute top-2.5 left-2.5 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase backdrop-blur-md"
                    >
                      {{ item.format === 'short' ? 'Short' : item.platform === 'facebook' ? 'Facebook' : 'Report' }}
                    </span>
                  </button>

                  <div class="mt-3.5 space-y-2 px-0.5">
                    <div class="flex items-center justify-between gap-2 text-[11px]">
                      <span class="font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                        {{ item.showLabel }}
                      </span>
                      <span class="tabular-nums text-slate-meta dark:text-slate-400">
                        {{ formatPublishedDate(item.publishedAt) }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="cursor-pointer text-left"
                      @click="openInMediaHub(item)"
                    >
                      <h3
                        class="font-display line-clamp-2 text-lg font-bold leading-snug text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                      >
                        {{ formatEditorialHeadline(item.title) }}
                      </h3>
                    </button>

                    <p class="line-clamp-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                      {{ formatEditorialSummary(item.summary) }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 flex items-center justify-between gap-2 px-0.5 pt-2">
                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-950"
                    @click="selectLeadStory(item, true)"
                  >
                    <Play class="h-3 w-3 fill-current" />
                    Lead Stage
                  </button>

                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-crimson transition hover:underline dark:text-ochre-bright"
                    @click="openInMediaHub(item)"
                  >
                    Watch
                    <ArrowUpRight class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </AntigravityCard>
          </div>
        </section>

        <!-- Z-Plane 1 (Deepest): Latest Wire -->
        <section class="space-y-5" aria-label="Latest Wire">
          <div class="flex items-end justify-between gap-3">
            <div>
              <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
                Latest Wire
              </p>
              <h2 class="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
                Top Dispatches
              </h2>
            </div>

            <!--
            <RouterLink
              to="/media"
              class="inline-flex items-center gap-1 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-float-chip ring-1 ring-white/90 transition hover:text-crimson dark:bg-slate-900/80 dark:text-slate-200 dark:ring-white/10 dark:hover:text-ochre-bright"
            >
              All {{ media.length }} Dispatches
              <ArrowUpRight class="h-3.5 w-3.5" />
            </RouterLink>
            -->
            <!-- Gene - Nov, 19, 2026: Link directly to full broadcast archive on /media while keeping homepage wire uplifting -->
            <RouterLink
              to="/media"
              class="inline-flex items-center gap-1 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-float-chip ring-1 ring-white/90 transition hover:text-crimson dark:bg-slate-900/80 dark:text-slate-200 dark:ring-white/10 dark:hover:text-ochre-bright"
            >
              Full Archive ({{ media.length }})
              <ArrowUpRight class="h-3.5 w-3.5" />
            </RouterLink>
          </div>

          <div class="space-y-3.5">
            <AntigravityCard
              v-for="(item, idx) in wireDispatches"
              :key="item.id"
              depth="recessed"
              :max-tilt="1.2"
            >
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[22px] p-4 text-left transition"
                :class="
                  activeLeadBroadcast?.id === item.id
                    ? 'ring-2 ring-crimson/35 dark:ring-crimson-bright/45'
                    : ''
                "
                @click="selectLeadStory(item, true)"
              >
                <div class="flex min-w-0 flex-1 items-start gap-3.5">
                  <span
                    class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition"
                    :class="
                      activeLeadBroadcast?.id === item.id
                        ? 'bg-crimson text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                    "
                  >
                    {{ String(idx + 1).padStart(2, '0') }}
                  </span>

                  <div class="min-w-0 flex-1 space-y-1">
                    <div class="flex flex-wrap items-center gap-2 text-[11px]">
                      <span class="font-bold tracking-wider text-ochre uppercase dark:text-ochre-bright">
                        {{ item.showLabel }}
                      </span>
                      <span class="text-slate-300 dark:text-slate-600">&bull;</span>
                      <span class="tabular-nums text-slate-meta dark:text-slate-400">
                        {{ formatPublishedDate(item.publishedAt) }}
                      </span>
                      <span v-if="formatViewCount(item.views)" class="tabular-nums text-slate-meta dark:text-slate-400">
                        &bull; {{ formatViewCount(item.views) }}
                      </span>
                    </div>

                    <h3
                      class="font-display line-clamp-2 text-base font-bold leading-snug text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                    >
                      {{ formatEditorialHeadline(item.title) }}
                    </h3>
                  </div>
                </div>

                <span
                  class="hidden shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition group-hover/card:bg-slate-900 group-hover/card:text-white sm:inline-flex dark:bg-white/10 dark:text-slate-200 dark:group-hover/card:bg-white dark:group-hover/card:text-slate-950"
                >
                  <Play class="h-3 w-3 fill-current" />
                  Play in Hero
                </span>
              </button>
            </AntigravityCard>
          </div>
        </section>

        <!-- Z-Plane 1: Weekly On-Air Program Guide (PHT) -->
        <section class="space-y-7" aria-label="Weekly On-Air Schedule">
          <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
                On-Air Schedule &bull; Philippine Standard Time
              </p>
              <h2 class="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
                Public Affairs Programs &amp; Coverage
              </h2>
            </div>
            <RouterLink
              to="/about"
              class="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-700 transition hover:text-crimson dark:text-slate-300 dark:hover:text-ochre-bright"
            >
              Meet our hosts &amp; anchors
              <ArrowUpRight class="h-4 w-4" />
            </RouterLink>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AntigravityCard
              v-for="show in shows"
              :key="show.id"
              depth="recessed"
              :max-tilt="1.6"
            >
              <RouterLink
                :to="{ path: '/media', query: { show: show.slug } }"
                class="flex h-full flex-col justify-between p-6"
              >
                <div>
                  <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="inline-flex items-center gap-2 font-semibold text-slate-ink dark:text-slate-100">
                      <span class="h-2 w-2 rounded-full" :class="accentDot(show.accentColor)" />
                      {{ show.dayLabel }}
                    </span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-meta dark:bg-white/10 dark:text-slate-300"
                    >
                      <CalendarClock class="h-3 w-3 text-crimson dark:text-ochre-bright" />
                      {{ show.timeLabel }}
                    </span>
                  </div>

                  <h3
                    class="font-display mt-4 text-xl font-extrabold text-slate-ink transition group-hover/card:text-crimson dark:text-white dark:group-hover/card:text-ochre-bright"
                  >
                    {{ show.title }}
                  </h3>
                  <p class="font-display mt-0.5 text-xs italic text-slate-meta dark:text-slate-400">
                    {{ show.subtitle }}
                  </p>
                  <p class="mt-3 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                    {{ show.summary }}
                  </p>
                </div>

                <div class="mt-5 flex items-center justify-between gap-2 pt-2 text-xs">
                  <span class="inline-flex items-center gap-1.5 font-medium text-slate-body dark:text-slate-300">
                    <Users class="h-3.5 w-3.5 text-slate-meta dark:text-slate-400" />
                    {{ show.hosts.join(', ') }}
                  </span>
                  <span class="inline-flex items-center gap-1 font-bold text-crimson dark:text-ochre-bright">
                    Episodes
                    <ArrowUpRight class="h-3.5 w-3.5" />
                  </span>
                </div>
              </RouterLink>
            </AntigravityCard>
          </div>
        </section>

        <!-- Gene - Nov, 20, 2026: SPIN Media Annual Awards — Gawad Parangal at Pagkilala 2026 Spotlight -->
        <AntigravityCard
          depth="elevated"
          :max-tilt="1.0"
          as="section"
          aria-label="SPIN Media Annual Awards Gawad Parangal 2026"
        >
          <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
            <div class="space-y-4 lg:col-span-7">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-3 py-1 text-[11px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  <Award class="h-3.5 w-3.5" />
                  Gawad Parangal at Pagkilala 2026
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-body dark:bg-white/8 dark:text-slate-300"
                >
                  <Calendar class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                  December 14, 2026 &bull; Marriott Hotel Pasay City
                </span>
              </div>

              <h2
                class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                SPIN Media Annual Awards &mdash;
                <span class="text-crimson dark:text-crimson-bright">Honoring Extraordinary Filipinos</span>
              </h2>

              <p class="text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                Celebrating integrity, transparency, patriotism, and public service across 7 national
                awardee sectors &mdash; Government, Business, Law Enforcement &amp; Armed Services,
                Legislature, Judiciary, Civil Society, and Religious Leadership.
              </p>

              <!-- 3 Clickable Deck Slide Previews -->
              <div class="grid grid-cols-3 gap-3 pt-1">
                <RouterLink
                  to="/gallery?slide=8#gawad-parangal"
                  class="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-200 transition hover:ring-crimson dark:ring-white/10"
                >
                  <img
                    src="/images/gallery/annual-awards/slide-08.webp"
                    alt="Gawad Parangal Movement Overview"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    class="absolute inset-x-1.5 bottom-1.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs"
                  >
                    The Movement
                  </span>
                </RouterLink>

                <!--
                <RouterLink
                  to="/gallery?slide=12#gawad-parangal"
                  class="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-200 transition hover:ring-crimson dark:ring-white/10"
                >
                  <img
                    src="/images/gallery/annual-awards/slide-12.webp"
                    alt="Seven Selection Criteria"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    class="absolute inset-x-1.5 bottom-1.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs"
                  >
                    7 Criteria
                  </span>
                </RouterLink>

                <RouterLink
                  to="/gallery?slide=13#gawad-parangal"
                  class="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-200 transition hover:ring-crimson dark:ring-white/10"
                >
                  <img
                    src="/images/gallery/annual-awards/slide-13.webp"
                    alt="Categories of Awardees"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    class="absolute inset-x-1.5 bottom-1.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs"
                  >
                    7 Sectors
                  </span>
                </RouterLink>
                -->
                <!-- Gene - Nov, 27, 2026: Updated slide query params (12->11, 13->12) after removing slide-09 -->
                <RouterLink
                  to="/gallery?slide=11#gawad-parangal"
                  class="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-200 transition hover:ring-crimson dark:ring-white/10"
                >
                  <img
                    src="/images/gallery/annual-awards/slide-12.webp"
                    alt="Seven Selection Criteria"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    class="absolute inset-x-1.5 bottom-1.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs"
                  >
                    7 Criteria
                  </span>
                </RouterLink>

                <RouterLink
                  to="/gallery?slide=12#gawad-parangal"
                  class="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950 ring-1 ring-slate-200 transition hover:ring-crimson dark:ring-white/10"
                >
                  <img
                    src="/images/gallery/annual-awards/slide-13.webp"
                    alt="Categories of Awardees"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    class="absolute inset-x-1.5 bottom-1.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs"
                  >
                    7 Sectors
                  </span>
                </RouterLink>
              </div>

              <div class="flex flex-wrap items-center gap-2.5 pt-1">
                <RouterLink
                  to="/gallery#gawad-parangal"
                  class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark"
                >
                  <Images class="h-3.5 w-3.5" />
                  <!-- Explore 17-Slide Deck -->
                  <!-- Gene - Nov, 27, 2026: Updated total slide count from 17 to 16 after removing slide-09 -->
                  Explore 16-Slide Deck
                </RouterLink>
                <RouterLink
                  to="/leaders"
                  class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Meet Key Leaders
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </RouterLink>
                <RouterLink
                  to="/contact"
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-4 py-2 text-xs font-bold tracking-wide text-ochre transition hover:bg-ochre hover:text-white dark:bg-ochre-bright/15 dark:text-ochre-bright dark:hover:bg-ochre-bright dark:hover:text-slate-950"
                >
                  Inquire / Nominate
                </RouterLink>
              </div>
            </div>

            <div class="lg:col-span-5">
              <RouterLink
                to="/gallery?slide=6#gawad-parangal"
                class="group/poster relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-float-recessed ring-1 ring-slate-200/80 dark:ring-white/10"
              >
                <img
                  src="/images/gallery/annual-awards/slide-06.webp"
                  alt="SPIN Media Annual Awards December 14, 2026 Marriott Hotel Pasay City"
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover/poster:scale-[1.03]"
                />
                <span
                  class="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md transition group-hover/poster:bg-crimson"
                >
                  Open Presentation
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </span>
              </RouterLink>
            </div>
          </div>
        </AntigravityCard>

        <!-- Gene - Nov, 23, 2026: Companion SPIN Initiatives & PSEPRI Institutional Partnership spotlight card -->
        <AntigravityCard
          depth="elevated"
          :max-tilt="1.0"
          as="section"
          aria-label="SPIN Initiatives and PSEPRI Partnership"
        >
          <div class="grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-12">
            <div class="lg:col-span-5">
              <RouterLink
                to="/initiatives?slide=21#psepri"
                class="group/psepri relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-float-recessed ring-1 ring-slate-200/80 dark:ring-white/10"
              >
                <img
                  src="/images/initiatives/psepri/slide-21.webp"
                  alt="Institutional Partnership between SPIN Network and PSEPRI"
                  loading="lazy"
                  class="h-full w-full object-contain transition-transform duration-500 group-hover/psepri:scale-[1.03]"
                />
                <span
                  class="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md transition group-hover/psepri:bg-crimson"
                >
                  View 22-Slide Deck
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </span>
              </RouterLink>
            </div>

            <div class="space-y-4 lg:col-span-7">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
                >
                  <Handshake class="h-3.5 w-3.5" />
                  SPIN Initiatives &amp; Ventures
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-body dark:bg-white/8 dark:text-slate-300"
                >
                  PSEPRI Research Institute &bull; 2026 Concept
                </span>
              </div>

              <h2
                class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                Institutional Partnership &mdash;
                <span class="text-crimson dark:text-crimson-bright">SPIN Network &times; PSEPRI</span>
              </h2>

              <p class="text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                Secure the Philippines Initiatives Network (SPIN Network) partners with the
                Philippine Social, Economic &amp; Public Opinion Research Institute, Inc. (PSEPRI)
                to conduct and deliver independent nationwide surveys powered by SPIN&rsquo;s
                regional network.
              </p>

              <div class="flex flex-wrap items-center gap-2.5 pt-1">
                <RouterLink
                  to="/initiatives"
                  class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark"
                >
                  Explore Initiatives
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </RouterLink>
                <RouterLink
                  to="/initiatives?slide=21#psepri"
                  class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  View 22-Slide PSEPRI Deck
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </RouterLink>
                <RouterLink
                  to="/initiatives#spin-jobs"
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-4 py-2 text-xs font-bold tracking-wide text-ochre transition hover:bg-ochre hover:text-white dark:bg-ochre-bright/15 dark:text-ochre-bright dark:hover:bg-ochre-bright dark:hover:text-slate-950"
                >
                  <Briefcase class="h-3.5 w-3.5" />
                  SPIN Jobs
                </RouterLink>
              </div>
            </div>
          </div>
        </AntigravityCard>

        <!-- Floating Editorial Network Statement -->
        <AntigravityCard depth="elevated" :max-tilt="1.0" as="section" aria-label="Network Profile">
          <div class="flex flex-col justify-between gap-6 p-7 sm:p-10 xl:flex-row xl:items-center">
            <div class="max-w-2xl space-y-2.5">
              <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
                {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }}
              </p>
              <h2 class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
                Independent Philippine Digital Journalism &mdash;
                <span class="italic text-ochre dark:text-ochre-bright">
                  &ldquo;{{ site?.tagline ?? 'Adding Value, Creating Significance.' }}&rdquo;
                </span>
              </h2>
              <p class="text-sm leading-relaxed text-slate-body dark:text-slate-300">
                {{
                  site?.description ??
                  'Independent Philippine digital broadcast network delivering public affairs dialogue, breaking local and international news, and community journalism across YouTube and Facebook.'
                }}
              </p>
            </div>

            <div class="flex shrink-0 flex-wrap items-center gap-3">
              <RouterLink
                to="/about"
                class="rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                About Our Newsroom
              </RouterLink>
              <RouterLink
                to="/contact"
                class="rounded-full bg-crimson px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark"
              >
                Send a News Tip
              </RouterLink>
            </div>
          </div>
        </AntigravityCard>
      </div>

      <!-- Right Sticky Social Media Snips Sidebar -->
      <!--
      <div class="min-w-0 lg:sticky lg:top-24">
        <SocialSnipsSidebar
          :exclude-ids="visibleMainIds"
          @select-media="(item) => selectLeadStory(item, true)"
        />
      </div>
      -->
      <!-- Gene - Nov, 19, 2026: Enable positive-only mode on homepage sidebar -->
      <div class="min-w-0 lg:sticky lg:top-24">
        <SocialSnipsSidebar
          :exclude-ids="visibleMainIds"
          :positive-only="true"
          @select-media="(item) => selectLeadStory(item, true)"
        />
      </div>
    </div>

    <!-- Gene - Nov, 19, 2026: Good News Story Reader Modal -->
    <Teleport to="body">
      <div
        v-if="activeGoodNewsStory"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`modal-title-${activeGoodNewsStory.id}`"
        @click.self="closeGoodNewsStory"
      >
        <div
          class="relative w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-float-hero sm:p-8 dark:border dark:border-white/10 dark:bg-obsidian-float"
        >
          <button
            type="button"
            aria-label="Close story reader"
            @click="closeGoodNewsStory"
            class="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-body transition hover:bg-slate-200 hover:text-slate-ink dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 dark:hover:text-white"
          >
            <X class="h-4.5 w-4.5" />
          </button>

          <div class="flex flex-wrap items-center gap-2 pr-10">
            <span
              class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
              :class="positiveAccentBadge(activeGoodNewsStory.accentColor)"
            >
              {{ activeGoodNewsStory.categoryLabel }}
            </span>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-meta dark:bg-white/10 dark:text-slate-300">
              {{ activeGoodNewsStory.highlightTag }}
            </span>
          </div>

          <h3
            :id="`modal-title-${activeGoodNewsStory.id}`"
            class="font-display mt-4 text-2xl font-extrabold leading-snug text-slate-ink sm:text-3xl dark:text-white"
          >
            {{ activeGoodNewsStory.title }}
          </h3>

          <div class="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-meta dark:text-slate-400">
            <span class="inline-flex items-center gap-1">
              <MapPin class="h-3.5 w-3.5 text-civic dark:text-emerald-400" />
              {{ activeGoodNewsStory.location }}
            </span>
            <span>&bull;</span>
            <span>{{ formatPublishedDate(activeGoodNewsStory.publishedAt) }}</span>
            <span>&bull;</span>
            <span>{{ activeGoodNewsStory.readTime }}</span>
          </div>

          <p class="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-ink dark:bg-white/[0.04] dark:text-slate-200">
            {{ activeGoodNewsStory.summary }}
          </p>

          <p class="mt-4 text-sm leading-7 text-slate-body dark:text-slate-300">
            {{ activeGoodNewsStory.body }}
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4">
            <RouterLink
              v-if="activeGoodNewsStory.relatedShowSlug"
              :to="{ path: '/media', query: { show: activeGoodNewsStory.relatedShowSlug } }"
              @click="closeGoodNewsStory"
              class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 text-xs font-bold text-white shadow-float-chip transition hover:bg-crimson-dark"
            >
              Watch Related Program
              <ArrowUpRight class="h-3.5 w-3.5" />
            </RouterLink>
            <button
              type="button"
              @click="closeGoodNewsStory"
              class="cursor-pointer rounded-full bg-slate-100 px-5 py-2 text-xs font-bold text-slate-ink transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Close Reader
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
