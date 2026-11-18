<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, Facebook, Play, Youtube } from 'lucide-vue-next'
import { formatPublishedDate, formatViewCount } from '@/composables/usePhtSchedule'
import type { MediaItem } from '@/types/spin'

const props = defineProps<{
  item: MediaItem
  active?: boolean
}>()

const emit = defineEmits<{
  select: [item: MediaItem]
}>()

const imgFailed = ref(false)
const viewsText = computed(() => formatViewCount(props.item.views))
</script>

<template>
  <!--
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-200"
    :class="
      active
        ? 'border-red-500 bg-white ring-2 ring-red-500/25 dark:border-amber-400 dark:bg-[#101B38] dark:ring-amber-400/25'
        : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#0E1730] dark:hover:border-slate-700'
    "
  >
  -->
    <!-- Thumbnail / Visual Header -->
  <!--
    <button
      type="button"
      class="relative aspect-video w-full overflow-hidden bg-slate-900 text-left"
      @click="emit('select', item)"
    >
      <img
        v-if="item.thumbnailUrl && !imgFailed"
        :src="item.thumbnailUrl"
        :alt="item.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        @error="imgFailed = true"
      />
      <div
        v-else
        class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0F2458] via-[#152E6E] to-[#0B132B] p-4"
      >
        <Facebook class="h-7 w-7 text-blue-300" />
        <p class="font-display line-clamp-2 text-sm font-bold text-white">
          {{ item.showLabel }}
        </p>
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/25 opacity-80 transition group-hover:opacity-95"
      />
  -->
      <!-- Top Platform Badge -->
  <!--
      <div class="absolute top-3 left-3 flex items-center gap-1.5">
        <span
          class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase shadow"
          :class="
            item.platform === 'youtube'
              ? item.format === 'short'
                ? 'bg-rose-600'
                : 'bg-red-600'
              : 'bg-blue-600'
          "
        >
          <Youtube v-if="item.platform === 'youtube'" class="h-3 w-3" />
          <Facebook v-else class="h-3 w-3" />
          {{
            item.platform === 'youtube'
              ? item.format === 'short'
                ? 'Short'
                : 'YouTube'
              : 'Facebook'
          }}
        </span>
      </div>
  -->
      <!-- Center Play Icon on Hover -->
  <!--
      <div
        class="absolute inset-0 flex items-center justify-center opacity-85 transition group-hover:opacity-100"
      >
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-red-600"
        >
          <Play class="ml-0.5 h-5 w-5 fill-current" />
        </span>
      </div>
    </button>
  -->
    <!-- Body -->
  <!--
    <div class="flex flex-1 flex-col justify-between gap-3 p-4">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span
            class="rounded-md bg-amber-500/12 px-2 py-0.5 font-semibold text-amber-700 dark:text-amber-300"
          >
            {{ item.showLabel }}
          </span>
          <span class="text-slate-500 dark:text-slate-400">
            {{ formatPublishedDate(item.publishedAt) }}
          </span>
        </div>

        <button
          type="button"
          class="text-left"
          @click="emit('select', item)"
        >
          <h3
            class="font-display line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-amber-300"
          >
            {{ item.title }}
          </h3>
        </button>

        <p class="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {{ item.summary }}
        </p>
      </div>

      <div
        class="flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800/80"
      >
        <button
          type="button"
          class="font-bold text-red-600 transition hover:text-red-500 dark:text-amber-400 dark:hover:text-amber-300"
          @click="emit('select', item)"
        >
          {{ active ? 'Playing in Theater' : 'Play in Theater' }}
        </button>

        <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span v-if="viewsText">{{ viewsText }}</span>
          <a
            :href="item.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            :aria-label="`Open ${item.title} on ${item.platform}`"
          >
            Source
            <ExternalLink class="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  </article>
  -->

  <!-- Gene - Nov, 19, 2026: Editorial story card with sharp framing, Newsreader headline, and charcoal fallback -->
  <article
    class="group flex flex-col overflow-hidden rounded-sm border transition-all duration-200"
    :class="
      active
        ? 'border-crimson border-t-2 border-t-crimson bg-white shadow-sm dark:border-crimson-bright dark:border-t-crimson-bright dark:bg-obsidian-card'
        : 'border-rule bg-white hover:border-ink/40 hover:shadow-md dark:border-obsidian-rule dark:bg-obsidian-card dark:hover:border-white/25'
    "
  >
    <button
      type="button"
      class="relative aspect-video w-full cursor-pointer overflow-hidden bg-[#141413] text-left"
      @click="emit('select', item)"
    >
      <img
        v-if="item.thumbnailUrl && !imgFailed"
        :src="item.thumbnailUrl"
        :alt="item.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        @error="imgFailed = true"
      />
      <div
        v-else
        class="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#1D1C1B] via-[#282524] to-[#121213] p-4"
      >
        <Facebook class="h-7 w-7 text-[#60A5FA]" />
        <p class="font-display line-clamp-2 text-sm font-bold text-[#F5F4F0]">
          {{ item.showLabel }}
        </p>
      </div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 opacity-80 transition group-hover:opacity-95"
      />

      <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
        <span
          class="inline-flex items-center gap-1 rounded-[2px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white uppercase shadow"
          :class="
            item.platform === 'youtube'
              ? item.format === 'short'
                ? 'bg-[#9F1239]'
                : 'bg-crimson'
              : 'bg-[#1877F2]'
          "
        >
          <Youtube v-if="item.platform === 'youtube'" class="h-3 w-3" />
          <Facebook v-else class="h-3 w-3" />
          {{
            item.platform === 'youtube'
              ? item.format === 'short'
                ? 'Short'
                : 'YouTube'
              : 'Facebook'
          }}
        </span>
      </div>

      <div
        class="absolute inset-0 flex items-center justify-center opacity-85 transition group-hover:opacity-100"
      >
        <span
          class="flex h-11 w-11 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-crimson"
        >
          <Play class="ml-0.5 h-5 w-5 fill-current" />
        </span>
      </div>
    </button>

    <div class="flex flex-1 flex-col justify-between gap-3 p-4">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="text-[11px] font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright"
          >
            {{ item.showLabel }}
          </span>
          <span class="font-mono text-[11px] text-ink-subtle dark:text-[#9A968D]">
            {{ formatPublishedDate(item.publishedAt) }}
          </span>
        </div>

        <button type="button" class="cursor-pointer text-left" @click="emit('select', item)">
          <h3
            class="font-display line-clamp-2 text-base font-bold leading-snug text-ink transition group-hover:text-crimson dark:text-[#F5F4F0] dark:group-hover:text-ochre-bright"
          >
            {{ item.title }}
          </h3>
        </button>

        <p class="line-clamp-2 text-xs leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
          {{ item.summary }}
        </p>
      </div>

      <div
        class="flex items-center justify-between border-t border-rule pt-3 text-xs dark:border-obsidian-rule"
      >
        <button
          type="button"
          class="cursor-pointer font-mono text-[11px] font-semibold tracking-wider text-crimson uppercase transition hover:underline dark:text-ochre-bright"
          @click="emit('select', item)"
        >
          {{ active ? 'Now Playing' : 'Play in Theater' }}
        </button>

        <div
          class="flex items-center gap-3 font-mono text-[11px] tabular-nums text-ink-subtle dark:text-[#9A968D]"
        >
          <span v-if="viewsText">{{ viewsText }}</span>
          <a
            :href="item.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 hover:text-ink dark:hover:text-white"
            :aria-label="`Open ${item.title} on ${item.platform}`"
          >
            Source
            <ExternalLink class="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
