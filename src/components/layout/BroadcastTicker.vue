<script setup lang="ts">
import { Radio, ExternalLink } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { usePhtSchedule } from '@/composables/usePhtSchedule'

const { site, shows } = useSpinData()
const { manilaClock, liveShow, nextShow } = usePhtSchedule(shows)
</script>

<template>
  <!--
  <div
    class="border-b border-slate-200/80 bg-slate-900 text-slate-100 dark:border-slate-800/90 dark:bg-[#050A18]"
  >
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs sm:px-6 lg:px-8"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase"
          :class="
            liveShow
              ? 'bg-red-600 text-white'
              : 'bg-red-600/15 text-red-400 ring-1 ring-red-500/30'
          "
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="liveShow ? 'animate-ping bg-white' : 'animate-pulse bg-red-500'"
          />
          {{ liveShow ? 'On Air Now' : 'SPIN Broadcast Desk' }}
        </span>

        <p v-if="liveShow" class="truncate font-medium text-slate-100">
          <span class="font-bold text-amber-400">{{ liveShow.title }}</span>
          <span class="hidden text-slate-400 sm:inline"> — {{ liveShow.timeLabel }}</span>
        </p>
        <p v-else-if="nextShow" class="truncate text-slate-300">
          <span class="text-slate-400">Up Next:</span>
          <RouterLink
            :to="{ path: '/media', query: { show: nextShow.slug } }"
            class="ml-1 font-semibold text-amber-400 hover:underline"
          >
            {{ nextShow.title }}
          </RouterLink>
          <span class="hidden text-slate-400 md:inline">
            ({{ nextShow.dayLabel }}, {{ nextShow.timeLabel }})
          </span>
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-3 text-slate-300">
        <span class="hidden items-center gap-1.5 text-slate-400 sm:inline-flex">
          <Radio class="h-3.5 w-3.5 text-amber-400" />
          <span>{{ manilaClock }} PHT</span>
        </span>
        <a
          v-if="site"
          :href="site.socials.find((s) => s.platform === 'youtube')?.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 font-medium text-slate-200 transition hover:text-red-400"
        >
          YouTube
          <ExternalLink class="h-3 w-3" />
        </a>
        <a
          v-if="site"
          :href="site.facebookPageUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 font-medium text-slate-200 transition hover:text-blue-400"
        >
          Facebook
          <ExternalLink class="h-3 w-3" />
        </a>
      </div>
    </div>
  </div>
  -->
  <!-- Gene - Nov, 19, 2026: Newsroom broadcast chyron ticker bar (obsidian ink + crimson badge) -->
  <div class="border-b border-white/10 bg-[#141413] text-[#F5F4F0] dark:bg-[#0A0A0B]">
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs sm:px-6 lg:px-8"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded-[2px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-white uppercase"
          :class="liveShow ? 'bg-crimson' : 'bg-crimson/90'"
        >
          <span
            class="h-1.5 w-1.5 rounded-full bg-white"
            :class="liveShow ? 'animate-ping' : 'animate-pulse'"
          />
          {{ liveShow ? 'On Air' : 'Broadcast Desk' }}
        </span>

        <p v-if="liveShow" class="truncate font-medium text-[#F5F4F0]">
          <span class="font-bold text-ochre-bright">{{ liveShow.title }}</span>
          <span class="hidden text-[#C4C1B8] sm:inline"> &mdash; {{ liveShow.timeLabel }}</span>
        </p>
        <p v-else-if="nextShow" class="truncate text-[#C4C1B8]">
          <span class="font-mono text-[11px] text-[#9A968D] uppercase">Up Next:</span>
          <RouterLink
            :to="{ path: '/media', query: { show: nextShow.slug } }"
            class="ml-1.5 font-semibold text-ochre-bright hover:underline"
          >
            {{ nextShow.title }}
          </RouterLink>
          <span class="hidden font-mono text-[11px] text-[#9A968D] md:inline">
            ({{ nextShow.dayLabel }}, {{ nextShow.timeLabel }})
          </span>
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-3 text-[#C4C1B8]">
        <span class="hidden items-center gap-1.5 font-mono text-[11px] tabular-nums sm:inline-flex">
          <Radio class="h-3.5 w-3.5 text-crimson-bright" />
          <span>{{ manilaClock }} PHT</span>
        </span>
        <a
          v-if="site"
          :href="site.socials.find((s) => s.platform === 'youtube')?.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 border-l border-white/15 pl-3 font-mono text-[10px] font-semibold tracking-wider text-[#F5F4F0] uppercase transition hover:text-crimson-bright"
        >
          YouTube
          <ExternalLink class="h-3 w-3" />
        </a>
        <a
          v-if="site"
          :href="site.facebookPageUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 font-mono text-[10px] font-semibold tracking-wider text-[#F5F4F0] uppercase transition hover:text-[#60A5FA]"
        >
          Facebook
          <ExternalLink class="h-3 w-3" />
        </a>
      </div>
    </div>
  </div>
</template>
