<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, Facebook, RefreshCw, ShieldAlert } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { formatPublishedDate } from '@/composables/usePhtSchedule'

const { site, media } = useSpinData()

const embedVisible = ref(true)
const embedKey = ref(0)

const facebookUrl = computed(
  () => site.value?.facebookPageUrl ?? 'https://www.facebook.com/profile.php?id=61573222453208',
)

const pluginIframeSrc = computed(
  () =>
    `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookUrl.value)}&tabs=timeline&width=500&height=560&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`,
)

const facebookHighlights = computed(() =>
  media.value.filter((item) => item.platform === 'facebook').slice(0, 3),
)
</script>

<template>
  <!--
  <aside
    class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0E1730]"
  >
    <div
      class="flex items-center justify-between gap-2 border-b border-slate-200 bg-blue-600/10 px-4 py-3 dark:border-slate-800 dark:bg-blue-600/15"
    >
      <div class="flex items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Facebook class="h-4 w-4" />
        </span>
        <div>
          <h3 class="font-display text-sm font-bold text-slate-900 dark:text-white">
            Facebook Page Feed
          </h3>
          <p class="text-[11px] text-slate-600 dark:text-slate-300">
            Spin Media TV Philippines
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        title="Reload Facebook Timeline Embed"
        @click="
          () => {
            embedVisible = true
            embedKey++
          }
        "
      >
        <RefreshCw class="h-3 w-3" />
        Reload
      </button>
    </div>
  -->
    <!-- Live Facebook Page Plugin Embed -->
  <!--
    <div v-if="embedVisible" class="bg-slate-100 p-2 dark:bg-slate-900/70">
      <iframe
        :key="embedKey"
        :src="pluginIframeSrc"
        title="Spin Media TV Philippines Facebook Timeline"
        class="h-[460px] w-full rounded-xl border-0 bg-white"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  -->
    <!-- Graceful Fallback & Curated Highlights -->
  <!--
    <div class="space-y-3 p-4">
      <div
        class="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-[11px] leading-relaxed text-amber-900 dark:text-amber-200"
      >
        <ShieldAlert class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          If browser tracking protection hides the live Facebook frame above, browse curated updates
          below or open our official page directly.
        </span>
      </div>

      <div v-if="facebookHighlights.length > 0" class="space-y-2">
        <p class="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Curated Facebook Dispatches
        </p>
        <a
          v-for="post in facebookHighlights"
          :key="post.id"
          :href="post.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-xl border border-slate-200 p-2.5 transition hover:border-blue-500/50 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/25"
        >
          <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ post.title }}</p>
          <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {{ formatPublishedDate(post.publishedAt) }} &bull; {{ post.showLabel }}
          </p>
        </a>
      </div>

      <a
        :href="facebookUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition hover:bg-blue-500"
      >
        <Facebook class="h-4 w-4" />
        Open Spin Media TV on Facebook
        <ExternalLink class="h-3.5 w-3.5" />
      </a>
    </div>
  </aside>
  -->

  <!-- Gene - Nov, 19, 2026: Editorial Newsroom Social Wire sidebar -->
  <aside
    class="flex flex-col overflow-hidden rounded-sm border border-rule border-t-2 border-t-ink bg-white shadow-sm dark:border-obsidian-rule dark:border-t-crimson-bright dark:bg-obsidian-card"
  >
    <div
      class="flex items-center justify-between gap-2 border-b border-rule px-4 py-3 dark:border-obsidian-rule"
    >
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1877F2] text-white"
        >
          <Facebook class="h-4 w-4" />
        </span>
        <div>
          <h3 class="font-display text-base font-bold text-ink dark:text-[#F5F4F0]">
            Facebook Newsroom Wire
          </h3>
          <p
            class="font-mono text-[10px] tracking-wider text-ink-subtle uppercase dark:text-[#9A968D]"
          >
            Spin Media TV Philippines
          </p>
        </div>
      </div>

      <!--
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-ink uppercase transition hover:bg-paper-alt dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:hover:border-white/25"
        title="Reload Facebook Timeline Embed"
        @click="
          () => {
            embedVisible = true
            embedKey++
          }
        "
      >
        <RefreshCw class="h-3 w-3" />
        Reload
      </button>
      -->
      <!-- Gene - Nov, 19, 2026: Ensure Reload button retains dark background on hover in dark mode -->
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-ink uppercase transition hover:bg-paper-alt dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:hover:border-white/25 dark:hover:bg-[#242428]"
        title="Reload Facebook Timeline Embed"
        @click="
          () => {
            embedVisible = true
            embedKey++
          }
        "
      >
        <RefreshCw class="h-3 w-3" />
        Reload
      </button>
    </div>

    <div v-if="embedVisible" class="bg-paper-alt p-2 dark:bg-[#111112]">
      <iframe
        :key="embedKey"
        :src="pluginIframeSrc"
        title="Spin Media TV Philippines Facebook Timeline"
        class="h-[460px] w-full rounded-sm border-0 bg-white"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>

    <div class="space-y-3.5 p-4">
      <div
        class="flex items-start gap-2 rounded-sm border border-ochre/30 bg-ochre/10 p-2.5 text-[11px] leading-relaxed text-ink-muted dark:border-ochre-bright/30 dark:bg-ochre-bright/10 dark:text-[#C4C1B8]"
      >
        <ShieldAlert
          class="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre dark:text-ochre-bright"
        />
        <span>
          If browser tracking protection hides the live Facebook frame above, browse curated updates
          below or open our official page directly.
        </span>
      </div>

      <div v-if="facebookHighlights.length > 0">
        <p
          class="mb-2 font-mono text-[10px] font-semibold tracking-widest text-ink-subtle uppercase dark:text-[#9A968D]"
        >
          Curated Facebook Dispatches
        </p>
        <div
          class="divide-y divide-rule border-t border-b border-rule dark:divide-obsidian-rule dark:border-obsidian-rule"
        >
          <a
            v-for="post in facebookHighlights"
            :key="post.id"
            :href="post.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group block py-2.5 transition hover:bg-paper/70 dark:hover:bg-white/5"
          >
            <p
              class="font-display text-sm font-bold leading-snug text-ink transition group-hover:text-crimson dark:text-[#F5F4F0] dark:group-hover:text-ochre-bright"
            >
              {{ post.title }}
            </p>
            <p class="mt-1 font-mono text-[11px] text-ink-subtle dark:text-[#9A968D]">
              {{ formatPublishedDate(post.publishedAt) }} &bull; {{ post.showLabel }}
            </p>
          </a>
        </div>
      </div>

      <a
        :href="facebookUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex w-full items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#1565C0]"
      >
        <Facebook class="h-4 w-4" />
        Open Spin Media TV on Facebook
        <ExternalLink class="h-3.5 w-3.5" />
      </a>
    </div>
  </aside>
</template>
