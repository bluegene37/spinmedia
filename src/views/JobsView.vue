<!-- Gene - Nov, 19, 2026: Minimal floating Antigravity empty-state page for SPIN Jobs -->
<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Briefcase } from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20 xl:px-10">
    <AntigravityCard depth="elevated" :max-tilt="1.2" as="section" aria-label="SPIN Jobs">
      <div class="mx-auto flex max-w-2xl flex-col items-center px-6 py-12 text-center sm:px-12 sm:py-16">
        <span
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-crimson shadow-sm dark:bg-white/10 dark:text-crimson-bright"
        >
          <Briefcase class="h-6 w-6" />
        </span>

        <p
          class="mt-5 text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright"
        >
          Careers &amp; Opportunities
        </p>

        <h1
          class="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-ink sm:text-4xl dark:text-white"
        >
          SPIN Jobs
        </h1>

        <p class="mt-3 max-w-lg text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
          There are no open positions posted at the moment. Check back soon for newsroom, broadcast
          production, and regional chapter opportunities.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <ArrowLeft class="h-3.5 w-3.5" />
            Back to Front Page
          </RouterLink>

          <RouterLink
            to="/contact"
            class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
          >
            Contact News Desk
            <ArrowUpRight class="h-3.5 w-3.5" />
          </RouterLink>
        </div>
      </div>
    </AntigravityCard>
  </div>
</template>
