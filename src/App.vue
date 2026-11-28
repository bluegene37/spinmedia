<script setup lang="ts">
import { onMounted } from 'vue'
// import BroadcastTicker from '@/components/layout/BroadcastTicker.vue'
// Gene - Nov, 19, 2026: Replace top chyron ticker with floating bottom audio bar
// import FloatingAudioBar from '@/components/media/FloatingAudioBar.vue'
// Gene - Nov, 19, 2026: Floating audio bar removed per user request for a cleaner full-width layout
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useSpinData } from '@/composables/useSpinData'
// Gene - Nov, 28, 2026: Import Vercel Web Analytics Vue component
import { Analytics } from '@vercel/analytics/vue'
// Gene - Nov, 28, 2026: Import Vercel Speed Insights Vue component
import { SpeedInsights } from '@vercel/speed-insights/vue'

const { loading, error, loaded, loadSpinData } = useSpinData()

onMounted(() => {
  void loadSpinData()
})
</script>

<template>
  <!--
  <div
    class="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#070D1F] dark:text-slate-100"
  >
    <BroadcastTicker />
    <AppNavbar />

    <main class="flex-1">
      <div
        v-if="error"
        class="mx-auto my-10 max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center"
      >
        <h2 class="font-display text-lg font-bold text-red-600 dark:text-red-400">
          Unable to Load Broadcast Data
        </h2>
        <p class="mt-2 text-sm text-slate-700 dark:text-slate-300">{{ error }}</p>
      </div>

      <div
        v-else-if="loading && !loaded"
        class="mx-auto flex max-w-7xl items-center justify-center px-4 py-24"
      >
        <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span class="h-3 w-3 animate-ping rounded-full bg-red-600" />
          Loading SPIN Media TV Philippines broadcast feed...
        </div>
      </div>

      <RouterView v-else />
    </main>

    <AppFooter />
  </div>
  -->
  <!-- Gene - Nov, 19, 2026: Editorial paper & obsidian charcoal layout shell -->
  <!--
  <div
    class="flex min-h-screen flex-col bg-paper text-ink transition-colors duration-200 dark:bg-obsidian dark:text-[#F5F4F0]"
  >
    <BroadcastTicker />
    <AppNavbar />

    <main class="flex-1">
      <div
        v-if="error"
        class="mx-auto my-10 max-w-2xl rounded-sm border border-rule border-t-4 border-t-crimson bg-white p-6 text-center dark:border-obsidian-rule dark:border-t-crimson-bright dark:bg-obsidian-card"
      >
        <h2 class="font-display text-lg font-bold text-crimson dark:text-crimson-bright">
          Unable to Load Broadcast Data
        </h2>
        <p class="mt-2 text-sm text-ink-muted dark:text-[#C4C1B8]">{{ error }}</p>
      </div>

      <div
        v-else-if="loading && !loaded"
        class="mx-auto flex max-w-7xl items-center justify-center px-4 py-24"
      >
        <div
          class="flex items-center gap-3 font-mono text-xs font-semibold tracking-wider text-ink-muted uppercase dark:text-[#C4C1B8]"
        >
          <span class="h-2.5 w-2.5 animate-ping rounded-full bg-crimson dark:bg-crimson-bright" />
          Loading SPIN Media TV Philippines broadcast feed...
        </div>
      </div>

      <RouterView v-else />
    </main>

    <AppFooter />
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Antigravity floating editorial layout shell with glassmorphic pill & sticky audio dock -->
  <!--
  <div
    class="antigravity-canvas flex min-h-screen flex-col text-slate-ink transition-colors duration-300 dark:text-slate-100"
  >
    <AppNavbar />

    <main class="flex-1">
      <div
        v-if="error"
        class="mx-auto my-12 max-w-xl rounded-[24px] bg-white p-7 text-center shadow-float-elevated ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/10"
      >
        <h2 class="font-display text-xl font-bold text-crimson dark:text-crimson-bright">
          Unable to Load Broadcast Data
        </h2>
        <p class="mt-2 text-sm text-slate-body dark:text-slate-300">{{ error }}</p>
      </div>

      <div
        v-else-if="loading && !loaded"
        class="mx-auto flex max-w-6xl items-center justify-center px-4 py-28"
      >
        <div
          class="inline-flex items-center gap-3 rounded-full bg-white/85 px-5 py-2.5 text-xs font-semibold tracking-wider text-slate-body uppercase backdrop-blur-xl shadow-float-pill ring-1 ring-white/90 dark:bg-slate-900/85 dark:text-slate-300 dark:ring-white/10"
        >
          <span class="h-2.5 w-2.5 animate-ping rounded-full bg-crimson dark:bg-crimson-bright" />
          Loading SPIN Media TV Philippines broadcast feed...
        </div>
      </div>

      <RouterView v-else />
    </main>

    <AppFooter />

    <FloatingAudioBar v-if="loaded" />
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Full-width Antigravity layout shell without floating audio bar -->
  <div
    class="antigravity-canvas flex min-h-screen flex-col text-slate-ink transition-colors duration-300 dark:text-slate-100"
  >
    <AppNavbar />

    <main class="flex-1">
      <div
        v-if="error"
        class="mx-auto my-12 max-w-xl rounded-[24px] bg-white p-7 text-center shadow-float-elevated ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/10"
      >
        <h2 class="font-display text-xl font-bold text-crimson dark:text-crimson-bright">
          Unable to Load Broadcast Data
        </h2>
        <p class="mt-2 text-sm text-slate-body dark:text-slate-300">{{ error }}</p>
      </div>

      <div
        v-else-if="loading && !loaded"
        class="flex w-full items-center justify-center px-4 py-28 sm:px-6 lg:px-8"
      >
        <div
          class="inline-flex items-center gap-3 rounded-full bg-white/85 px-5 py-2.5 text-xs font-semibold tracking-wider text-slate-body uppercase backdrop-blur-xl shadow-float-pill ring-1 ring-white/90 dark:bg-slate-900/85 dark:text-slate-300 dark:ring-white/10"
        >
          <span class="h-2.5 w-2.5 animate-ping rounded-full bg-crimson dark:bg-crimson-bright" />
          Loading SPIN Media TV Philippines broadcast feed...
        </div>
      </div>

      <RouterView v-else />
    </main>

    <AppFooter />
    <!-- Gene - Nov, 28, 2026: Mount Vercel Web Analytics for page view and route tracking -->
    <Analytics />
    <!-- Gene - Nov, 28, 2026: Mount Vercel Speed Insights for performance monitoring -->
    <SpeedInsights />
  </div>
</template>
