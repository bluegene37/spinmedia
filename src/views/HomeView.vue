<script setup lang="ts">
// import { computed } from 'vue'
// Gene - Nov, 19, 2026: Support interactive Lead Wire selection on Front Page
import { computed, ref } from 'vue'
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
import {
  ArrowRight,
  CalendarClock,
  ExternalLink,
  Radio,
  Tv,
  Users,
  Youtube,
} from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { formatPublishedDate, formatViewCount } from '@/composables/usePhtSchedule'
import TheaterPlayer from '@/components/media/TheaterPlayer.vue'
import MediaCard from '@/components/media/MediaCard.vue'
import FacebookTimelinePanel from '@/components/media/FacebookTimelinePanel.vue'
import type { MediaItem } from '@/types/spin'

const router = useRouter()
// const { site, shows, media } = useSpinData()
// const { isDark } = useTheme()
// Gene - Nov, 19, 2026: Track user-selected lead broadcast from Top Dispatches wire
const { site, shows, media } = useSpinData()
const selectedLeadId = ref<string | null>(null)

const featuredBroadcast = computed<MediaItem | null>(() => {
  return (
    media.value.find((m) => m.featured && m.platform === 'youtube') ??
    media.value.find((m) => m.platform === 'youtube' && m.format === 'episode') ??
    media.value[0] ??
    null
  )
})

// Gene - Nov, 19, 2026: Active lead story + top 5 wire dispatches for Front Page
const activeLeadBroadcast = computed<MediaItem | null>(() => {
  if (selectedLeadId.value) {
    const picked = media.value.find((m) => m.id === selectedLeadId.value)
    if (picked) return picked
  }
  return featuredBroadcast.value
})

const wireStories = computed(() => media.value.slice(0, 5))

const latestHighlights = computed(() => media.value.slice(0, 6))

// const accentBorder = (accent: string) => {
//   if (accent === 'crimson') return 'border-t-red-600'
//   if (accent === 'gold') return 'border-t-amber-500'
//   return 'border-t-blue-600'
// }
// Gene - Nov, 19, 2026: Replace SwitchFiber blue top border with civic teal editorial accent
const accentBorder = (accent: string) => {
  if (accent === 'crimson') return 'border-t-crimson dark:border-t-crimson-bright'
  if (accent === 'gold') return 'border-t-ochre dark:border-t-ochre-bright'
  return 'border-t-civic dark:border-t-[#2DD4BF]'
}

const selectLeadStory = (item: MediaItem) => {
  selectedLeadId.value = item.id
}

const openInMediaHub = (item: MediaItem) => {
  void router.push({ path: '/media', query: { play: item.id } })
}
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
  <div>
    <!-- Section 1: Front Page Lead Desk -->
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

    <!-- Section 2: Video Desk & Social Wire -->
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

    <!-- Section 3: Weekly On-Air Program Guide (PHT) -->
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

    <!-- Section 4: Compact Editorial Network Band -->
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
</template>
