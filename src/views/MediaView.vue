<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ExternalLink, FilterX, Search } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import TheaterPlayer from '@/components/media/TheaterPlayer.vue'
import MediaCard from '@/components/media/MediaCard.vue'
import FacebookTimelinePanel from '@/components/media/FacebookTimelinePanel.vue'
import type { MediaItem } from '@/types/spin'

type PlatformFilter = 'all' | 'youtube-video' | 'youtube-short' | 'facebook'

const route = useRoute()
const router = useRouter()
const { site, shows, media } = useSpinData()

const selectedPlatform = ref<PlatformFilter>('all')
const selectedShow = ref<string>('all')
const searchQuery = ref('')
const activeId = ref<string | null>(null)
const theaterAnchorRef = ref<HTMLElement | null>(null)

// Synchronize initial / updated route query params
watch(
  () => [route.query.show, route.query.platform, route.query.play, media.value.length] as const,
  ([showParam, platformParam, playParam]) => {
    if (typeof showParam === 'string' && showParam.length > 0) {
      selectedShow.value = showParam
    }
    if (
      platformParam === 'youtube-video' ||
      platformParam === 'youtube-short' ||
      platformParam === 'facebook' ||
      platformParam === 'all'
    ) {
      selectedPlatform.value = platformParam
    }
    if (typeof playParam === 'string' && media.value.some((m) => m.id === playParam)) {
      activeId.value = playParam
    }
  },
  { immediate: true },
)

const platformCounts = computed(() => ({
  all: media.value.length,
  youtubeVideo: media.value.filter((m) => m.platform === 'youtube' && m.format !== 'short').length,
  youtubeShort: media.value.filter((m) => m.platform === 'youtube' && m.format === 'short').length,
  facebook: media.value.filter((m) => m.platform === 'facebook').length,
}))

const filteredMedia = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return media.value.filter((item) => {
    if (selectedPlatform.value === 'youtube-video') {
      if (item.platform !== 'youtube' || item.format === 'short') return false
    } else if (selectedPlatform.value === 'youtube-short') {
      if (item.platform !== 'youtube' || item.format !== 'short') return false
    } else if (selectedPlatform.value === 'facebook') {
      if (item.platform !== 'facebook') return false
    }

    if (selectedShow.value !== 'all' && item.showSlug !== selectedShow.value) {
      return false
    }

    if (q) {
      const hay = `${item.title} ${item.summary} ${item.showLabel}`.toLowerCase()
      if (!hay.includes(q)) return false
    }

    return true
  })
})

const activeItem = computed<MediaItem | null>(() => {
  if (activeId.value) {
    const found = media.value.find((m) => m.id === activeId.value)
    if (found) return found
  }
  return filteredMedia.value[0] ?? media.value[0] ?? null
})

const handleSelectMedia = (item: MediaItem) => {
  activeId.value = item.id
  void router.replace({
    path: '/media',
    query: {
      ...(selectedShow.value !== 'all' ? { show: selectedShow.value } : {}),
      ...(selectedPlatform.value !== 'all' ? { platform: selectedPlatform.value } : {}),
      play: item.id,
    },
  })
  theaterAnchorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const resetFilters = () => {
  selectedPlatform.value = 'all'
  selectedShow.value = 'all'
  searchQuery.value = ''
  void router.replace({ path: '/media' })
}

const setShowFilter = (slug: string) => {
  selectedShow.value = slug
  const firstMatching = media.value.find(
    (m) => slug === 'all' || m.showSlug === slug,
  )
  if (firstMatching) activeId.value = firstMatching.id
}
</script>

<template>
  <!--
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
  -->
    <!-- Header Banner -->
  <!--
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="text-xs font-bold tracking-wider text-red-600 uppercase dark:text-amber-400">
          All Social Channels In One Area
        </p>
        <h1 class="font-display mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
          SPIN Media Hub
        </h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Watch embedded YouTube episodes &amp; Shorts alongside live Facebook Page updates.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <a
          v-for="social in site?.socials ?? []"
          :key="social.id"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-500/40 hover:text-red-600 dark:border-slate-800 dark:bg-[#0E1730] dark:text-slate-200 dark:hover:border-amber-400/50 dark:hover:text-amber-300"
        >
          {{ social.label }}
          <ExternalLink class="h-3 w-3 opacity-70" />
        </a>
      </div>
    </div>
  -->
    <!-- Main 2-Column Layout -->
  <!--
    <div class="grid gap-8 lg:grid-cols-12">
  -->
      <!-- Left 8 Cols: Theater + Filters + Grid -->
  <!--
      <div class="space-y-6 lg:col-span-8">
        <div ref="theaterAnchorRef" class="scroll-mt-24">
          <TheaterPlayer v-if="activeItem" :item="activeItem" :autoplay-on-change="true" />
        </div>
  -->
        <!-- Filter Bar -->
  <!--
        <div
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0E1730]"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  -->
            <!-- Platform Tabs -->
  <!--
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                "
                @click="selectedPlatform = 'all'"
              >
                All ({{ platformCounts.all }})
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'youtube-video'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                "
                @click="selectedPlatform = 'youtube-video'"
              >
                YouTube Shows &amp; News ({{ platformCounts.youtubeVideo }})
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'youtube-short'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                "
                @click="selectedPlatform = 'youtube-short'"
              >
                Shorts ({{ platformCounts.youtubeShort }})
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'facebook'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                "
                @click="selectedPlatform = 'facebook'"
              >
                Facebook ({{ platformCounts.facebook }})
              </button>
            </div>
  -->
            <!-- Search Input -->
  <!--
            <div class="relative w-full sm:w-64">
              <Search
                class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search episodes or topics..."
                class="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
  -->
          <!-- Show Pills -->
  <!--
          <div class="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
            <span class="mr-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Programs:
            </span>
            <button
              type="button"
              class="rounded-full px-3 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === 'all'
                  ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
              "
              @click="setShowFilter('all')"
            >
              All Programs
            </button>
            <button
              v-for="show in shows"
              :key="show.id"
              type="button"
              class="rounded-full px-3 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === show.slug
                  ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
              "
              @click="setShowFilter(show.slug)"
            >
              {{ show.title }}
            </button>
          </div>
        </div>
  -->
        <!-- Results Grid -->
  <!--
        <div v-if="filteredMedia.length > 0" class="grid gap-5 sm:grid-cols-2">
          <MediaCard
            v-for="item in filteredMedia"
            :key="item.id"
            :item="item"
            :active="activeItem?.id === item.id"
            @select="handleSelectMedia"
          />
        </div>
  -->
        <!-- Empty Filter State -->
  <!--
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-[#0E1730]"
        >
          <FilterX class="h-10 w-10 text-slate-400" />
          <h3 class="font-display mt-3 text-base font-bold text-slate-900 dark:text-white">
            No Matching Broadcasts Found
          </h3>
          <p class="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Try clearing your search keyword or switching to a different program filter.
          </p>
          <button
            type="button"
            class="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500"
            @click="resetFilters"
          >
            Reset All Filters
          </button>
        </div>
      </div>
  -->
      <!-- Right 4 Cols: Sticky Live Facebook Page Feed -->
  <!--
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-20">
          <FacebookTimelinePanel />
        </div>
      </div>
    </div>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Editorial Media Center Archive & Theater Hub -->
  <!--
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <div
      class="mb-6 flex flex-col justify-between gap-4 border-b-2 border-ink pb-5 sm:flex-row sm:items-end dark:border-obsidian-rule"
    >
      <div>
        <p
          class="font-mono text-[11px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
        >
          Media Center &bull; Video Archive &amp; Live Streams
        </p>
        <h1
          class="font-display mt-1 text-3xl font-extrabold text-ink sm:text-4xl dark:text-[#F5F4F0]"
        >
          SPIN Media Hub
        </h1>
        <p class="mt-1 text-sm text-ink-muted dark:text-[#C4C1B8]">
          Watch embedded YouTube episodes &amp; Shorts alongside live Facebook Page updates.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <a
          v-for="social in site?.socials ?? []"
          :key="social.id"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-sm border border-rule bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-ink transition hover:border-crimson hover:text-crimson dark:border-obsidian-rule dark:bg-obsidian-card dark:text-[#F5F4F0] dark:hover:border-ochre-bright dark:hover:text-ochre-bright"
        >
          {{ social.label }}
          <ExternalLink class="h-3 w-3 opacity-70" />
        </a>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-12">
      <div class="space-y-6 lg:col-span-8">
        <div ref="theaterAnchorRef" class="scroll-mt-20">
          <TheaterPlayer v-if="activeItem" :item="activeItem" :autoplay-on-change="true" />
        </div>

        <div
          class="space-y-4 rounded-sm border border-rule bg-white p-4 shadow-sm dark:border-obsidian-rule dark:bg-obsidian-card"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  -->
            <!--
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'all'
                    ? 'bg-crimson text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:text-white'
                "
                @click="selectedPlatform = 'all'"
              >
                All ({{ platformCounts.all }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'youtube-video'
                    ? 'bg-crimson text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:text-white'
                "
                @click="selectedPlatform = 'youtube-video'"
              >
                YouTube Shows &amp; News ({{ platformCounts.youtubeVideo }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'youtube-short'
                    ? 'bg-[#9F1239] text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:text-white'
                "
                @click="selectedPlatform = 'youtube-short'"
              >
                Shorts ({{ platformCounts.youtubeShort }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'facebook'
                    ? 'bg-[#1877F2] text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:text-white'
                "
                @click="selectedPlatform = 'facebook'"
              >
                Facebook ({{ platformCounts.facebook }})
              </button>
            </div>
            -->
            <!-- Gene - Nov, 19, 2026: Ensure platform filter tabs keep dark hover background in dark mode -->
            <!--
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'all'
                    ? 'bg-crimson text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:bg-[#242428] dark:hover:text-white'
                "
                @click="selectedPlatform = 'all'"
              >
                All ({{ platformCounts.all }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'youtube-video'
                    ? 'bg-crimson text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:bg-[#242428] dark:hover:text-white'
                "
                @click="selectedPlatform = 'youtube-video'"
              >
                YouTube Shows &amp; News ({{ platformCounts.youtubeVideo }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'youtube-short'
                    ? 'bg-[#9F1239] text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:bg-[#242428] dark:hover:text-white'
                "
                @click="selectedPlatform = 'youtube-short'"
              >
                Shorts ({{ platformCounts.youtubeShort }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-sm px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition"
                :class="
                  selectedPlatform === 'facebook'
                    ? 'bg-[#1877F2] text-white'
                    : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:bg-[#242428] dark:hover:text-white'
                "
                @click="selectedPlatform = 'facebook'"
              >
                Facebook ({{ platformCounts.facebook }})
              </button>
            </div>

            <div class="relative w-full sm:w-64">
              <Search
                class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-subtle dark:text-[#9A968D]"
              />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search episodes or topics..."
                class="w-full rounded-sm border border-rule bg-paper py-1.5 pr-3 pl-9 text-xs text-ink placeholder-ink-subtle focus:border-crimson focus:outline-none dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:placeholder-[#9A968D]"
              />
            </div>
          </div>

          <div
            class="flex flex-wrap items-center gap-1.5 border-t border-rule pt-3 dark:border-obsidian-rule"
          >
            <span
              class="mr-1 font-mono text-[10px] font-semibold tracking-widest text-ink-subtle uppercase dark:text-[#9A968D]"
            >
              Programs:
            </span>
            -->
            <!--
            <button
              type="button"
              class="cursor-pointer rounded-sm px-2.5 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === 'all'
                  ? 'bg-ink text-white dark:bg-crimson-bright dark:text-white'
                  : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:text-white'
              "
              @click="setShowFilter('all')"
            >
              All Programs
            </button>
            <button
              v-for="show in shows"
              :key="show.id"
              type="button"
              class="cursor-pointer rounded-sm px-2.5 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === show.slug
                  ? 'bg-ink text-white dark:bg-crimson-bright dark:text-white'
                  : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:text-white'
              "
              @click="setShowFilter(show.slug)"
            >
              {{ show.title }}
            </button>
            -->
            <!-- Gene - Nov, 19, 2026: Ensure program filter chips keep dark hover background in dark mode -->
            <!--
            <button
              type="button"
              class="cursor-pointer rounded-sm px-2.5 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === 'all'
                  ? 'bg-ink text-white dark:bg-crimson-bright dark:text-white'
                  : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:bg-[#242428] dark:hover:text-white'
              "
              @click="setShowFilter('all')"
            >
              All Programs
            </button>
            <button
              v-for="show in shows"
              :key="show.id"
              type="button"
              class="cursor-pointer rounded-sm px-2.5 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === show.slug
                  ? 'bg-ink text-white dark:bg-crimson-bright dark:text-white'
                  : 'bg-paper text-ink-muted hover:bg-paper-alt hover:text-ink dark:bg-obsidian dark:text-[#C4C1B8] dark:hover:bg-[#242428] dark:hover:text-white'
              "
              @click="setShowFilter(show.slug)"
            >
              {{ show.title }}
            </button>
          </div>
        </div>

        <div v-if="filteredMedia.length > 0" class="grid gap-5 sm:grid-cols-2">
          <MediaCard
            v-for="item in filteredMedia"
            :key="item.id"
            :item="item"
            :active="activeItem?.id === item.id"
            @select="handleSelectMedia"
          />
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center rounded-sm border border-dashed border-rule bg-white px-6 py-16 text-center dark:border-obsidian-rule dark:bg-obsidian-card"
        >
          <FilterX class="h-10 w-10 text-ink-subtle dark:text-[#9A968D]" />
          <h3 class="font-display mt-3 text-lg font-bold text-ink dark:text-[#F5F4F0]">
            No Matching Broadcasts Found
          </h3>
          <p class="mt-1 max-w-sm text-xs text-ink-muted dark:text-[#C4C1B8]">
            Try clearing your search keyword or switching to a different program filter.
          </p>
          <button
            type="button"
            class="mt-4 cursor-pointer rounded-sm bg-crimson px-4 py-2 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-crimson-dark"
            @click="resetFilters"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-16">
          <FacebookTimelinePanel />
        </div>
      </div>
    </div>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Antigravity Media Hub harmonized at max-w-[1600px] with floating borderless cards -->
  <div class="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
          Media Center &bull; Video Archive &amp; Live Streams
        </p>
        <h1 class="font-display mt-1 text-3xl font-extrabold tracking-tight text-slate-ink sm:text-4xl dark:text-white">
          SPIN Media Hub
        </h1>
        <p class="mt-1 text-sm text-slate-body dark:text-slate-300">
          Watch embedded YouTube episodes &amp; Shorts alongside live Facebook Page updates.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <a
          v-for="social in site?.socials ?? []"
          :key="social.id"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-float-chip ring-1 ring-white/90 transition hover:bg-slate-900 hover:text-white dark:bg-obsidian-float dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white dark:hover:text-slate-950"
        >
          {{ social.label }}
          <ExternalLink class="h-3 w-3 opacity-70" />
        </a>
      </div>
    </div>

    <div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
      <div class="min-w-0 space-y-7">
        <div ref="theaterAnchorRef" class="scroll-mt-24">
          <TheaterPlayer v-if="activeItem" :item="activeItem" :autoplay-on-change="true" />
        </div>

        <div
          class="space-y-4 rounded-[24px] bg-white p-5 shadow-float-recessed ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/[0.06]"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'all'
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
                "
                @click="selectedPlatform = 'all'"
              >
                All ({{ platformCounts.all }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'youtube-video'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
                "
                @click="selectedPlatform = 'youtube-video'"
              >
                YouTube Shows &amp; News ({{ platformCounts.youtubeVideo }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'youtube-short'
                    ? 'bg-[#9F1239] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
                "
                @click="selectedPlatform = 'youtube-short'"
              >
                Shorts ({{ platformCounts.youtubeShort }})
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition"
                :class="
                  selectedPlatform === 'facebook'
                    ? 'bg-[#1877F2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
                "
                @click="selectedPlatform = 'facebook'"
              >
                Facebook ({{ platformCounts.facebook }})
              </button>
            </div>

            <div class="relative w-full sm:w-64">
              <Search
                class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-meta dark:text-slate-400"
              />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search episodes or topics..."
                class="w-full rounded-full bg-slate-100 py-2 pr-3.5 pl-9 text-xs text-slate-ink placeholder-slate-meta focus:bg-white focus:ring-2 focus:ring-crimson/40 focus:outline-none dark:bg-white/10 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="mr-1 text-[10px] font-bold tracking-widest text-slate-meta uppercase dark:text-slate-400">
              Programs:
            </span>
            <button
              type="button"
              class="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === 'all'
                  ? 'bg-crimson text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
              "
              @click="setShowFilter('all')"
            >
              All Programs
            </button>
            <button
              v-for="show in shows"
              :key="show.id"
              type="button"
              class="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition"
              :class="
                selectedShow === show.slug
                  ? 'bg-crimson text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
              "
              @click="setShowFilter(show.slug)"
            >
              {{ show.title }}
            </button>
          </div>
        </div>

        <div v-if="filteredMedia.length > 0" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <MediaCard
            v-for="item in filteredMedia"
            :key="item.id"
            :item="item"
            :active="activeItem?.id === item.id"
            @select="handleSelectMedia"
          />
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center rounded-[24px] bg-white px-6 py-16 text-center shadow-float-recessed ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/[0.06]"
        >
          <FilterX class="h-10 w-10 text-slate-meta dark:text-slate-400" />
          <h3 class="font-display mt-3 text-lg font-bold text-slate-ink dark:text-white">
            No Matching Broadcasts Found
          </h3>
          <p class="mt-1 max-w-sm text-xs text-slate-body dark:text-slate-300">
            Try clearing your search keyword or switching to a different program filter.
          </p>
          <button
            type="button"
            class="mt-4 cursor-pointer rounded-full bg-crimson px-5 py-2 text-xs font-bold tracking-wide text-white transition hover:bg-crimson-dark"
            @click="resetFilters"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      <div class="min-w-0 lg:sticky lg:top-24">
        <FacebookTimelinePanel />
      </div>
    </div>
  </div>
</template>
