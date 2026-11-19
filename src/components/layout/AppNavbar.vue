<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Moon, Play, Sun, X } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import { useSpinData } from '@/composables/useSpinData'
// Gene - Nov, 19, 2026: Load Manila dateline for broadsheet masthead header
import { usePhtSchedule } from '@/composables/usePhtSchedule'

const route = useRoute()
// const { isDark, toggleTheme } = useTheme()
// Gene - Nov, 19, 2026: Use explicit applyTheme for segmented Light / Dark pill switcher
const { isDark, applyTheme } = useTheme()
// const { site } = useSpinData()
// Gene - Nov, 19, 2026: Include shows to render live Manila date in editorial masthead
const { site, shows } = useSpinData()
// const { manilaDate } = usePhtSchedule(shows)
// Gene - Nov, 19, 2026: Expose live Manila broadcast clock, active show, and dateline for floating nav pill
const { manilaDate, manilaClock, liveShow } = usePhtSchedule(shows)

const mobileOpen = ref(false)
const logoFailed = ref(false)

// const navLinks = [
//   { label: 'Home', to: '/' },
//   { label: 'Media', to: '/media' },
//   { label: 'About Us', to: '/about' },
//   { label: 'Contact Us', to: '/contact' },
// ]
// Gene - Nov, 19, 2026: Newsroom section links and quick program desk shortcuts
const navLinks = [
  { label: 'Front Page', to: '/' },
  { label: 'Media Hub', to: '/media' },
  { label: 'About Us', to: '/about' },
  { label: 'News Desk', to: '/contact' },
]

const deskQuickLinks = [
  { label: 'Lampornas!', slug: 'lampornas' },
  { label: 'Usapang Pilipino', slug: 'usapang-pilipino' },
  { label: 'F.O.C.U.S.', slug: 'focus' },
  { label: 'Daily Dispatches', slug: 'breaking-news' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <!--
  <header
    class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-[#0B132B]/90"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
  -->
      <!-- Brand -->
  <!--
      <RouterLink to="/" class="flex min-w-0 items-center gap-3" @click="mobileOpen = false">
        <div
          class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 ring-2 ring-amber-400/50"
        >
          <img
            v-if="site?.logoUrl && !logoFailed"
            :src="site.logoUrl"
            alt="SPIN Media TV Philippines"
            class="h-full w-full object-cover"
            @error="logoFailed = true"
          />
          <span v-else class="font-display text-sm font-extrabold tracking-tight text-white">
            SPIN
          </span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span
              class="font-display truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg dark:text-white"
            >
              SPIN MEDIA TV
            </span>
            <span
              class="hidden rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase sm:inline-block"
            >
              PH
            </span>
          </div>
          <p class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {{ site?.tagline ?? 'Adding Value, Creating Significance.' }}
          </p>
        </div>
      </RouterLink>
  -->
      <!-- Desktop Navigation -->
  <!--
      <nav class="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3.5 py-2 text-sm font-semibold transition"
          :class="
            isActive(link.to)
              ? 'bg-red-600/10 text-red-600 dark:bg-red-500/15 dark:text-red-400'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
          "
        >
          {{ link.label }}
        </RouterLink>
      </nav>
  -->
      <!-- Actions -->
  <!--
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-amber-300 dark:hover:bg-slate-700"
          :aria-label="isDark ? 'Switch to Light Newsroom theme' : 'Switch to Dark Studio theme'"
          :title="isDark ? 'Light Newsroom Mode' : 'Dark Studio Mode'"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>

        <RouterLink
          to="/media"
          class="hidden items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold tracking-wide text-white uppercase shadow-sm shadow-red-600/25 transition hover:bg-red-500 sm:inline-flex"
        >
          <Play class="h-3.5 w-3.5 fill-current" />
          Watch Hub
        </RouterLink>

        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :aria-expanded="mobileOpen"
          aria-label="Toggle Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
  -->
    <!-- Mobile Navigation Drawer -->
  <!--
    <div
      v-if="mobileOpen"
      class="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-[#0B132B]"
    >
      <nav class="flex flex-col gap-1" aria-label="Mobile Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-2.5 text-sm font-semibold transition"
          :class="
            isActive(link.to)
              ? 'bg-red-600/10 text-red-600 dark:bg-red-500/15 dark:text-red-400'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
  -->

  <!-- Gene - Nov, 19, 2026: Two-tier broadsheet masthead and sticky section navigation strip -->
  <!--
  <div class="bg-white transition-colors dark:bg-obsidian-card">
    <div class="border-b border-rule dark:border-obsidian-rule">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 md:grid md:grid-cols-12 lg:px-8"
      >
        <div class="hidden md:col-span-3 md:block">
          <p
            class="font-mono text-[10px] font-semibold tracking-[0.14em] text-crimson uppercase dark:text-crimson-bright"
          >
            Philippines Edition
          </p>
          <p class="mt-0.5 text-xs font-medium text-ink-muted dark:text-[#C4C1B8]">
            {{ manilaDate }}
          </p>
        </div>

        <div class="min-w-0 md:col-span-6 md:flex md:justify-center">
          <RouterLink
            to="/"
            class="flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
            @click="mobileOpen = false"
          >
            <div
              class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-rule bg-[#141413] dark:border-obsidian-rule"
            >
              <img
                v-if="site?.logoUrl && !logoFailed"
                :src="site.logoUrl"
                alt="SPIN Media TV Philippines"
                class="h-full w-full object-cover"
                @error="logoFailed = true"
              />
              <span v-else class="font-display text-xs font-extrabold tracking-tight text-white">
                SPIN
              </span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="font-display truncate text-xl font-extrabold tracking-tight text-ink sm:text-3xl dark:text-[#F5F4F0]"
                >
                  SPIN MEDIA TV
                </span>
                <span
                  class="hidden rounded-[2px] bg-crimson px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-white uppercase sm:inline-block"
                >
                  PH
                </span>
              </div>
              <p
                class="font-display truncate text-xs italic text-ink-muted dark:text-[#C4C1B8]"
              >
                {{ site?.tagline ?? 'Adding Value, Creating Significance.' }}
              </p>
            </div>
          </RouterLink>
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2 md:col-span-3">
  -->
          <!--
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-rule bg-paper px-2.5 py-2 text-xs font-semibold text-ink transition hover:border-ink/40 hover:bg-paper-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:hover:border-white/30"
            :aria-label="
              isDark ? 'Switch to Light Editorial Paper theme' : 'Switch to Dark Control Room theme'
            "
            :title="isDark ? 'Editorial Paper Mode' : 'Control Room Dark Mode'"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="h-3.5 w-3.5 text-ochre-bright" />
            <Moon v-else class="h-3.5 w-3.5 text-ink" />
            <span class="hidden sm:inline">{{ isDark ? 'Paper' : 'Dark' }}</span>
          </button>
          -->
          <!-- Gene - Nov, 19, 2026: Add dark:hover:bg-[#242428] so Paper toggle button retains dark background on hover -->
          <!--
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-rule bg-paper px-2.5 py-2 text-xs font-semibold text-ink transition hover:border-ink/40 hover:bg-paper-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:hover:border-white/30 dark:hover:bg-[#242428]"
            :aria-label="
              isDark ? 'Switch to Light Editorial Paper theme' : 'Switch to Dark Control Room theme'
            "
            :title="isDark ? 'Editorial Paper Mode' : 'Control Room Dark Mode'"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="h-3.5 w-3.5 text-ochre-bright" />
            <Moon v-else class="h-3.5 w-3.5 text-ink" />
            <span class="hidden sm:inline">{{ isDark ? 'Paper' : 'Dark' }}</span>
          </button>

          <RouterLink
            to="/media"
            class="hidden items-center gap-1.5 rounded-sm bg-crimson px-3.5 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson sm:inline-flex"
          >
            <Play class="h-3.5 w-3.5 fill-current" />
            Watch Hub
          </RouterLink>

          <button
            type="button"
            class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-rule text-ink transition hover:bg-paper-alt md:hidden dark:border-obsidian-rule dark:text-[#F5F4F0] dark:hover:bg-obsidian"
            :aria-expanded="mobileOpen"
            aria-label="Toggle Menu"
            @click="mobileOpen = !mobileOpen"
          >
            <X v-if="mobileOpen" class="h-5 w-5" />
            <Menu v-else class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <header
    class="sticky top-0 z-40 border-b-2 border-ink bg-white/95 backdrop-blur-md transition-colors dark:border-obsidian-rule dark:bg-obsidian-card/95"
  >
    <div
      class="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:flex lg:px-8"
    >
      <nav class="-mb-[2px] flex items-center gap-1" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="border-b-2 px-3.5 py-2.5 text-xs font-bold tracking-wider uppercase transition"
          :class="
            isActive(link.to)
              ? 'border-crimson text-ink dark:border-crimson-bright dark:text-[#F5F4F0]'
              : 'border-transparent text-ink-muted hover:text-ink dark:text-[#C4C1B8] dark:hover:text-[#F5F4F0]'
          "
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-4 text-xs lg:flex">
        <span
          class="font-mono text-[10px] font-semibold tracking-widest text-ink-subtle uppercase dark:text-[#9A968D]"
        >
          Desks:
        </span>
        <RouterLink
          v-for="desk in deskQuickLinks"
          :key="desk.slug"
          :to="{ path: '/media', query: { show: desk.slug } }"
          class="font-medium text-ink-muted transition hover:text-crimson dark:text-[#C4C1B8] dark:hover:text-ochre-bright"
        >
          {{ desk.label }}
        </RouterLink>
      </div>
    </div>

    <div
      v-if="mobileOpen"
      class="border-t border-rule bg-white px-4 py-3 md:hidden dark:border-obsidian-rule dark:bg-obsidian-card"
    >
      <nav class="flex flex-col gap-1" aria-label="Mobile Navigation">
          -->
        <!--
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="border-l-2 px-3 py-2 text-xs font-bold tracking-wider uppercase transition"
          :class="
            isActive(link.to)
              ? 'border-crimson bg-paper text-crimson dark:border-crimson-bright dark:bg-obsidian dark:text-crimson-bright'
              : 'border-transparent text-ink-muted hover:bg-paper-alt hover:text-ink dark:text-[#C4C1B8] dark:hover:bg-obsidian'
          "
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        -->
        <!-- Gene - Nov, 19, 2026: Preserve light text contrast on mobile drawer hover in dark mode -->
        <!--
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="border-l-2 px-3 py-2 text-xs font-bold tracking-wider uppercase transition"
          :class="
            isActive(link.to)
              ? 'border-crimson bg-paper text-crimson dark:border-crimson-bright dark:bg-obsidian dark:text-crimson-bright'
              : 'border-transparent text-ink-muted hover:bg-paper-alt hover:text-ink dark:text-[#C4C1B8] dark:hover:bg-obsidian dark:hover:text-[#F5F4F0]'
          "
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="mt-3 border-t border-rule pt-3 dark:border-obsidian-rule">
        <p
          class="mb-1.5 font-mono text-[10px] font-semibold tracking-widest text-ink-subtle uppercase dark:text-[#9A968D]"
        >
          Program Desks
        </p>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="desk in deskQuickLinks"
            :key="desk.slug"
            :to="{ path: '/media', query: { show: desk.slug } }"
            class="rounded-sm border border-rule bg-paper px-2.5 py-1 text-xs font-medium text-ink-muted dark:border-obsidian-rule dark:bg-obsidian dark:text-[#C4C1B8]"
            @click="mobileOpen = false"
          >
            {{ desk.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
  -->

  <!-- Gene - Nov, 19, 2026: Floating glassmorphic top navigation pill (Z-Plane 4) -->
  <!--
  <header class="sticky top-3 z-50 mx-auto w-full max-w-6xl px-3 sm:top-4 sm:px-6">
    <div
      class="flex items-center justify-between gap-3 rounded-full bg-white/78 px-3 py-2 backdrop-blur-2xl shadow-float-pill ring-1 ring-white/90 transition-colors sm:px-4 dark:bg-slate-900/78 dark:ring-white/12"
    >
  -->
      <!-- Brand Identity -->
  <!--
      <RouterLink
        to="/"
        class="flex min-w-0 items-center gap-2.5 rounded-full pr-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        @click="mobileOpen = false"
      >
        <div
          class="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-sm ring-2 ring-white dark:ring-slate-800"
        >
          <img
            v-if="site?.logoUrl && !logoFailed"
            :src="site.logoUrl"
            alt="SPIN Media TV Philippines"
            class="h-full w-full object-cover"
            @error="logoFailed = true"
          />
          <span v-else class="font-display text-xs font-extrabold tracking-tight text-white">
            SPIN
          </span>
        </div>
        <div class="flex min-w-0 items-center gap-2">
          <span
            class="font-display truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg dark:text-white"
          >
            SPIN Media
          </span>
          <span
            class="hidden rounded-full bg-crimson/12 px-2 py-0.5 text-[10px] font-bold tracking-wider text-crimson uppercase sm:inline-block dark:bg-crimson-bright/20 dark:text-crimson-bright"
          >
            PH
          </span>
        </div>
      </RouterLink>
  -->

      <!-- Desktop Floating Pill Navigation -->
  <!--
      <nav class="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          :class="
            isActive(link.to)
              ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
              : 'text-slate-600 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
          "
        >
          {{ link.label }}
        </RouterLink>
      </nav>
  -->

      <!-- Live PHT Status, Theme Toggle & Watch Hub CTA -->
  <!--
      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span
          class="hidden items-center gap-1.5 rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-600 lg:inline-flex dark:bg-white/8 dark:text-slate-300"
          :title="manilaDate"
        >
          <span
            class="h-1.5 w-1.5 rounded-full bg-crimson dark:bg-crimson-bright"
            :class="liveShow ? 'animate-ping' : 'animate-pulse'"
          />
          <span class="max-w-[130px] truncate">
            {{ liveShow ? `On Air · ${liveShow.title}` : `${manilaClock} PHT` }}
          </span>
        </span>

        <button
          type="button"
          class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900/5 text-slate-700 transition hover:bg-slate-900/10 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:bg-white/10 dark:text-amber-300 dark:hover:bg-white/15 dark:hover:text-amber-200"
          :aria-label="
            isDark ? 'Switch to Light Editorial Canvas' : 'Switch to Dark Obsidian Canvas'
          "
          :title="isDark ? 'Light Editorial Canvas' : 'Dark Obsidian Canvas'"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>

        <RouterLink
          to="/media"
          class="hidden items-center gap-1.5 rounded-full bg-crimson px-3.5 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson sm:inline-flex dark:bg-crimson-bright dark:hover:bg-crimson"
        >
          <Play class="h-3.5 w-3.5 fill-current" />
          Watch Hub
        </RouterLink>

        <button
          type="button"
          class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900/5 text-slate-700 transition hover:bg-slate-900/10 md:hidden dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
          :aria-expanded="mobileOpen"
          aria-label="Toggle Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>
      </div>
    </div>
  -->

    <!-- Floating Glassmorphic Mobile Drawer -->
  <!--
    <div
      v-if="mobileOpen"
      class="mt-2.5 rounded-[24px] bg-white/92 p-4 backdrop-blur-2xl shadow-float-hero ring-1 ring-white/95 md:hidden dark:bg-slate-900/92 dark:ring-white/12"
    >
      <div class="mb-3 flex items-center justify-between px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>{{ manilaDate }}</span>
        <span class="tabular-nums font-semibold text-crimson dark:text-crimson-bright">
          {{ manilaClock }} PHT
        </span>
      </div>

      <nav class="flex flex-col gap-1" aria-label="Mobile Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition"
          :class="
            isActive(link.to)
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
          "
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="mt-4 pt-3">
        <p class="mb-2 px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Program Desks
        </p>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="desk in deskQuickLinks"
            :key="desk.slug"
            :to="{ path: '/media', query: { show: desk.slug } }"
            class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            @click="mobileOpen = false"
          >
            {{ desk.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
  -->

  <!-- Gene - Nov, 19, 2026: Full-width floating glassmorphic navigation pill with prominent Light / Dark mode switcher -->
  <header class="sticky top-3 z-50 w-full px-3 sm:top-4 sm:px-6 lg:px-8 xl:px-10">
    <div
      class="flex items-center justify-between gap-3 rounded-full bg-white/78 px-3 py-2 backdrop-blur-2xl shadow-float-pill ring-1 ring-white/90 transition-colors sm:px-5 dark:bg-slate-900/78 dark:ring-white/12"
    >
      <!-- Brand Identity -->
      <RouterLink
        to="/"
        class="flex min-w-0 items-center gap-2.5 rounded-full pr-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
        @click="mobileOpen = false"
      >
        <div
          class="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-sm ring-2 ring-white dark:ring-slate-800"
        >
          <img
            v-if="site?.logoUrl && !logoFailed"
            :src="site.logoUrl"
            alt="SPIN Media TV Philippines"
            class="h-full w-full object-cover"
            @error="logoFailed = true"
          />
          <span v-else class="font-display text-xs font-extrabold tracking-tight text-white">
            SPIN
          </span>
        </div>
        <div class="flex min-w-0 items-center gap-2">
          <span
            class="font-display truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg dark:text-white"
          >
            SPIN Media
          </span>
          <span
            class="hidden rounded-full bg-crimson/12 px-2 py-0.5 text-[10px] font-bold tracking-wider text-crimson uppercase sm:inline-block dark:bg-crimson-bright/20 dark:text-crimson-bright"
          >
            PH
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Floating Pill Navigation -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          :class="
            isActive(link.to)
              ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
              : 'text-slate-600 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
          "
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Live PHT Status, Light/Dark Segmented Pill & Watch Hub CTA -->
      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span
          class="hidden items-center gap-1.5 rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-600 xl:inline-flex dark:bg-white/8 dark:text-slate-300"
          :title="manilaDate"
        >
          <span
            class="h-1.5 w-1.5 rounded-full bg-crimson dark:bg-crimson-bright"
            :class="liveShow ? 'animate-ping' : 'animate-pulse'"
          />
          <span class="max-w-[140px] truncate">
            {{ liveShow ? `On Air · ${liveShow.title}` : `${manilaClock} PHT` }}
          </span>
        </span>

        <!-- Segmented Light / Dark Mode Switcher -->
        <div
          role="group"
          aria-label="Color Theme"
          class="inline-flex items-center rounded-full bg-slate-900/6 p-1 dark:bg-white/10"
        >
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              !isDark
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            "
            :aria-pressed="!isDark"
            aria-label="Switch to Light Mode"
            @click="applyTheme(false)"
          >
            <Sun class="h-3.5 w-3.5 text-amber-500" />
            <span class="hidden sm:inline">Light</span>
          </button>

          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              isDark
                ? 'bg-slate-900 text-amber-300 shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            "
            :aria-pressed="isDark"
            aria-label="Switch to Dark Mode"
            @click="applyTheme(true)"
          >
            <Moon class="h-3.5 w-3.5" />
            <span class="hidden sm:inline">Dark</span>
          </button>
        </div>

        <RouterLink
          to="/media"
          class="hidden items-center gap-1.5 rounded-full bg-crimson px-3.5 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson sm:inline-flex dark:bg-crimson-bright dark:hover:bg-crimson"
        >
          <Play class="h-3.5 w-3.5 fill-current" />
          Watch Hub
        </RouterLink>

        <button
          type="button"
          class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900/5 text-slate-700 transition hover:bg-slate-900/10 md:hidden dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
          :aria-expanded="mobileOpen"
          aria-label="Toggle Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Floating Glassmorphic Mobile Drawer -->
    <div
      v-if="mobileOpen"
      class="mt-2.5 rounded-[24px] bg-white/92 p-4 backdrop-blur-2xl shadow-float-hero ring-1 ring-white/95 md:hidden dark:bg-slate-900/92 dark:ring-white/12"
    >
      <div class="mb-3 flex items-center justify-between px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>{{ manilaDate }}</span>
        <span class="tabular-nums font-semibold text-crimson dark:text-crimson-bright">
          {{ manilaClock }} PHT
        </span>
      </div>

      <nav class="flex flex-col gap-1" aria-label="Mobile Navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition"
          :class="
            isActive(link.to)
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
          "
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Mobile Drawer Light / Dark Switcher -->
      <div class="mt-3 flex items-center justify-between rounded-2xl bg-slate-100/90 px-3.5 py-2 dark:bg-white/8">
        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Appearance</span>
        <div class="inline-flex items-center rounded-full bg-white/70 p-0.5 dark:bg-slate-900/80">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition"
            :class="!isDark ? 'bg-slate-900 text-white' : 'text-slate-400'"
            @click="applyTheme(false)"
          >
            <Sun class="h-3 w-3" />
            Light
          </button>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition"
            :class="isDark ? 'bg-white text-slate-950' : 'text-slate-500'"
            @click="applyTheme(true)"
          >
            <Moon class="h-3 w-3" />
            Dark
          </button>
        </div>
      </div>

      <div class="mt-4 pt-3">
        <p class="mb-2 px-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Program Desks
        </p>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="desk in deskQuickLinks"
            :key="desk.slug"
            :to="{ path: '/media', query: { show: desk.slug } }"
            class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            @click="mobileOpen = false"
          >
            {{ desk.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
