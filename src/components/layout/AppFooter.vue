<script setup lang="ts">
import { ExternalLink, Tv } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'

const { site, shows } = useSpinData()
const currentYear = new Date().getFullYear()
</script>

<template>
  <!--
  <footer
    class="border-t border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800/90 dark:bg-[#050A18] dark:text-slate-400"
  >
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
  -->
        <!-- Brand Column -->
  <!--
        <div class="space-y-3 lg:col-span-1">
          <div class="flex items-center gap-2.5">
            <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white"
            >
              <Tv class="h-4 w-4" />
            </span>
            <div>
              <p class="font-display text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                {{ site?.name ?? 'SPIN Media TV Philippines' }}
              </p>
              <p class="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                {{ site?.tagline ?? 'Adding Value, Creating Significance.' }}
              </p>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {{
              site?.description ??
              'Official digital broadcast and social media network of the Secure the Philippines Information Network (SPIN).'
            }}
          </p>
        </div>
  -->
        <!-- Navigation -->
  <!--
        <div>
          <h3 class="font-display text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
            Explore
          </h3>
          <ul class="mt-3 space-y-2 text-sm">
            <li>
              <RouterLink to="/" class="transition hover:text-red-600 dark:hover:text-white">
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/media" class="transition hover:text-red-600 dark:hover:text-white">
                Media Hub (YouTube &amp; Facebook)
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="transition hover:text-red-600 dark:hover:text-white">
                About Us &amp; Network Profile
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="transition hover:text-red-600 dark:hover:text-white">
                Contact Us &amp; News Desk
              </RouterLink>
            </li>
          </ul>
        </div>
  -->
        <!-- Program Lineup -->
  <!--
        <div>
          <h3 class="font-display text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
            Weekly Programs (PHT)
          </h3>
          <ul class="mt-3 space-y-2 text-xs">
            <li
              v-for="show in shows.filter((s) => s.slug !== 'breaking-news')"
              :key="show.id"
              class="flex items-start justify-between gap-2"
            >
              <RouterLink
                :to="{ path: '/media', query: { show: show.slug } }"
                class="font-medium text-slate-700 transition hover:text-red-600 dark:text-slate-300 dark:hover:text-amber-400"
              >
                {{ show.title }}
              </RouterLink>
              <span class="shrink-0 text-slate-500">{{ show.dayLabel.replace('Every ', '') }}</span>
            </li>
          </ul>
        </div>
  -->
        <!-- Official Social Channels -->
  <!--
        <div>
          <h3 class="font-display text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
            Official Channels
          </h3>
          <div class="mt-3 flex flex-wrap gap-2">
            <a
              v-for="channel in site?.socials ?? []"
              :key="channel.id"
              :href="channel.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-red-500/40 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-amber-400/50 dark:hover:text-amber-300"
            >
              <span>{{ channel.label }}</span>
              <ExternalLink class="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-800/80"
      >
        <p>
          &copy; {{ currentYear }} {{ site?.name ?? 'SPIN Media TV Philippines' }} &mdash;
          {{ site?.parentOrg ?? 'Secure the Philippines Information Network' }}.
        </p>
        <p>Powered by static JSON feeds &bull; Ready for database expansion</p>
      </div>
    </div>
  </footer>
  -->

  <!-- Gene - Nov, 19, 2026: Broadsheet network colophon footer in obsidian ink with crimson rule -->
  <footer class="border-t-4 border-crimson bg-[#141413] text-[#C4C1B8] dark:bg-[#0A0A0B]">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3 lg:col-span-1">
          <div class="flex items-center gap-2.5">
            <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-crimson text-white"
            >
              <Tv class="h-4 w-4" />
            </span>
            <div>
              <p class="font-display text-base font-extrabold tracking-tight text-[#F5F4F0]">
                {{ site?.name ?? 'SPIN Media TV Philippines' }}
              </p>
              <p class="font-display text-xs italic text-ochre-bright">
                {{ site?.tagline ?? 'Adding Value, Creating Significance.' }}
              </p>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-[#9A968D]">
            {{
              site?.description ??
              'Official digital broadcast and social media network of the Secure the Philippines Information Network (SPIN).'
            }}
          </p>
        </div>

        <div>
          <h3 class="font-mono text-[11px] font-semibold tracking-widest text-[#F5F4F0] uppercase">
            Sections
          </h3>
          <ul class="mt-3 space-y-2 text-sm">
            <li>
              <RouterLink to="/" class="transition hover:text-white">
                Front Page
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/media" class="transition hover:text-white">
                Media Hub (YouTube &amp; Facebook)
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="transition hover:text-white">
                About Us &amp; Network Profile
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="transition hover:text-white">
                News Desk &amp; Inquiries
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-mono text-[11px] font-semibold tracking-widest text-[#F5F4F0] uppercase">
            Weekly Programs (PHT)
          </h3>
          <ul class="mt-3 space-y-2 text-xs">
            <li
              v-for="show in shows.filter((s) => s.slug !== 'breaking-news')"
              :key="show.id"
              class="flex items-start justify-between gap-2"
            >
              <RouterLink
                :to="{ path: '/media', query: { show: show.slug } }"
                class="font-medium text-[#E5E3DC] transition hover:text-ochre-bright"
              >
                {{ show.title }}
              </RouterLink>
              <span class="shrink-0 font-mono text-[11px] text-[#9A968D]">
                {{ show.dayLabel.replace('Every ', '') }}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-mono text-[11px] font-semibold tracking-widest text-[#F5F4F0] uppercase">
            Network Channels
          </h3>
          <div class="mt-3 flex flex-wrap gap-2">
            <a
              v-for="channel in site?.socials ?? []"
              :key="channel.id"
              :href="channel.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-[#F5F4F0] transition hover:border-crimson-bright hover:bg-crimson/20"
            >
              <span>{{ channel.label }}</span>
              <ExternalLink class="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#9A968D] sm:flex-row sm:items-center"
      >
        <p>
          &copy; {{ currentYear }} {{ site?.name ?? 'SPIN Media TV Philippines' }} &mdash;
          {{ site?.parentOrg ?? 'Secure the Philippines Information Network' }}.
        </p>
        <p class="font-mono text-[11px]">
          Powered by static JSON feeds &bull; Editorial Broadcast Edition
        </p>
      </div>
    </div>
  </footer>
</template>
