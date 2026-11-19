<!-- Gene - Nov, 19, 2026: Sticky translucent bottom podcast/audio briefing bar wired to SPIN Media broadcasts -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  ListMusic,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Tv,
  Volume2,
  VolumeX,
  X,
} from 'lucide-vue-next'
import { useAudioBriefing } from '@/composables/useAudioBriefing'
import { formatClockTime } from '@/utils/editorialFormat'

const router = useRouter()
const {
  tracks,
  activeTrack,
  isPlaying,
  currentTime,
  playbackRate,
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
  toggleMinimize,
  toggleQueue,
} = useAudioBriefing()

const failedThumbs = ref<Record<string, boolean>>({})

const onThumbError = (id: string) => {
  failedThumbs.value = { ...failedThumbs.value, [id]: true }
}

const onSeekInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) return
  seekTo(Number(target.value))
}

const openVideoWatch = () => {
  if (!activeTrack.value) return
  void router.push({ path: '/media', query: { play: activeTrack.value.id } })
}
</script>

<template>
  <div
    v-if="activeTrack"
    role="region"
    aria-label="SPIN Audio Briefing Player"
    class="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-3 sm:bottom-5 sm:px-5"
  >
    <!-- Minimized Floating Pill -->
    <div v-if="isMinimized" class="mx-auto flex max-w-6xl justify-end">
      <div
        class="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-white/85 py-1.5 pr-2 pl-2.5 backdrop-blur-2xl shadow-float-pill ring-1 ring-white/90 transition dark:bg-slate-900/85 dark:ring-white/12"
      >
        <div
          class="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-white dark:bg-slate-800"
        >
          <img
            v-if="activeTrack.thumbnailUrl && !failedThumbs[activeTrack.id]"
            :src="activeTrack.thumbnailUrl"
            :alt="activeTrack.title"
            class="h-full w-full object-cover"
            @error="onThumbError(activeTrack.id)"
          />
          <Headphones v-else class="h-4 w-4 text-crimson-bright" />
          <div
            v-if="isPlaying"
            class="absolute inset-0 flex items-center justify-center gap-0.5 bg-slate-950/55"
          >
            <span class="eq-bar h-3 w-0.5 rounded-full bg-white" />
            <span class="eq-bar eq-bar-2 h-3 w-0.5 rounded-full bg-white" />
            <span class="eq-bar eq-bar-3 h-3 w-0.5 rounded-full bg-white" />
          </div>
        </div>

        <button
          type="button"
          class="max-w-[160px] cursor-pointer truncate text-left text-xs font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson sm:max-w-[220px] dark:text-slate-100"
          @click="toggleMinimize"
        >
          {{ activeTrack.showLabel }}
        </button>

        <button
          type="button"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white transition hover:scale-105 hover:bg-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
          :aria-label="isPlaying ? 'Pause audio briefing' : 'Play audio briefing'"
          @click="togglePlay"
        >
          <Pause v-if="isPlaying" class="h-3.5 w-3.5 fill-current" />
          <Play v-else class="ml-0.5 h-3.5 w-3.5 fill-current" />
        </button>

        <button
          type="button"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Expand audio player"
          title="Expand player"
          @click="toggleMinimize"
        >
          <ChevronUp class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Expanded Glassmorphic Bar + Up-Next Queue Popover -->
    <div v-else class="pointer-events-auto mx-auto max-w-4xl">
      <!-- Expandable Up-Next Queue Popover -->
      <div
        v-if="queueOpen"
        class="mb-3 max-h-72 overflow-y-auto rounded-[24px] bg-white/92 p-3 backdrop-blur-2xl shadow-float-hero ring-1 ring-white/95 dark:bg-slate-900/92 dark:ring-white/12"
      >
        <div class="mb-2 flex items-center justify-between px-2 pt-1">
          <div class="flex items-center gap-2">
            <Headphones class="h-4 w-4 text-crimson dark:text-crimson-bright" />
            <p class="text-[11px] font-bold tracking-widest text-slate-600 uppercase dark:text-slate-300">
              SPIN Audio Briefings &bull; Up Next ({{ tracks.length }})
            </p>
          </div>
          <button
            type="button"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close briefing queue"
            @click="toggleQueue"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-1">
          <button
            v-for="track in tracks"
            :key="track.id"
            type="button"
            class="group flex w-full cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              track.id === activeTrack.id
                ? 'bg-slate-900/6 ring-1 ring-slate-900/10 dark:bg-white/10 dark:ring-white/15'
                : 'hover:bg-slate-100/80 dark:hover:bg-white/5'
            "
            @click="playTrack(track.mediaItem)"
          >
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-white"
            >
              <img
                v-if="track.thumbnailUrl && !failedThumbs[track.id]"
                :src="track.thumbnailUrl"
                :alt="track.title"
                class="h-full w-full object-cover"
                @error="onThumbError(track.id)"
              />
              <Headphones v-else class="h-4 w-4 text-crimson-bright" />
              <div
                v-if="isTrackPlaying(track.id)"
                class="absolute inset-0 flex items-center justify-center gap-0.5 bg-slate-950/60"
              >
                <span class="eq-bar h-3.5 w-0.5 rounded-full bg-white" />
                <span class="eq-bar eq-bar-2 h-3.5 w-0.5 rounded-full bg-white" />
                <span class="eq-bar eq-bar-3 h-3.5 w-0.5 rounded-full bg-white" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <p
                class="font-display truncate text-sm font-bold text-slate-900 transition group-hover:text-crimson dark:text-slate-100 dark:group-hover:text-ochre-bright"
              >
                {{ track.title }}
              </p>
              <p class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {{ track.showLabel }} &bull; {{ track.hostLabel }}
              </p>
            </div>

            <span class="shrink-0 text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
              {{ formatClockTime(track.durationSeconds) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Main Sticky Glassmorphic Audio Dock -->
      <div
        class="rounded-[24px] bg-white/82 px-3.5 py-2.5 backdrop-blur-2xl shadow-float-dock ring-1 ring-white/90 transition sm:rounded-full sm:px-5 sm:py-2.5 dark:bg-slate-900/82 dark:ring-white/12"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <!-- Left: Track Artwork & Editorial Metadata -->
          <div class="flex min-w-0 items-center gap-3 sm:max-w-[270px] sm:flex-1">
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-sm sm:h-11 sm:w-11"
            >
              <img
                v-if="activeTrack.thumbnailUrl && !failedThumbs[activeTrack.id]"
                :src="activeTrack.thumbnailUrl"
                :alt="activeTrack.title"
                class="h-full w-full object-cover"
                @error="onThumbError(activeTrack.id)"
              />
              <Headphones v-else class="h-4 w-4 text-crimson-bright" />
              <div
                v-if="isPlaying"
                class="absolute inset-0 flex items-center justify-center gap-0.5 bg-slate-950/55"
              >
                <span class="eq-bar h-3.5 w-0.5 rounded-full bg-white" />
                <span class="eq-bar eq-bar-2 h-3.5 w-0.5 rounded-full bg-white" />
                <span class="eq-bar eq-bar-3 h-3.5 w-0.5 rounded-full bg-white" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                <span class="text-crimson dark:text-crimson-bright">SPIN Audio</span>
                <span class="text-slate-400">&bull;</span>
                <span class="truncate text-slate-500 dark:text-slate-400">
                  {{ activeTrack.showLabel }}
                </span>
              </div>
              <p
                class="font-display truncate text-sm font-bold leading-snug text-slate-900 dark:text-white"
                :title="activeTrack.title"
              >
                {{ activeTrack.title }}
              </p>
            </div>

            <!-- Mobile-only Quick Controls -->
            <div class="flex shrink-0 items-center gap-1 sm:hidden">
              <button
                type="button"
                class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition active:scale-95 dark:bg-white dark:text-slate-950"
                :aria-label="isPlaying ? 'Pause audio briefing' : 'Play audio briefing'"
                @click="togglePlay"
              >
                <Pause v-if="isPlaying" class="h-4 w-4 fill-current" />
                <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
              </button>
              <button
                type="button"
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-white/10"
                aria-label="Toggle audio queue"
                @click="toggleQueue"
              >
                <ListMusic class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-white/10"
                aria-label="Minimize audio player"
                @click="toggleMinimize"
              >
                <ChevronDown class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Center: Transport Controls + Scrubbable Progress -->
          <div class="flex flex-1 flex-col gap-1 sm:max-w-md">
            <div class="hidden items-center justify-center gap-1.5 sm:flex">
              <button
                type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Rewind 15 seconds"
                title="Rewind 15s"
                @click="skipBy(-15)"
              >
                <RotateCcw class="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Previous briefing"
                title="Previous"
                @click="prevTrack"
              >
                <SkipBack class="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                class="mx-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:scale-105 hover:bg-crimson active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
                :aria-label="isPlaying ? 'Pause audio briefing' : 'Play audio briefing'"
                @click="togglePlay"
              >
                <Pause v-if="isPlaying" class="h-4 w-4 fill-current" />
                <Play v-else class="ml-0.5 h-4 w-4 fill-current" />
              </button>

              <button
                type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Next briefing"
                title="Next"
                @click="nextTrack"
              >
                <SkipForward class="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Forward 15 seconds"
                title="Forward 15s"
                @click="skipBy(15)"
              >
                <RotateCw class="h-3.5 w-3.5" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="w-9 text-right text-[10px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                {{ formattedElapsed }}
              </span>

              <div class="relative flex h-4 flex-1 items-center">
                <div class="h-1 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-700/80">
                  <div
                    class="h-full rounded-full bg-crimson transition-[width] duration-150 dark:bg-crimson-bright"
                    :style="{ width: `${progressPercent}%` }"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  :max="activeTrack.durationSeconds"
                  :value="Math.floor(currentTime)"
                  aria-label="Seek briefing timeline"
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  @input="onSeekInput"
                />
              </div>

              <span class="w-9 text-[10px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                {{ formattedDuration }}
              </span>
            </div>
          </div>

          <!-- Right: Speed, Volume, Queue, Watch & Minimize -->
          <div class="hidden shrink-0 items-center gap-1 sm:flex">
            <button
              type="button"
              class="cursor-pointer rounded-full px-2 py-1 text-[11px] font-bold tabular-nums text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Cycle playback speed"
              title="Playback speed"
              @click="cycleRate"
            >
              {{ playbackRate }}&times;
            </button>

            <button
              type="button"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              :aria-label="isMuted ? 'Unmute audio briefing' : 'Mute audio briefing'"
              :title="isMuted ? 'Unmute' : 'Mute'"
              @click="toggleMute"
            >
              <VolumeX v-if="isMuted" class="h-4 w-4 text-crimson dark:text-crimson-bright" />
              <Volume2 v-else class="h-4 w-4" />
            </button>

            <button
              type="button"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              :class="
                queueOpen
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
              "
              :aria-expanded="queueOpen"
              aria-label="Toggle briefing queue"
              title="Up Next Queue"
              @click="toggleQueue"
            >
              <ListMusic class="h-4 w-4" />
            </button>

            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-900/6 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-crimson hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white/10 dark:text-slate-200 dark:hover:bg-crimson-bright"
              aria-label="Watch video broadcast in Media Hub"
              title="Watch Video"
              @click="openVideoWatch"
            >
              <Tv class="h-3.5 w-3.5" />
              <span class="hidden md:inline">Video</span>
            </button>

            <button
              type="button"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Minimize audio player"
              title="Minimize player"
              @click="toggleMinimize"
            >
              <ChevronDown class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
