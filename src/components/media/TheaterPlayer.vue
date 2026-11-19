<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Calendar, Eye, ExternalLink, Facebook, Play, Youtube } from 'lucide-vue-next'
import { formatPublishedDate, formatViewCount } from '@/composables/usePhtSchedule'
// Gene - Nov, 19, 2026: Use editorial headline and summary normalization in TheaterPlayer
import { formatEditorialHeadline, formatEditorialSummary } from '@/utils/editorialFormat'
import type { MediaItem } from '@/types/spin'

const props = withDefaults(
  defineProps<{
    item: MediaItem
    autoplayOnChange?: boolean
  }>(),
  {
    autoplayOnChange: true,
  },
)

const isPlaying = ref(false)
const showFbEmbed = ref(false)
const thumbError = ref(false)

watch(
  () => props.item.id,
  () => {
    thumbError.value = false
    showFbEmbed.value = false
    isPlaying.value = props.autoplayOnChange && props.item.platform === 'youtube'
  },
)

const youtubeEmbedSrc = computed(() => {
  if (!props.item.videoId) return props.item.embedUrl ?? ''
  return `https://www.youtube-nocookie.com/embed/${props.item.videoId}?autoplay=1&rel=0`
})

const isShort = computed(() => props.item.format === 'short')
const formattedViews = computed(() => formatViewCount(props.item.views))
// Gene - Nov, 19, 2026: Clean formatted headline & summary for floating TheaterPlayer stage
const displayTitle = computed(() => formatEditorialHeadline(props.item.title))
const displaySummary = computed(() => formatEditorialSummary(props.item.summary))
</script>

<template>
  <!--
  <section
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-[#0E1730] dark:shadow-black/40"
  >
  -->
    <!-- Stage Frame -->
  <!--
    <div class="relative bg-slate-950">
  -->
      <!-- YOUTUBE -->
  <!--
      <template v-if="item.platform === 'youtube'">
        <div
          v-if="isShort"
          class="relative flex items-center justify-center bg-gradient-to-br from-[#070D1F] via-[#131F3F] to-[#1A0D18] py-4"
        >
          <div class="aspect-[9/16] w-full max-w-[330px] overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
            <iframe
              v-if="isPlaying"
              :src="youtubeEmbedSrc"
              :title="item.title"
              class="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <button
              v-else
              type="button"
              class="group relative h-full w-full text-left"
              :aria-label="`Play ${item.title}`"
              @click="isPlaying = true"
            >
              <img
                v-if="item.thumbnailUrl && !thumbError"
                :src="item.thumbnailUrl"
                :alt="item.title"
                class="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                @error="thumbError = true"
              />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/35 transition group-hover:bg-black/20"
              >
                <span
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40 transition group-hover:scale-110"
                >
                  <Play class="ml-1 h-7 w-7 fill-current" />
                </span>
                <span class="mt-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                  Play YouTube Short
                </span>
              </div>
            </button>
          </div>
        </div>

        <div v-else class="aspect-video w-full bg-black">
          <iframe
            v-if="isPlaying"
            :src="youtubeEmbedSrc"
            :title="item.title"
            class="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <button
            v-else
            type="button"
            class="group relative h-full w-full text-left"
            :aria-label="`Play ${item.title}`"
            @click="isPlaying = true"
          >
            <img
              v-if="item.thumbnailUrl && !thumbError"
              :src="item.thumbnailUrl"
              :alt="item.title"
              class="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              @error="thumbError = true"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <span
                class="flex h-18 w-18 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/50 transition duration-200 group-hover:scale-110 group-hover:bg-red-500"
              >
                <Play class="ml-1 h-8 w-8 fill-current" />
              </span>
            </div>
            <div class="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
              >
                <Youtube class="h-3.5 w-3.5 text-red-500" />
                Click to Play Embedded Broadcast
              </span>
            </div>
          </button>
        </div>
      </template>
  -->
      <!-- FACEBOOK -->
  <!--
      <template v-else>
        <div
          v-if="showFbEmbed && item.embedUrl"
          class="flex min-h-[420px] flex-col items-center justify-center bg-slate-900 p-4"
        >
          <iframe
            :src="item.embedUrl"
            :title="item.title"
            class="h-[460px] w-full max-w-[500px] rounded-xl border border-slate-700 bg-white"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowfullscreen
          />
          <p class="mt-2 text-center text-xs text-slate-400">
            Blocked by browser tracking protection?
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-blue-400 underline"
            >
              Open directly on Facebook
            </a>
          </p>
        </div>

        <div
          v-else
          class="flex min-h-[290px] flex-col justify-between bg-gradient-to-br from-[#0F1F4B] via-[#13295E] to-[#0B132B] p-6 sm:p-10"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase"
            >
              <Facebook class="h-3.5 w-3.5" />
              Facebook Page Dispatch
            </span>
            <span class="text-xs font-medium text-blue-200">
              Spin Media TV Philippines Official Page
            </span>
          </div>

          <div class="my-6 max-w-2xl">
            <h3 class="font-display text-xl font-bold text-white sm:text-2xl">
              {{ item.title }}
            </h3>
            <p class="mt-2.5 text-sm leading-relaxed text-blue-100/90">
              {{ item.summary }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500"
            >
              Open on Facebook
              <ExternalLink class="h-4 w-4" />
            </a>
            <button
              v-if="item.embedUrl"
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              @click="showFbEmbed = true"
            >
              Load Embedded Page Frame
            </button>
          </div>
        </div>
      </template>
    </div>
  -->
    <!-- Stage Details Footer -->
  <!--
    <div class="space-y-3 p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase"
            :class="
              item.platform === 'youtube'
                ? 'bg-red-600/10 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                : 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
            "
          >
            {{ item.platform === 'youtube' ? (isShort ? 'YouTube Short' : 'YouTube') : 'Facebook' }}
          </span>
          <span
            class="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
          >
            {{ item.showLabel }}
          </span>
        </div>

        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span class="inline-flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5" />
            {{ formatPublishedDate(item.publishedAt) }}
          </span>
          <span v-if="formattedViews" class="inline-flex items-center gap-1">
            <Eye class="h-3.5 w-3.5" />
            {{ formattedViews }}
          </span>
        </div>
      </div>

      <h2 class="font-display text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
        {{ item.title }}
      </h2>
      <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {{ item.summary }}
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <a
          :href="item.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 transition hover:underline dark:text-amber-400"
        >
          Watch / Open Original Post
          <ExternalLink class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </section>
  -->

  <!-- Gene - Nov, 19, 2026: Editorial cinema & broadcast stage without navy surfaces -->
  <!--
  <section
    class="overflow-hidden rounded-sm border border-rule bg-white shadow-sm dark:border-obsidian-rule dark:bg-obsidian-card"
  >
    <div class="relative bg-[#0B0B0C]">
      <template v-if="item.platform === 'youtube'">
        <div
          v-if="isShort"
          class="relative flex items-center justify-center bg-gradient-to-br from-[#141416] via-[#1E191A] to-[#0B0B0C] py-4"
        >
          <div
            class="aspect-[9/16] w-full max-w-[330px] overflow-hidden rounded-sm bg-black shadow-2xl ring-1 ring-white/15"
          >
            <iframe
              v-if="isPlaying"
              :src="youtubeEmbedSrc"
              :title="item.title"
              class="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <button
              v-else
              type="button"
              class="group relative h-full w-full cursor-pointer text-left"
              :aria-label="`Play ${item.title}`"
              @click="isPlaying = true"
            >
              <img
                v-if="item.thumbnailUrl && !thumbError"
                :src="item.thumbnailUrl"
                :alt="item.title"
                class="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                @error="thumbError = true"
              />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/35 transition group-hover:bg-black/20"
              >
                <span
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-crimson text-white shadow-lg transition group-hover:scale-110 group-hover:bg-crimson-dark"
                >
                  <Play class="ml-1 h-7 w-7 fill-current" />
                </span>
                <span
                  class="mt-3 rounded-[2px] bg-[#141413]/90 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-white uppercase"
                >
                  Play YouTube Short
                </span>
              </div>
            </button>
          </div>
        </div>

        <div v-else class="aspect-video w-full bg-black">
          <iframe
            v-if="isPlaying"
            :src="youtubeEmbedSrc"
            :title="item.title"
            class="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <button
            v-else
            type="button"
            class="group relative h-full w-full cursor-pointer text-left"
            :aria-label="`Play ${item.title}`"
            @click="isPlaying = true"
          >
            <img
              v-if="item.thumbnailUrl && !thumbError"
              :src="item.thumbnailUrl"
              :alt="item.title"
              class="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              @error="thumbError = true"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <span
                class="flex h-18 w-18 items-center justify-center rounded-full bg-crimson text-white shadow-2xl transition duration-200 group-hover:scale-110 group-hover:bg-crimson-dark"
              >
                <Play class="ml-1 h-8 w-8 fill-current" />
              </span>
            </div>
            <div class="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-[2px] bg-[#141413]/90 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur"
              >
                <Youtube class="h-3.5 w-3.5 text-crimson-bright" />
                Click to Play Embedded Broadcast
              </span>
            </div>
          </button>
        </div>
      </template>

      <template v-else>
        <div
          v-if="showFbEmbed && item.embedUrl"
          class="flex min-h-[420px] flex-col items-center justify-center bg-[#141413] p-4"
        >
          <iframe
            :src="item.embedUrl"
            :title="item.title"
            class="h-[460px] w-full max-w-[500px] rounded-sm border border-white/15 bg-white"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowfullscreen
          />
          <p class="mt-2 text-center text-xs text-[#C4C1B8]">
            Blocked by browser tracking protection?
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-[#60A5FA] underline"
            >
              Open directly on Facebook
            </a>
          </p>
        </div>

        <div
          v-else
          class="flex min-h-[290px] flex-col justify-between border-t-4 border-[#1877F2] bg-[#161618] p-6 sm:p-10"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-[2px] bg-[#1877F2] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-white uppercase"
            >
              <Facebook class="h-3.5 w-3.5" />
              Facebook Page Dispatch
            </span>
            <span class="font-mono text-[11px] font-medium text-[#C4C1B8]">
              Spin Media TV Philippines Official Page
            </span>
          </div>

          <div class="my-6 max-w-2xl">
            <h3 class="font-display text-xl font-bold text-[#F5F4F0] sm:text-2xl">
              {{ item.title }}
            </h3>
            <p class="mt-2.5 text-sm leading-relaxed text-[#C4C1B8]">
              {{ item.summary }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-sm bg-[#1877F2] px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#1565C0]"
            >
              Open on Facebook
              <ExternalLink class="h-4 w-4" />
            </a>
            <button
              v-if="item.embedUrl"
              type="button"
              class="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-white/20"
              @click="showFbEmbed = true"
            >
              Load Embedded Page Frame
            </button>
          </div>
        </div>
      </template>
    </div>

    <div class="space-y-3 border-t border-rule p-5 sm:p-6 dark:border-obsidian-rule">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2.5">
          <span
            class="inline-flex items-center gap-1 rounded-[2px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white uppercase"
            :class="item.platform === 'youtube' ? 'bg-crimson' : 'bg-[#1877F2]'"
          >
            {{ item.platform === 'youtube' ? (isShort ? 'YouTube Short' : 'YouTube') : 'Facebook' }}
          </span>
          <span
            class="font-mono text-[11px] font-semibold tracking-wider text-ochre uppercase dark:text-ochre-bright"
          >
            {{ item.showLabel }}
          </span>
        </div>

        <div
          class="flex items-center gap-3 font-mono text-[11px] tabular-nums text-ink-subtle dark:text-[#9A968D]"
        >
          <span class="inline-flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5" />
            {{ formatPublishedDate(item.publishedAt) }}
          </span>
          <span v-if="formattedViews" class="inline-flex items-center gap-1">
            <Eye class="h-3.5 w-3.5" />
            {{ formattedViews }}
          </span>
        </div>
      </div>

      <h2
        class="font-display text-xl font-extrabold leading-tight text-ink sm:text-2xl dark:text-[#F5F4F0]"
      >
        {{ item.title }}
      </h2>
      <p class="text-sm leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
        {{ item.summary }}
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <a
          :href="item.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-crimson uppercase transition hover:underline dark:text-crimson-bright"
        >
          Watch / Open Original Post
          <ExternalLink class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </section>
  -->

  <!-- Gene - Nov, 19, 2026: Borderless Antigravity cinema stage matching homepage depth hierarchy -->
  <section
    class="overflow-hidden rounded-[28px] bg-white p-3.5 shadow-float-hero ring-1 ring-white/95 sm:p-5 dark:bg-obsidian-float dark:ring-white/[0.08]"
  >
    <div class="relative overflow-hidden rounded-[20px] bg-slate-950">
      <template v-if="item.platform === 'youtube'">
        <div
          v-if="isShort"
          class="relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black py-4"
        >
          <div
            class="aspect-[9/16] w-full max-w-[330px] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/15"
          >
            <iframe
              v-if="isPlaying"
              :src="youtubeEmbedSrc"
              :title="displayTitle"
              class="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <button
              v-else
              type="button"
              class="group relative h-full w-full cursor-pointer text-left"
              :aria-label="`Play ${displayTitle}`"
              @click="isPlaying = true"
            >
              <img
                v-if="item.thumbnailUrl && !thumbError"
                :src="item.thumbnailUrl"
                :alt="displayTitle"
                class="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                @error="thumbError = true"
              />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/35 transition group-hover:bg-black/20"
              >
                <span
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-slate-950 shadow-float-pill transition group-hover:scale-110 group-hover:bg-crimson group-hover:text-white"
                >
                  <Play class="ml-1 h-7 w-7 fill-current" />
                </span>
                <span
                  class="mt-3 rounded-full bg-slate-950/85 px-3.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
                >
                  Play YouTube Short
                </span>
              </div>
            </button>
          </div>
        </div>

        <div v-else class="aspect-video w-full bg-black">
          <iframe
            v-if="isPlaying"
            :src="youtubeEmbedSrc"
            :title="displayTitle"
            class="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <button
            v-else
            type="button"
            class="group relative h-full w-full cursor-pointer text-left"
            :aria-label="`Play ${displayTitle}`"
            @click="isPlaying = true"
          >
            <img
              v-if="item.thumbnailUrl && !thumbError"
              :src="item.thumbnailUrl"
              :alt="displayTitle"
              class="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              @error="thumbError = true"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <span
                class="flex h-18 w-18 items-center justify-center rounded-full bg-white/92 text-slate-950 shadow-float-pill transition duration-200 group-hover:scale-110 group-hover:bg-crimson group-hover:text-white"
              >
                <Play class="ml-1 h-8 w-8 fill-current" />
              </span>
            </div>
            <div class="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-white/88 px-3.5 py-1 text-[11px] font-bold tracking-wider text-slate-900 uppercase backdrop-blur-md shadow-sm"
              >
                <Youtube class="h-3.5 w-3.5 text-crimson" />
                Click to Play Embedded Broadcast
              </span>
            </div>
          </button>
        </div>
      </template>

      <template v-else>
        <div
          v-if="showFbEmbed && item.embedUrl"
          class="flex min-h-[420px] flex-col items-center justify-center bg-slate-900 p-4"
        >
          <iframe
            :src="item.embedUrl"
            :title="displayTitle"
            class="h-[460px] w-full max-w-[500px] rounded-2xl border-0 bg-white"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowfullscreen
          />
          <p class="mt-2 text-center text-xs text-slate-300">
            Blocked by browser tracking protection?
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-[#60A5FA] underline"
            >
              Open directly on Facebook
            </a>
          </p>
        </div>

        <div
          v-else
          class="flex min-h-[290px] flex-col justify-between bg-gradient-to-br from-slate-900 via-[#16213E] to-slate-950 p-6 sm:p-10"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase"
            >
              <Facebook class="h-3.5 w-3.5" />
              Facebook Page Dispatch
            </span>
            <span class="text-xs font-medium text-slate-300">
              Spin Media TV Philippines Official Page
            </span>
          </div>

          <div class="my-6 max-w-2xl">
            <h3 class="font-display text-xl font-bold text-white sm:text-2xl">
              {{ displayTitle }}
            </h3>
            <p class="mt-2.5 text-sm leading-relaxed text-slate-300">
              {{ displaySummary }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              :href="item.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition hover:bg-[#1565C0]"
            >
              Open on Facebook
              <ExternalLink class="h-4 w-4" />
            </a>
            <button
              v-if="item.embedUrl"
              type="button"
              class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/12 px-4 py-2.5 text-xs font-semibold tracking-wide text-white transition hover:bg-white/20"
              @click="showFbEmbed = true"
            >
              Load Embedded Page Frame
            </button>
          </div>
        </div>
      </template>
    </div>

    <div class="space-y-3 px-2 pt-5 pb-2 sm:px-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2.5">
          <span
            class="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
            :class="item.platform === 'youtube' ? 'bg-crimson' : 'bg-[#1877F2]'"
          >
            {{ item.platform === 'youtube' ? (isShort ? 'YouTube Short' : 'YouTube') : 'Facebook' }}
          </span>
          <span
            class="rounded-full bg-crimson/10 px-3 py-0.5 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
          >
            {{ item.showLabel }}
          </span>
        </div>

        <div class="flex items-center gap-3 text-[11px] font-medium tabular-nums text-slate-meta dark:text-slate-400">
          <span class="inline-flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5" />
            {{ formatPublishedDate(item.publishedAt) }}
          </span>
          <span v-if="formattedViews" class="inline-flex items-center gap-1">
            <Eye class="h-3.5 w-3.5" />
            {{ formattedViews }}
          </span>
        </div>
      </div>

      <h2 class="font-display text-xl font-extrabold leading-tight text-slate-ink sm:text-2xl dark:text-white">
        {{ displayTitle }}
      </h2>
      <p class="text-sm leading-relaxed text-slate-body dark:text-slate-300">
        {{ displaySummary }}
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <a
          :href="item.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-crimson hover:text-white dark:bg-white/10 dark:text-slate-100 dark:hover:bg-crimson-bright"
        >
          Watch / Open Original Post
          <ExternalLink class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </section>
</template>
