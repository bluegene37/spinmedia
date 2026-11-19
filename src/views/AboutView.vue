<script setup lang="ts">
// import { Award, CalendarClock, CheckCircle2, Compass, ShieldCheck, Users } from 'lucide-vue-next'
// import { useSpinData } from '@/composables/useSpinData'
// import { useTheme } from '@/composables/useTheme'
//
// const { site, shows, about } = useSpinData()
// const { isDark } = useTheme()
// Gene - Nov, 19, 2026: Editorial About Us page uses CSS theme classes directly and numeric pillar indexers
import { Award, CalendarClock, Compass, ShieldCheck, Users } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
// Gene - Nov, 19, 2026: Use AntigravityCard for floating borderless About page
import AntigravityCard from '@/components/ui/AntigravityCard.vue'

const { site, shows, about } = useSpinData()
</script>

<template>
  <!--
  <div>
  -->
    <!-- Hero Identity Section -->
  <!--
    <section
      class="border-b border-slate-200/80 dark:border-slate-800/80"
      :class="isDark ? 'studio-grid-bg bg-[#070D1F]' : 'newsroom-grid-bg bg-white'"
    >
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div class="max-w-3xl space-y-4">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300"
          >
            <ShieldCheck class="h-3.5 w-3.5" />
            {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }}
          </span>
          <h1 class="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            {{ about?.headline ?? 'Independent Digital Broadcasting for the Filipino Public' }}
          </h1>
          <p class="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {{ about?.intro }}
          </p>
        </div>
      </div>
    </section>
  -->
    <!-- Mission & Vision -->
  <!--
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-2">
        <div
          class="rounded-2xl border border-slate-200 border-l-4 border-l-red-600 bg-white p-6 shadow-sm dark:border-slate-800 dark:border-l-red-500 dark:bg-[#0E1730]"
        >
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Compass class="h-5 w-5" />
            <h2 class="font-display text-lg font-extrabold">Our Mission</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {{ about?.mission }}
          </p>
        </div>

        <div
          class="rounded-2xl border border-slate-200 border-l-4 border-l-amber-500 bg-white p-6 shadow-sm dark:border-slate-800 dark:border-l-amber-400 dark:bg-[#0E1730]"
        >
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Award class="h-5 w-5" />
            <h2 class="font-display text-lg font-extrabold">Our Vision</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {{ about?.vision }}
          </p>
        </div>
      </div>
  -->
      <!-- Core Pillars -->
  <!--
      <div class="mt-12">
        <h2 class="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          Core Editorial Pillars
        </h2>
        <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="pillar in about?.coreValues ?? []"
            :key="pillar.title"
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0E1730]"
          >
            <CheckCircle2 class="h-5 w-5 text-red-600 dark:text-amber-400" />
            <h3 class="font-display mt-3 text-base font-bold text-slate-900 dark:text-white">
              {{ pillar.title }}
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {{ pillar.description }}
            </p>
          </div>
        </div>
      </div>
  -->
      <!-- Leadership & Hosts -->
  <!--
      <div class="mt-14">
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p class="text-xs font-bold tracking-wider text-red-600 uppercase dark:text-amber-400">
              The Voices Behind the Network
            </p>
            <h2 class="font-display mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              Leadership, Anchors &amp; Program Hosts
            </h2>
          </div>
          <RouterLink
            to="/media"
            class="text-sm font-bold text-red-600 hover:underline dark:text-amber-400"
          >
            Watch their programs in Media Hub &rarr;
          </RouterLink>
        </div>

        <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="member in about?.leadership ?? []"
            :key="member.name"
            class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0E1730]"
          >
            <div>
              <div class="flex items-center gap-3">
                <span
                  class="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-extrabold text-amber-400 dark:bg-slate-800"
                >
                  {{
                    member.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')
                  }}
                </span>
                <div>
                  <h3 class="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {{ member.name }}
                  </h3>
                  <p class="text-[11px] font-semibold text-red-600 dark:text-red-400">
                    {{ member.role }}
                  </p>
                </div>
              </div>
              <p class="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {{ member.bio }}
              </p>
            </div>
            <div
              v-if="member.show"
              class="mt-4 border-t border-slate-100 pt-2.5 text-[11px] font-semibold text-amber-700 dark:border-slate-800 dark:text-amber-300"
            >
              Program: {{ member.show }}
            </div>
          </article>
        </div>
      </div>
  -->
      <!-- Broadcast Schedule & Affiliations -->
  <!--
      <div class="mt-14 grid gap-8 lg:grid-cols-12">
        <div
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-[#0E1730]"
        >
          <div class="flex items-center gap-2">
            <CalendarClock class="h-5 w-5 text-red-600 dark:text-amber-400" />
            <h2 class="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              Weekly Program Grid (PHT)
            </h2>
          </div>
          <div class="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="show in shows"
              :key="show.id"
              class="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
            >
              <div>
                <RouterLink
                  :to="{ path: '/media', query: { show: show.slug } }"
                  class="font-display text-sm font-bold text-slate-900 hover:text-red-600 dark:text-white dark:hover:text-amber-300"
                >
                  {{ show.title }}
                </RouterLink>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ show.hosts.join(', ') }}
                </p>
              </div>
              <div class="text-left sm:text-right">
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {{ show.dayLabel }}
                </p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ show.timeLabel }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5 dark:border-slate-800 dark:bg-[#0E1730]"
        >
          <div>
            <div class="flex items-center gap-2">
              <Users class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 class="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                Affiliations &amp; Network Ties
              </h2>
            </div>
            <ul class="mt-4 space-y-3">
              <li
                v-for="org in about?.affiliations ?? []"
                :key="org"
                class="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              >
                <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{{ org }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 rounded-xl bg-slate-900 p-4 text-white dark:bg-slate-950">
            <p class="font-display text-sm font-bold">Want to collaborate or guest on a show?</p>
            <p class="mt-1 text-xs text-slate-300">
              Reach our newsroom for citizen reports, Gawad Parangal inquiries, or program guestings.
            </p>
            <RouterLink
              to="/contact"
              class="mt-3 inline-flex items-center rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-red-500"
            >
              Contact Broadcast Desk &rarr;
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Broadsheet Network Profile, Editorial Pillars & Newsroom Masthead Directory -->
  <!--
  <div>
    <section class="border-b border-rule bg-white dark:border-obsidian-rule dark:bg-obsidian-card">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div class="max-w-3xl space-y-4">
          <span
            class="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
          >
            <ShieldCheck class="h-3.5 w-3.5" />
            Network Profile &bull; {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }}
          </span>
          <h1
            class="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl dark:text-[#F5F4F0]"
          >
            {{ about?.headline ?? 'Independent Digital Broadcasting for the Filipino Public' }}
          </h1>
          <p class="text-base leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
            {{ about?.intro }}
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-2">
        <div
          class="rounded-sm border border-rule border-l-4 border-l-crimson bg-white p-6 shadow-sm dark:border-obsidian-rule dark:border-l-crimson-bright dark:bg-obsidian-card"
        >
          <div class="flex items-center gap-2 text-crimson dark:text-crimson-bright">
            <Compass class="h-5 w-5" />
            <h2 class="font-display text-xl font-extrabold">Our Mission</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
            {{ about?.mission }}
          </p>
        </div>

        <div
          class="rounded-sm border border-rule border-l-4 border-l-ochre bg-white p-6 shadow-sm dark:border-obsidian-rule dark:border-l-ochre-bright dark:bg-obsidian-card"
        >
          <div class="flex items-center gap-2 text-ochre dark:text-ochre-bright">
            <Award class="h-5 w-5" />
            <h2 class="font-display text-xl font-extrabold">Our Vision</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
            {{ about?.vision }}
          </p>
        </div>
      </div>

      <div class="mt-12 border-t-2 border-ink pt-4 dark:border-obsidian-rule">
        <p
          class="font-mono text-[10px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
        >
          Editorial Standards
        </p>
        <h2 class="font-display mt-1 text-2xl font-extrabold text-ink dark:text-[#F5F4F0]">
          Core Editorial Pillars
        </h2>
        <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(pillar, idx) in about?.coreValues ?? []"
            :key="pillar.title"
            class="rounded-sm border border-rule bg-white p-5 shadow-sm dark:border-obsidian-rule dark:bg-obsidian-card"
          >
            <span
              class="font-mono text-xs font-semibold text-crimson dark:text-crimson-bright"
            >
              {{ String(idx + 1).padStart(2, '0') }}
            </span>
            <h3 class="font-display mt-2.5 text-lg font-bold text-ink dark:text-[#F5F4F0]">
              {{ pillar.title }}
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
              {{ pillar.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-14 border-t-2 border-ink pt-4 dark:border-obsidian-rule">
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p
              class="font-mono text-[10px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
            >
              Newsroom Masthead Directory
            </p>
            <h2 class="font-display mt-1 text-2xl font-extrabold text-ink dark:text-[#F5F4F0]">
              Leadership, Anchors &amp; Program Hosts
            </h2>
          </div>
          <RouterLink
            to="/media"
            class="font-mono text-xs font-semibold tracking-wider text-crimson uppercase hover:underline dark:text-ochre-bright"
          >
            Watch their programs in Media Hub &rarr;
          </RouterLink>
        </div>

        <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="member in about?.leadership ?? []"
            :key="member.name"
            class="flex flex-col justify-between rounded-sm border border-rule bg-white p-5 shadow-sm dark:border-obsidian-rule dark:bg-obsidian-card"
          >
            <div>
              <div class="flex items-center gap-3">
                <span
                  class="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink text-xs font-extrabold text-[#F5F4F0] dark:bg-[#27272A]"
                >
                  {{
                    member.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')
                  }}
                </span>
                <div>
                  <h3 class="font-display text-base font-bold text-ink dark:text-[#F5F4F0]">
                    {{ member.name }}
                  </h3>
                  <p
                    class="text-[11px] font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright"
                  >
                    {{ member.role }}
                  </p>
                </div>
              </div>
              <p class="mt-3 text-xs leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
                {{ member.bio }}
              </p>
            </div>
            <div
              v-if="member.show"
              class="mt-4 border-t border-rule pt-2.5 font-mono text-[11px] font-medium text-ochre dark:border-obsidian-rule dark:text-ochre-bright"
            >
              Program: {{ member.show }}
            </div>
          </article>
        </div>
      </div>

      <div class="mt-14 grid gap-8 lg:grid-cols-12">
        <div
          class="rounded-sm border border-rule border-t-2 border-t-ink bg-white p-6 shadow-sm lg:col-span-7 dark:border-obsidian-rule dark:border-t-crimson-bright dark:bg-obsidian-card"
        >
          <div class="flex items-center gap-2">
            <CalendarClock class="h-5 w-5 text-crimson dark:text-ochre-bright" />
            <h2 class="font-display text-xl font-extrabold text-ink dark:text-[#F5F4F0]">
              Weekly Program Grid (PHT)
            </h2>
          </div>
          <div class="mt-4 divide-y divide-rule dark:divide-obsidian-rule">
            <div
              v-for="show in shows"
              :key="show.id"
              class="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
            >
              <div>
                <RouterLink
                  :to="{ path: '/media', query: { show: show.slug } }"
                  class="font-display text-base font-bold text-ink hover:text-crimson dark:text-[#F5F4F0] dark:hover:text-ochre-bright"
                >
                  {{ show.title }}
                </RouterLink>
                <p class="text-xs text-ink-muted dark:text-[#9A968D]">
                  {{ show.hosts.join(', ') }}
                </p>
              </div>
              <div class="text-left font-mono sm:text-right">
                <p class="text-xs font-semibold text-ink dark:text-[#F5F4F0]">
                  {{ show.dayLabel }}
                </p>
                <p class="text-[11px] tabular-nums text-ink-subtle dark:text-[#9A968D]">
                  {{ show.timeLabel }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col justify-between rounded-sm border border-rule border-t-2 border-t-ink bg-white p-6 shadow-sm lg:col-span-5 dark:border-obsidian-rule dark:border-t-ochre-bright dark:bg-obsidian-card"
        >
          <div>
            <div class="flex items-center gap-2">
              <Users class="h-5 w-5 text-civic dark:text-[#2DD4BF]" />
              <h2 class="font-display text-xl font-extrabold text-ink dark:text-[#F5F4F0]">
                Affiliations &amp; Network Ties
              </h2>
            </div>
            <ul class="mt-4 space-y-2.5">
              <li
                v-for="org in about?.affiliations ?? []"
                :key="org"
                class="flex items-start gap-2.5 rounded-sm border border-rule bg-paper p-3 text-xs font-semibold text-ink dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0]"
              >
                <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-ochre dark:text-ochre-bright" />
                <span>{{ org }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 rounded-sm bg-[#141413] p-5 text-[#F5F4F0] dark:bg-[#0A0A0B]">
            <p class="font-display text-base font-bold">Want to collaborate or guest on a show?</p>
            <p class="mt-1 text-xs leading-relaxed text-[#C4C1B8]">
              Reach our newsroom for citizen reports, Gawad Parangal inquiries, or program guestings.
            </p>
            <RouterLink
              to="/contact"
              class="mt-3.5 inline-flex items-center rounded-sm bg-crimson px-3.5 py-2 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-crimson-dark"
            >
              Contact Broadcast Desk &rarr;
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Antigravity borderless About page harmonized at max-w-[1600px] -->
  <div class="mx-auto w-full max-w-[1600px] space-y-12 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-10">
    <!-- Hero Identity Card -->
    <AntigravityCard depth="hero" :max-tilt="1.0" as="section" aria-label="Network Profile">
      <div class="p-7 sm:p-10 lg:p-12">
        <div class="max-w-4xl space-y-4">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
          >
            <ShieldCheck class="h-3.5 w-3.5" />
            Network Profile &bull; {{ site?.parentOrg ?? 'Secure the Philippines Information Network (SPIN)' }}
          </span>
          <h1
            class="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-ink sm:text-4xl lg:text-5xl dark:text-white"
          >
            {{ about?.headline ?? 'Independent Digital Broadcasting for the Filipino Public' }}
          </h1>
          <p class="text-base leading-relaxed text-slate-body dark:text-slate-300">
            {{ about?.intro }}
          </p>
        </div>
      </div>
    </AntigravityCard>

    <!-- Mission & Vision -->
    <section class="grid gap-6 md:grid-cols-2" aria-label="Mission and Vision">
      <AntigravityCard depth="elevated" :max-tilt="1.4" as="div">
        <div class="p-7 sm:p-8">
          <div class="flex items-center gap-2.5 text-crimson dark:text-crimson-bright">
            <span class="flex h-9 w-9 items-center justify-center rounded-2xl bg-crimson/10 dark:bg-crimson-bright/20">
              <Compass class="h-5 w-5" />
            </span>
            <h2 class="font-display text-2xl font-extrabold text-slate-ink dark:text-white">Our Mission</h2>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
            {{ about?.mission }}
          </p>
        </div>
      </AntigravityCard>

      <AntigravityCard depth="elevated" :max-tilt="1.4" as="div">
        <div class="p-7 sm:p-8">
          <div class="flex items-center gap-2.5 text-ochre dark:text-ochre-bright">
            <span class="flex h-9 w-9 items-center justify-center rounded-2xl bg-ochre/10 dark:bg-ochre-bright/20">
              <Award class="h-5 w-5" />
            </span>
            <h2 class="font-display text-2xl font-extrabold text-slate-ink dark:text-white">Our Vision</h2>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
            {{ about?.vision }}
          </p>
        </div>
      </AntigravityCard>
    </section>

    <!-- Core Editorial Pillars -->
    <section class="space-y-6" aria-label="Core Editorial Pillars">
      <div>
        <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
          Editorial Standards
        </p>
        <h2 class="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
          Core Editorial Pillars
        </h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AntigravityCard
          v-for="(pillar, idx) in about?.coreValues ?? []"
          :key="pillar.title"
          depth="recessed"
          :max-tilt="1.5"
          as="div"
        >
          <div class="p-6">
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-crimson/10 text-xs font-bold tabular-nums text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright"
            >
              {{ String(idx + 1).padStart(2, '0') }}
            </span>
            <h3 class="font-display mt-3.5 text-lg font-bold text-slate-ink dark:text-white">
              {{ pillar.title }}
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
              {{ pillar.description }}
            </p>
          </div>
        </AntigravityCard>
      </div>
    </section>

    <!-- Newsroom Masthead Directory -->
    <section class="space-y-6" aria-label="Leadership and Program Hosts">
      <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
            Newsroom Masthead Directory
          </p>
          <h2 class="font-display mt-1 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
            Leadership, Anchors &amp; Program Hosts
          </h2>
        </div>
        <RouterLink
          to="/media"
          class="text-xs font-bold tracking-wide text-crimson transition hover:underline dark:text-ochre-bright"
        >
          Watch their programs in Media Hub &rarr;
        </RouterLink>
      </div>

      <!-- <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> -->
      <!-- Gene - Nov, 19, 2026: Switch desktop leadership grid to 3 columns for a balanced 3x3 layout with 9 members -->
      <!-- <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> -->
      <!-- Gene - Nov, 19, 2026: Restore 4-column desktop leadership grid for a balanced 2x4 layout with 8 members -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AntigravityCard
          v-for="member in about?.leadership ?? []"
          :key="member.name"
          depth="recessed"
          :max-tilt="1.5"
        >
          <div class="flex h-full flex-col justify-between p-6">
            <div>
              <div class="flex items-center gap-3">
                <span
                  class="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xs font-extrabold text-white shadow-sm dark:bg-white dark:text-slate-950"
                >
                  {{
                    member.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')
                  }}
                </span>
                <div>
                  <h3 class="font-display text-base font-bold text-slate-ink dark:text-white">
                    {{ member.name }}
                  </h3>
                  <p class="text-[11px] font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                    {{ member.role }}
                  </p>
                </div>
              </div>
              <p class="mt-3.5 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                {{ member.bio }}
              </p>
            </div>
            <div v-if="member.show" class="mt-4 pt-2">
              <span
                class="inline-flex rounded-full bg-ochre/10 px-3 py-1 text-[11px] font-semibold text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
              >
                Program: {{ member.show }}
              </span>
            </div>
          </div>
        </AntigravityCard>
      </div>
    </section>

    <!-- Weekly Program Grid & Affiliations -->
    <section class="grid gap-8 lg:grid-cols-12" aria-label="Schedule and Affiliations">
      <div
        class="rounded-[24px] bg-white p-6 shadow-float-recessed ring-1 ring-white/90 sm:p-7 lg:col-span-7 dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div class="flex items-center gap-2.5">
          <CalendarClock class="h-5 w-5 text-crimson dark:text-ochre-bright" />
          <h2 class="font-display text-xl font-extrabold text-slate-ink dark:text-white">
            Weekly Program Grid (PHT)
          </h2>
        </div>
        <div class="mt-4 space-y-2.5">
          <div
            v-for="show in shows"
            :key="show.id"
            class="flex flex-col justify-between gap-2 rounded-2xl bg-slate-50/90 px-4 py-3 sm:flex-row sm:items-center dark:bg-white/5"
          >
            <div>
              <RouterLink
                :to="{ path: '/media', query: { show: show.slug } }"
                class="font-display text-base font-bold text-slate-ink transition hover:text-crimson dark:text-white dark:hover:text-ochre-bright"
              >
                {{ show.title }}
              </RouterLink>
              <p class="text-xs text-slate-body dark:text-slate-400">
                {{ show.hosts.join(', ') }}
              </p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-xs font-bold text-slate-ink dark:text-slate-100">
                {{ show.dayLabel }}
              </p>
              <p class="text-[11px] tabular-nums text-slate-meta dark:text-slate-400">
                {{ show.timeLabel }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col justify-between rounded-[24px] bg-white p-6 shadow-float-recessed ring-1 ring-white/90 sm:p-7 lg:col-span-5 dark:bg-obsidian-float dark:ring-white/[0.06]"
      >
        <div>
          <div class="flex items-center gap-2.5">
            <Users class="h-5 w-5 text-civic dark:text-[#2DD4BF]" />
            <h2 class="font-display text-xl font-extrabold text-slate-ink dark:text-white">
              Affiliations &amp; Network Ties
            </h2>
          </div>
          <ul class="mt-4 space-y-2.5">
            <li
              v-for="org in about?.affiliations ?? []"
              :key="org"
              class="flex items-start gap-2.5 rounded-2xl bg-slate-50/90 p-3.5 text-xs font-semibold text-slate-ink dark:bg-white/5 dark:text-slate-100"
            >
              <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-ochre dark:text-ochre-bright" />
              <span>{{ org }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-6 rounded-2xl bg-slate-900 p-5 text-white dark:bg-slate-950">
          <p class="font-display text-base font-bold">Want to collaborate or guest on a show?</p>
          <p class="mt-1 text-xs leading-relaxed text-slate-300">
            Reach our newsroom for citizen reports, Gawad Parangal inquiries, or program guestings.
          </p>
          <RouterLink
            to="/contact"
            class="mt-3.5 inline-flex items-center rounded-full bg-crimson px-4 py-2 text-xs font-bold tracking-wide text-white transition hover:bg-crimson-dark"
          >
            Contact Broadcast Desk &rarr;
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
