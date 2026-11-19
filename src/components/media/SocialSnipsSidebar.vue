<!-- Gene - Nov, 19, 2026: Full-width right sidebar displaying curated SPIN Media social media snips across YouTube, Facebook, TikTok, Instagram, and LinkedIn -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Play,
  RefreshCw,
  Share2,
  Sparkles,
  Video,
  Youtube,
} from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { formatPublishedDate, formatViewCount } from '@/composables/usePhtSchedule'
import { formatEditorialHeadline, formatEditorialSummary } from '@/utils/editorialFormat'
import type { MediaItem } from '@/types/spin'

type SnipPlatformFilter = 'all' | 'youtube' | 'facebook' | 'tiktok' | 'social'

const emit = defineEmits<{
  selectMedia: [item: MediaItem]
}>()

const { site, media } = useSpinData()

const activePlatform = ref<SnipPlatformFilter>('all')
const embedVisible = ref(false)
const embedKey = ref(0)
const failedThumbs = ref<Record<string, boolean>>({})

const filterTabs: { id: SnipPlatformFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'social', label: 'IG · LI' },
]

const youtubeChannel = computed(
  () => site.value?.socials.find((s) => s.platform === 'youtube'),
)
const facebookChannel = computed(
  () => site.value?.socials.find((s) => s.platform === 'facebook'),
)
const tiktokChannel = computed(
  () => site.value?.socials.find((s) => s.platform === 'tiktok'),
)
const instagramChannel = computed(
  () => site.value?.socials.find((s) => s.platform === 'instagram'),
)
const linkedinChannel = computed(
  () => site.value?.socials.find((s) => s.platform === 'linkedin'),
)

const youtubeSnips = computed<MediaItem[]>(() => {
  const candidates = media.value.filter(
    (m) => m.platform === 'youtube' && (m.format === 'short' || m.format === 'report'),
  )
  return [...candidates].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 2)
})

const facebookSnips = computed<MediaItem[]>(() =>
  media.value.filter((m) => m.platform === 'facebook').slice(0, 2),
)

const tiktokFeaturedItem = computed<MediaItem | null>(() => {
  const shorts = media.value.filter((m) => m.platform === 'youtube' && m.format === 'short')
  return shorts[2] ?? shorts[0] ?? null
})

const instagramStudioItem = computed<MediaItem | null>(() => {
  return (
    media.value.find((m) => m.showSlug === 'usapang-pilipino' && m.thumbnailUrl) ??
    media.value.find((m) => m.format === 'episode' && m.thumbnailUrl) ??
    null
  )
})

const facebookUrl = computed(
  () =>
    facebookChannel.value?.url ??
    site.value?.facebookPageUrl ??
    'https://www.facebook.com/profile.php?id=61573222453208',
)

const pluginIframeSrc = computed(
  () =>
    `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookUrl.value)}&tabs=timeline&width=320&height=420&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`,
)

const onThumbError = (id: string) => {
  failedThumbs.value = { ...failedThumbs.value, [id]: true }
}

const showSection = (section: Exclude<SnipPlatformFilter, 'all'>) =>
  activePlatform.value === 'all' || activePlatform.value === section
</script>

<template>
  <aside class="space-y-4" aria-label="Social Media Snips Sidebar">
    <!-- Sidebar Header & Platform Filter Pills -->
    <div
      class="rounded-[24px] bg-white p-4 shadow-float-recessed ring-1 ring-white/90 transition dark:bg-obsidian-float dark:ring-white/[0.06]"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-crimson/10 text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright"
          >
            <Share2 class="h-4 w-4" />
          </span>
          <div>
            <p class="text-[10px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
              Social Pulse
            </p>
            <h2 class="font-display text-lg font-extrabold leading-tight text-slate-ink dark:text-white">
              Social Media Snips
            </h2>
          </div>
        </div>

        <span
          class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:bg-white/10 dark:text-slate-300"
        >
          <Sparkles class="h-3 w-3 text-ochre dark:text-ochre-bright" />
          {{ site?.socials.length ?? 5 }} Channels
        </span>
      </div>

      <div class="mt-3.5 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter social snips">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activePlatform === tab.id"
          class="cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          :class="
            activePlatform === tab.id
              ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white'
          "
          @click="activePlatform = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- YouTube Shorts & Bulletin Snips -->
    <template v-if="showSection('youtube')">
      <article
        v-for="item in youtubeSnips"
        :key="`snip-yt-${item.id}`"
        class="group rounded-[22px] bg-white p-3.5 shadow-float-recessed ring-1 ring-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float-elevated dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div class="mb-2.5 flex items-center justify-between gap-2">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-crimson dark:text-crimson-bright">
            <Youtube class="h-3.5 w-3.5" />
            {{ youtubeChannel?.handle ?? '@spinmediatvphilippines' }}
          </span>
          <span
            v-if="formatViewCount(item.views)"
            class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-slate-600 dark:bg-white/10 dark:text-slate-300"
          >
            {{ formatViewCount(item.views) }}
          </span>
        </div>

        <button
          type="button"
          class="relative block aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          @click="emit('selectMedia', item)"
        >
          <img
            v-if="item.thumbnailUrl && !failedThumbs[item.id]"
            :src="item.thumbnailUrl"
            :alt="formatEditorialHeadline(item.title)"
            loading="lazy"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            @error="onThumbError(item.id)"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950"
          >
            <Youtube class="h-8 w-8 text-crimson-bright" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/15" />
          <span
            class="absolute bottom-2.5 left-2.5 rounded-full bg-crimson px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
          >
            {{ item.format === 'short' ? 'YouTube Short' : 'Report' }}
          </span>
          <span
            class="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-sm transition group-hover:scale-110 group-hover:bg-crimson group-hover:text-white"
          >
            <Play class="ml-0.5 h-3.5 w-3.5 fill-current" />
          </span>
        </button>

        <div class="mt-3 space-y-2 px-0.5">
          <h3
            class="font-display line-clamp-2 text-sm font-bold leading-snug text-slate-ink dark:text-white"
          >
            {{ formatEditorialHeadline(item.title) }}
          </h3>

          <div class="flex items-center justify-between pt-1 text-[11px]">
            <button
              type="button"
              class="cursor-pointer font-bold text-crimson transition hover:underline dark:text-ochre-bright"
              @click="emit('selectMedia', item)"
            >
              Play in Hero
            </button>
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 font-medium text-slate-meta transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              YouTube
              <ExternalLink class="h-3 w-3" />
            </a>
          </div>
        </div>
      </article>
    </template>

    <!-- Facebook Page Snips + Opt-In Live Timeline -->
    <template v-if="showSection('facebook')">
      <article
        class="relative isolate rounded-[22px] bg-white p-4 shadow-float-recessed ring-1 ring-white/90 transition-all duration-300 hover:shadow-float-elevated dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1877F2] text-white">
              <Facebook class="h-3.5 w-3.5" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-xs font-bold text-slate-ink dark:text-white">
                {{ facebookChannel?.handle ?? 'Spin Media TV Philippines' }}
              </p>
              <p class="text-[10px] font-semibold tracking-wider text-slate-meta uppercase dark:text-slate-400">
                Facebook Snips
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            @click="
              () => {
                embedVisible = !embedVisible
                if (embedVisible) embedKey++
              }
            "
          >
            <RefreshCw class="h-3 w-3" />
            {{ embedVisible ? 'Hide Embed' : 'Live Feed' }}
          </button>
        </div>

        <div v-if="embedVisible" class="mt-3 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950">
          <iframe
            :key="embedKey"
            :src="pluginIframeSrc"
            title="Spin Media TV Philippines Facebook Timeline"
            class="h-[380px] w-full border-0 bg-white"
            scrolling="no"
            frameborder="0"
            allowfullscreen="true"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        </div>

        <div class="mt-3 space-y-2.5">
          <a
            v-for="post in facebookSnips"
            :key="post.id"
            :href="post.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group block rounded-2xl bg-slate-50/90 p-3 transition hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div class="flex items-center justify-between gap-2 text-[10px] font-semibold">
              <span class="text-[#1877F2] uppercase dark:text-[#60A5FA]">{{ post.showLabel }}</span>
              <span class="tabular-nums text-slate-meta dark:text-slate-400">
                {{ formatPublishedDate(post.publishedAt) }}
              </span>
            </div>
            <p
              class="font-display mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-ink transition group-hover:text-[#1877F2] dark:text-slate-100 dark:group-hover:text-[#60A5FA]"
            >
              {{ formatEditorialHeadline(post.title) }}
            </p>
            <p class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-body dark:text-slate-300">
              {{ formatEditorialSummary(post.summary) }}
            </p>
          </a>
        </div>

        <a
          :href="facebookUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1877F2] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1565C0]"
        >
          <Facebook class="h-3.5 w-3.5" />
          Open Facebook Page
          <ExternalLink class="h-3 w-3" />
        </a>
      </article>
    </template>

    <!-- TikTok Quick Reel Snip -->
    <template v-if="showSection('tiktok') && tiktokChannel">
      <article
        class="rounded-[22px] bg-white p-4 shadow-float-recessed ring-1 ring-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float-elevated dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span
              class="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950"
            >
              <Video class="h-3.5 w-3.5" />
            </span>
            <div>
              <p class="text-xs font-bold text-slate-ink dark:text-white">
                TikTok &bull; {{ tiktokChannel.handle }}
              </p>
              <p class="text-[10px] font-semibold tracking-wider text-slate-meta uppercase dark:text-slate-400">
                Rapid Vertical Reel
              </p>
            </div>
          </div>

          <a
            :href="tiktokChannel.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 transition hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-950"
          >
            Watch
            <ExternalLink class="h-2.5 w-2.5" />
          </a>
        </div>

        <div
          v-if="tiktokFeaturedItem"
          class="mt-3 flex items-center gap-3 rounded-2xl bg-slate-50/90 p-2.5 dark:bg-white/5"
        >
          <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-900">
            <img
              v-if="tiktokFeaturedItem.thumbnailUrl && !failedThumbs[`tt-${tiktokFeaturedItem.id}`]"
              :src="tiktokFeaturedItem.thumbnailUrl"
              :alt="formatEditorialHeadline(tiktokFeaturedItem.title)"
              loading="lazy"
              class="h-full w-full object-cover"
              @error="onThumbError(`tt-${tiktokFeaturedItem.id}`)"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-display line-clamp-2 text-xs font-bold leading-snug text-slate-ink dark:text-white">
              {{ formatEditorialHeadline(tiktokFeaturedItem.title) }}
            </p>
            <p class="mt-1 text-[10px] font-medium text-slate-meta dark:text-slate-400">
              60s Mobile News Clip &bull; {{ tiktokChannel.handle }}
            </p>
          </div>
        </div>
      </article>
    </template>

    <!-- Instagram & LinkedIn Network Snips -->
    <template v-if="showSection('social')">
      <article
        v-if="instagramChannel"
        class="rounded-[22px] bg-white p-4 shadow-float-recessed ring-1 ring-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float-elevated dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span
              class="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white"
            >
              <Instagram class="h-3.5 w-3.5" />
            </span>
            <div>
              <p class="text-xs font-bold text-slate-ink dark:text-white">
                Instagram &bull; {{ instagramChannel.handle }}
              </p>
              <p class="text-[10px] font-semibold tracking-wider text-slate-meta uppercase dark:text-slate-400">
                Studio Behind-the-Scenes
              </p>
            </div>
          </div>

          <a
            :href="instagramChannel.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold text-rose-600 transition hover:bg-rose-500 hover:text-white dark:bg-rose-500/20 dark:text-rose-300"
          >
            Follow
            <ExternalLink class="h-2.5 w-2.5" />
          </a>
        </div>

        <div v-if="instagramStudioItem" class="mt-3 flex items-center gap-3 rounded-2xl bg-slate-50/90 p-2.5 dark:bg-white/5">
          <div class="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-900">
            <img
              v-if="instagramStudioItem.thumbnailUrl && !failedThumbs[`ig-${instagramStudioItem.id}`]"
              :src="instagramStudioItem.thumbnailUrl"
              :alt="instagramStudioItem.showLabel"
              loading="lazy"
              class="h-full w-full object-cover"
              @error="onThumbError(`ig-${instagramStudioItem.id}`)"
            />
          </div>
          <p class="text-[11px] leading-relaxed text-slate-body dark:text-slate-300">
            Studio desk highlights, guest portraits, and weekly broadcast reminders with Director Randolph Dela Cruz.
          </p>
        </div>
      </article>

      <article
        v-if="linkedinChannel"
        class="rounded-[22px] bg-white p-4 shadow-float-recessed ring-1 ring-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float-elevated dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0A66C2] text-white">
              <Linkedin class="h-3.5 w-3.5" />
            </span>
            <div>
              <p class="text-xs font-bold text-slate-ink dark:text-white">
                LinkedIn &bull; SPIN Media TV
              </p>
              <p class="text-[10px] font-semibold tracking-wider text-slate-meta uppercase dark:text-slate-400">
                Network &amp; Civic Partnerships
              </p>
            </div>
          </div>

          <a
            :href="linkedinChannel.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-full bg-[#0A66C2]/10 px-2.5 py-1 text-[10px] font-bold text-[#0A66C2] transition hover:bg-[#0A66C2] hover:text-white dark:bg-[#0A66C2]/25 dark:text-[#70B5F9]"
          >
            Connect
            <ExternalLink class="h-2.5 w-2.5" />
          </a>
        </div>

        <p class="mt-2.5 text-xs leading-relaxed text-slate-body dark:text-slate-300">
          {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }} &mdash; Gawad Parangal milestones, regional chapter briefings, and media partnerships.
        </p>
      </article>
    </template>

    <!-- Verified Social Channels Directory -->
    <div
      class="rounded-[22px] bg-white/85 p-4 shadow-float-recessed ring-1 ring-white/90 dark:bg-obsidian-float/85 dark:ring-white/[0.06]"
    >
      <p class="mb-2.5 text-[10px] font-bold tracking-[0.16em] text-slate-meta uppercase dark:text-slate-400">
        Verified SPIN Channels
      </p>
      <div class="flex flex-wrap gap-1.5">
        <a
          v-for="social in site?.socials ?? []"
          :key="social.id"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-950"
        >
          <span>{{ social.label }}</span>
          <ExternalLink class="h-2.5 w-2.5 opacity-75" />
        </a>
      </div>
    </div>
  </aside>
</template>
