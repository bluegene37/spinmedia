<!-- Gene - Nov, 23, 2026: Unified SPIN Initiatives hub featuring PSEPRI Research Partnership, 22-Slide Investor Presentation Deck, Portfolio Cards, and SPIN Jobs -->
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Handshake,
  Layers,
  Maximize2,
  Presentation,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'
import { useSpinData } from '@/composables/useSpinData'
import type {
  InitiativeCategory,
  InitiativeItem,
  PsepriSlide,
  PsepriSlideSection,
} from '@/types/spin'

type PortfolioFilter = 'all' | 'research' | 'awards' | 'careers' | 'community-partners'
type DeckScope = 'all' | PsepriSlideSection
type BreakdownTab = 'verticals' | 'packages' | 'products'

const route = useRoute()
const { initiatives } = useSpinData()

const portfolioFilters: { id: PortfolioFilter; label: string }[] = [
  { id: 'all', label: 'All Initiatives' },
  { id: 'research', label: 'Research & Ventures' },
  { id: 'awards', label: 'Awards & Events' },
  { id: 'careers', label: 'Careers & Jobs' },
  { id: 'community-partners', label: 'Community & Partners' },
]

const selectedPortfolio = ref<PortfolioFilter>('all')
const activeBreakdownTab = ref<BreakdownTab>('verticals')
const deckScope = ref<DeckScope>('all')
const activeSlideIndex = ref(0)

const isLightboxOpen = ref(false)
const lightboxSlides = ref<PsepriSlide[]>([])
const lightboxIndex = ref(0)

const psepri = computed(() => initiatives.value?.psepri ?? null)
const programs = computed<InitiativeItem[]>(() => initiatives.value?.programs ?? [])
const jobs = computed(() => initiatives.value?.jobs ?? null)

const filteredPrograms = computed<InitiativeItem[]>(() => {
  if (selectedPortfolio.value === 'all') return programs.value
  if (selectedPortfolio.value === 'community-partners') {
    return programs.value.filter(
      (item) => item.category === 'community' || item.category === 'partnerships',
    )
  }
  return programs.value.filter((item) => item.category === selectedPortfolio.value)
})

const categoryIcon = (category: Exclude<InitiativeCategory, 'all'>) => {
  if (category === 'research') return BarChart3
  if (category === 'awards') return Award
  if (category === 'careers') return Briefcase
  if (category === 'community') return Users
  return Handshake
}

const categoryBadgeClass = (category: Exclude<InitiativeCategory, 'all'>) => {
  if (category === 'research') {
    return 'bg-crimson/10 text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright'
  }
  if (category === 'awards') {
    return 'bg-ochre/12 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright'
  }
  if (category === 'careers') {
    return 'bg-civic/12 text-civic dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF]'
  }
  if (category === 'community') {
    return 'bg-slate-900/8 text-slate-ink dark:bg-white/12 dark:text-slate-100'
  }
  return 'bg-ochre/12 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright'
}

const allSlidesSorted = computed<PsepriSlide[]>(() =>
  [...(psepri.value?.slides ?? [])].sort((a, b) => a.slideNumber - b.slideNumber),
)

const sectionCount = (section: PsepriSlideSection) =>
  allSlidesSorted.value.filter((slide) => slide.section === section).length

const deckScopes = computed(() => [
  { id: 'all' as const, label: `Full Deck (${allSlidesSorted.value.length})` },
  {
    id: 'overview' as const,
    label: `Overview & Partnership (${sectionCount('overview')})`,
  },
  { id: 'market' as const, label: `Market & Products (${sectionCount('market')})` },
  {
    id: 'operations' as const,
    label: `Operations & Compliance (${sectionCount('operations')})`,
  },
  {
    id: 'investment' as const,
    label: `Investment & Roadmap (${sectionCount('investment')})`,
  },
])

const activeDeckSlides = computed<PsepriSlide[]>(() => {
  if (deckScope.value === 'all') return allSlidesSorted.value
  return allSlidesSorted.value.filter((slide) => slide.section === deckScope.value)
})

const currentSlide = computed<PsepriSlide | null>(
  () => activeDeckSlides.value[activeSlideIndex.value] ?? null,
)

const activeLightboxSlide = computed<PsepriSlide | null>(
  () => lightboxSlides.value[lightboxIndex.value] ?? null,
)

const formatCounter = (index: number, total: number) =>
  `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

const setDeckScope = (scope: DeckScope) => {
  deckScope.value = scope
  activeSlideIndex.value = 0
}

const prevDeckSlide = () => {
  const len = activeDeckSlides.value.length
  if (!len) return
  activeSlideIndex.value = (activeSlideIndex.value - 1 + len) % len
}

const nextDeckSlide = () => {
  const len = activeDeckSlides.value.length
  if (!len) return
  activeSlideIndex.value = (activeSlideIndex.value + 1) % len
}

const openLightbox = (slides: PsepriSlide[], startIndex: number) => {
  if (!slides.length) return
  lightboxSlides.value = slides
  lightboxIndex.value = Math.max(0, Math.min(startIndex, slides.length - 1))
  isLightboxOpen.value = true
}

const openCurrentDeckLightbox = () => {
  openLightbox(activeDeckSlides.value, activeSlideIndex.value)
}

const openSlideNumberInLightbox = (slideNumber: number) => {
  const slides = allSlidesSorted.value
  const idx = slides.findIndex((slide) => slide.slideNumber === slideNumber)
  openLightbox(slides, idx >= 0 ? idx : 0)
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

const prevLightboxSlide = () => {
  const len = lightboxSlides.value.length
  if (!len) return
  lightboxIndex.value = (lightboxIndex.value - 1 + len) % len
}

const nextLightboxSlide = () => {
  const len = lightboxSlides.value.length
  if (!len) return
  lightboxIndex.value = (lightboxIndex.value + 1) % len
}

const syncSlideFromQuery = () => {
  const raw = route.query.slide
  if (!raw || !allSlidesSorted.value.length) return
  const num = Number(Array.isArray(raw) ? raw[0] : raw)
  if (!Number.isFinite(num)) return
  deckScope.value = 'all'
  const idx = allSlidesSorted.value.findIndex((slide) => slide.slideNumber === num)
  if (idx >= 0) {
    activeSlideIndex.value = idx
  }
}

watch([() => route.query.slide, allSlidesSorted], syncSlideFromQuery, { immediate: true })

const onKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

  if (isLightboxOpen.value) {
    if (event.key === 'Escape') {
      closeLightbox()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prevLightboxSlide()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      nextLightboxSlide()
    }
    return
  }

  if (event.key === 'ArrowLeft') {
    prevDeckSlide()
  } else if (event.key === 'ArrowRight') {
    nextDeckSlide()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  if (route.hash) {
    void nextTick(() => {
      document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth' })
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-10">
    <!-- Hero Portfolio Banner -->
    <AntigravityCard depth="hero" :max-tilt="1.0" as="section" aria-label="SPIN Initiatives & Programs">
      <div class="p-7 sm:p-10 lg:p-12">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl space-y-4">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
            >
              <Compass class="h-3.5 w-3.5" />
              SPIN Network Portfolio &amp; Ventures
            </span>

            <h1
              class="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-ink sm:text-4xl lg:text-5xl dark:text-white"
            >
              SPIN Initiatives &amp; Programs
            </h1>

            <p class="text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
              {{
                initiatives?.subtitle ??
                'Unifying the Secure the Philippines Initiatives Network’s flagship ventures, PSEPRI research partnership, Gawad Parangal recognition, SPIN Jobs, and regional civic programs in one hub.'
              }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 lg:justify-end">
            <a
              href="#psepri"
              class="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark"
            >
              <BarChart3 class="h-3.5 w-3.5" />
              PSEPRI Research Partnership
            </a>

            <a
              href="#spin-jobs"
              class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <Briefcase class="h-3.5 w-3.5" />
              SPIN Jobs &amp; Careers
            </a>

            <RouterLink
              to="/gallery#gawad-parangal"
              class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-4 py-2 text-xs font-bold tracking-wide text-ochre transition hover:bg-ochre hover:text-white dark:bg-ochre-bright/15 dark:text-ochre-bright dark:hover:bg-ochre-bright dark:hover:text-slate-950"
            >
              <Award class="h-3.5 w-3.5" />
              Gawad Parangal 2026
            </RouterLink>

            <RouterLink
              to="/contact"
              class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
            >
              Partner With SPIN
              <ArrowUpRight class="h-3.5 w-3.5" />
            </RouterLink>
          </div>
        </div>
      </div>
    </AntigravityCard>

    <!-- Portfolio Filter Bar & Initiatives Grid -->
    <section class="space-y-6" aria-label="SPIN Initiatives Portfolio">
      <div
        class="flex flex-col justify-between gap-4 rounded-[22px] bg-white/85 px-5 py-4 backdrop-blur-md shadow-float-recessed ring-1 ring-white/90 sm:flex-row sm:items-center dark:bg-obsidian-float/85 dark:ring-white/[0.06]"
      >
        <div
          class="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter initiatives by category"
        >
          <button
            v-for="filter in portfolioFilters"
            :key="filter.id"
            type="button"
            class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              selectedPortfolio === filter.id
                ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            "
            :aria-pressed="selectedPortfolio === filter.id"
            @click="selectedPortfolio = filter.id"
          >
            {{ filter.label }}
          </button>
        </div>

        <p class="text-xs font-semibold tabular-nums text-slate-meta dark:text-slate-400">
          Showing {{ filteredPrograms.length }} of {{ programs.length }} SPIN initiatives
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AntigravityCard
          v-for="item in filteredPrograms"
          :key="item.id"
          :depth="item.highlight ? 'elevated' : 'recessed'"
          :max-tilt="1.4"
          as="article"
        >
          <div class="flex h-full flex-col justify-between p-6">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase"
                  :class="categoryBadgeClass(item.category)"
                >
                  <component :is="categoryIcon(item.category)" class="h-3 w-3" />
                  {{ item.categoryLabel }}
                </span>

                <span
                  class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-body dark:bg-white/10 dark:text-slate-300"
                >
                  {{ item.slotNumber }} &middot; {{ item.statusLabel }}
                </span>
              </div>

              <h2 class="font-display mt-4 text-lg font-extrabold text-slate-ink dark:text-white">
                {{ item.title }}
              </h2>

              <p class="mt-2 text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                {{ item.summary }}
              </p>
            </div>

            <div class="mt-5 border-t border-slate-100 pt-4 dark:border-white/8">
              <RouterLink
                :to="item.to"
                class="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-crimson transition hover:underline dark:text-ochre-bright"
              >
                {{ item.ctaLabel }}
                <ArrowUpRight class="h-3.5 w-3.5" />
              </RouterLink>
            </div>
          </div>
        </AntigravityCard>
      </div>
    </section>

    <!-- Flagship Venture: PSEPRI Research Partnership & 22-Slide Presentation Deck -->
    <section
      v-if="psepri"
      id="psepri"
      class="scroll-mt-24 space-y-6"
      aria-label="PSEPRI Institutional Partnership and Presentation Deck"
    >
      <!-- Two-Column Institutional Partnership Showcase -->
      <AntigravityCard depth="elevated" :max-tilt="1.0" as="div">
        <div class="space-y-8 p-6 sm:p-8 lg:p-10">
          <div class="grid items-center gap-8 lg:grid-cols-12">
            <div class="space-y-4 lg:col-span-7">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
                >
                  <Handshake class="h-3.5 w-3.5" />
                  Flagship Institutional Partnership
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-ochre/12 px-3 py-1 text-[11px] font-bold text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  <Sparkles class="h-3.5 w-3.5" />
                  {{ psepri.tagline }}
                </span>
              </div>

              <h2
                class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                {{ psepri.partnershipTitle }}
              </h2>

              <p class="text-xs font-semibold tracking-wide text-slate-meta uppercase dark:text-slate-400">
                {{ psepri.title }}
              </p>

              <p class="text-sm leading-relaxed text-slate-body dark:text-slate-300">
                {{ psepri.partnershipSummary }}
              </p>

              <div class="flex flex-wrap gap-2 pt-1">
                <span
                  v-for="pillar in psepri.partnershipPillars"
                  :key="pillar"
                  class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-slate-950"
                >
                  <CheckCircle2 class="h-3.5 w-3.5 text-ochre-bright dark:text-crimson" />
                  {{ pillar }}
                </span>
              </div>
            </div>

            <!-- Clickable Slide 21 Hero Preview -->
            <div class="lg:col-span-5">
              <button
                type="button"
                class="group/hero relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-950 text-left shadow-float-recessed ring-1 ring-slate-200/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson dark:ring-white/10"
                @click="openSlideNumberInLightbox(21)"
              >
                <img
                  :src="psepri.heroSlideUrl"
                  :alt="psepri.partnershipTitle"
                  loading="lazy"
                  class="h-full w-full object-contain transition-transform duration-500 group-hover/hero:scale-[1.02]"
                />
                <span
                  class="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
                >
                  Slide 21 &bull; SPIN &times; PSEPRI
                </span>
                <span
                  class="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition group-hover/hero:bg-crimson"
                >
                  <Maximize2 class="h-3.5 w-3.5" />
                  View Fullscreen
                </span>
              </button>
            </div>
          </div>

          <!-- 4 Key Metrics Cards -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="metric in psepri.keyMetrics"
              :key="metric.label"
              class="rounded-2xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10"
            >
              <p class="text-[11px] font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                {{ metric.label }}
              </p>
              <p class="font-display mt-1.5 text-2xl font-extrabold text-slate-ink dark:text-white">
                {{ metric.value }}
              </p>
              <p class="mt-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                {{ metric.detail }}
              </p>
            </div>
          </div>

          <!-- Interactive 3-Tab Executive Breakdown -->
          <div class="space-y-5 border-t border-slate-100 pt-6 dark:border-white/8">
            <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p class="text-[11px] font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                  Executive Business Concept Breakdown
                </p>
                <h3 class="font-display mt-0.5 text-xl font-extrabold text-slate-ink dark:text-white">
                  Verticals, Packages &amp; Signature Indices
                </h3>
              </div>

              <div
                class="flex flex-wrap items-center gap-1.5"
                role="tablist"
                aria-label="PSEPRI business concept breakdown tabs"
              >
                <button
                  type="button"
                  role="tab"
                  :aria-selected="activeBreakdownTab === 'verticals'"
                  class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  :class="
                    activeBreakdownTab === 'verticals'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/15'
                  "
                  @click="activeBreakdownTab = 'verticals'"
                >
                  Six Revenue Verticals
                </button>
                <button
                  type="button"
                  role="tab"
                  :aria-selected="activeBreakdownTab === 'packages'"
                  class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  :class="
                    activeBreakdownTab === 'packages'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/15'
                  "
                  @click="activeBreakdownTab = 'packages'"
                >
                  Survey Packages &amp; Pricing
                </button>
                <button
                  type="button"
                  role="tab"
                  :aria-selected="activeBreakdownTab === 'products'"
                  class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  :class="
                    activeBreakdownTab === 'products'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/15'
                  "
                  @click="activeBreakdownTab = 'products'"
                >
                  Signature Research Products
                </button>
              </div>
            </div>

            <!-- Tab 1: Six Revenue Verticals -->
            <div
              v-if="activeBreakdownTab === 'verticals'"
              class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div
                v-for="vertical in psepri.revenueVerticals"
                :key="vertical.number"
                class="rounded-2xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <span
                  class="inline-flex rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright"
                >
                  Vertical {{ vertical.number }}
                </span>
                <h4 class="font-display mt-2.5 text-base font-extrabold text-slate-ink dark:text-white">
                  {{ vertical.title }}
                </h4>
                <p class="mt-1.5 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ vertical.description }}
                </p>
              </div>
            </div>

            <!-- Tab 2: Survey Packages & Pricing -->
            <div
              v-else-if="activeBreakdownTab === 'packages'"
              class="grid gap-5 md:grid-cols-3"
            >
              <div
                v-for="pkg in psepri.surveyPackages"
                :key="pkg.name"
                class="flex flex-col justify-between rounded-2xl bg-slate-50/90 p-6 ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <div>
                  <span
                    class="inline-flex rounded-full bg-ochre/12 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                  >
                    {{ pkg.sampleSize }}
                  </span>
                  <h4 class="font-display mt-3 text-lg font-extrabold text-slate-ink dark:text-white">
                    {{ pkg.name }}
                  </h4>
                  <p class="font-display mt-1 text-xl font-extrabold text-crimson dark:text-crimson-bright">
                    {{ pkg.priceRange }}
                  </p>
                  <ul class="mt-4 space-y-2 text-xs text-slate-body dark:text-slate-300">
                    <li
                      v-for="highlight in pkg.highlights"
                      :key="highlight"
                      class="flex items-start gap-2"
                    >
                      <CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-civic dark:text-[#2DD4BF]" />
                      <span>{{ highlight }}</span>
                    </li>
                  </ul>
                </div>

                <div class="mt-5 border-t border-slate-200/70 pt-3.5 dark:border-white/10">
                  <RouterLink
                    to="/contact"
                    class="inline-flex items-center gap-1 text-xs font-bold text-crimson transition hover:underline dark:text-ochre-bright"
                  >
                    Inquire about {{ pkg.name }}
                    <ArrowUpRight class="h-3.5 w-3.5" />
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Tab 3: Signature Research Products -->
            <div v-else class="grid gap-5 lg:grid-cols-12">
              <div
                class="rounded-2xl bg-slate-50/90 p-6 ring-1 ring-slate-200/70 lg:col-span-7 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <span
                  class="inline-flex rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
                >
                  {{ psepri.signatureProducts.cadence }}
                </span>
                <h4 class="font-display mt-2.5 text-xl font-extrabold text-slate-ink dark:text-white">
                  {{ psepri.signatureProducts.flagshipName }}
                </h4>
                <p class="mt-2 text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                  {{ psepri.signatureProducts.flagshipDescription }}
                </p>

                <div class="mt-5 grid gap-3 sm:grid-cols-2">
                  <div
                    v-for="domain in psepri.signatureProducts.domains"
                    :key="domain.name"
                    class="rounded-xl bg-white p-3.5 ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-white/10"
                  >
                    <p class="font-display text-sm font-extrabold text-slate-ink dark:text-white">
                      {{ domain.name }}
                    </p>
                    <p class="mt-1 text-xs text-slate-body dark:text-slate-300">
                      {{ domain.focus }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="rounded-2xl bg-slate-50/90 p-6 ring-1 ring-slate-200/70 lg:col-span-5 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <p class="text-[11px] font-bold tracking-wider text-ochre uppercase dark:text-ochre-bright">
                  Additional Recurring Publications
                </p>
                <h4 class="font-display mt-1 text-lg font-extrabold text-slate-ink dark:text-white">
                  Indices &amp; Annual Reports
                </h4>
                <ul class="mt-4 space-y-2.5 text-xs font-semibold text-slate-ink dark:text-slate-200">
                  <li
                    v-for="pub in psepri.signatureProducts.additionalPublications"
                    :key="pub"
                    class="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-white/10"
                  >
                    <Layers class="h-3.5 w-3.5 shrink-0 text-crimson dark:text-crimson-bright" />
                    <span>{{ pub }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AntigravityCard>

      <!-- Interactive 22-Slide PSEPRI Presentation Deck Stage -->
      <AntigravityCard depth="elevated" :max-tilt="0.7" as="div">
        <div class="space-y-6 p-5 sm:p-8">
          <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-3 py-0.5 text-[10px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  <Presentation class="h-3.5 w-3.5" />
                  Business Concept Presentation Deck
                </span>
                <span class="text-xs font-semibold text-slate-meta dark:text-slate-400">
                  {{ allSlidesSorted.length }} Official Slides &bull; Click Fullscreen or Use Arrow Keys
                </span>
              </div>
              <h3
                class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                {{ psepri.deckTitle }}
              </h3>
            </div>

            <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="PSEPRI presentation deck scope">
              <button
                v-for="scope in deckScopes"
                :key="scope.id"
                type="button"
                class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :class="
                  deckScope === scope.id
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/15'
                "
                :aria-pressed="deckScope === scope.id"
                @click="setDeckScope(scope.id)"
              >
                {{ scope.label }}
              </button>
            </div>
          </div>

          <!-- High-Contrast 16:10 Presentation Stage -->
          <div v-if="currentSlide" class="space-y-4">
            <div
              class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-900/15 dark:ring-white/10"
            >
              <img
                :src="currentSlide.imageUrl"
                :alt="`Slide ${currentSlide.slideNumber}: ${currentSlide.title}`"
                class="h-full w-full object-contain"
              />

              <!-- Slide Counter & Tag Top Bar -->
              <div
                class="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4"
              >
                <span
                  class="rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold tabular-nums text-white backdrop-blur-md ring-1 ring-white/15"
                >
                  {{ formatCounter(activeSlideIndex, activeDeckSlides.length) }} &middot; Slide
                  {{ currentSlide.slideNumber }}
                </span>

                <div class="pointer-events-auto flex items-center gap-2">
                  <span
                    class="hidden rounded-full bg-ochre/90 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase sm:inline-flex"
                  >
                    {{ currentSlide.tag }}
                  </span>
                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-crimson"
                    @click="openCurrentDeckLightbox"
                  >
                    <Maximize2 class="h-3.5 w-3.5" />
                    Fullscreen View
                  </button>
                </div>
              </div>

              <!-- Prev / Next Stage Arrows -->
              <button
                type="button"
                aria-label="Previous slide"
                class="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-crimson sm:left-4 sm:h-11 sm:w-11"
                @click="prevDeckSlide"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Next slide"
                class="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-crimson sm:right-4 sm:h-11 sm:w-11"
                @click="nextDeckSlide"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
            </div>

            <!-- Active Slide Metadata Bar -->
            <div
              class="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50/90 px-5 py-4 sm:flex-row sm:items-center dark:bg-white/[0.04]"
            >
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="inline-flex rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
                  >
                    {{ currentSlide.tag }}
                  </span>
                  <span class="text-[11px] font-semibold tabular-nums text-slate-meta dark:text-slate-400">
                    Presentation Slide {{ String(currentSlide.slideNumber).padStart(2, '0') }}
                  </span>
                </div>
                <h4 class="font-display text-lg font-extrabold text-slate-ink sm:text-xl dark:text-white">
                  {{ currentSlide.title }}
                </h4>
                <p class="text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                  {{ currentSlide.caption }}
                </p>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-slate-ink shadow-xs ring-1 ring-slate-200 transition hover:bg-slate-100 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15"
                  @click="prevDeckSlide"
                >
                  <ChevronLeft class="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
                  @click="nextDeckSlide"
                >
                  Next
                  <ChevronRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <!-- Clickable Horizontal Thumbnail Filmstrip -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[11px] font-semibold text-slate-meta dark:text-slate-400">
                <span>Slide Filmstrip (Use &larr; / &rarr; arrow keys or click any frame)</span>
                <span class="tabular-nums">{{ activeDeckSlides.length }} slides</span>
              </div>

              <div class="flex gap-2.5 overflow-x-auto pb-2" role="listbox" aria-label="PSEPRI slide thumbnails">
                <button
                  v-for="(slide, idx) in activeDeckSlides"
                  :key="slide.id"
                  type="button"
                  role="option"
                  :aria-selected="idx === activeSlideIndex"
                  class="group relative w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-slate-950 text-left transition sm:w-36"
                  :class="
                    idx === activeSlideIndex
                      ? 'ring-2 ring-crimson ring-offset-2 ring-offset-white dark:ring-crimson-bright dark:ring-offset-obsidian-float'
                      : 'opacity-70 ring-1 ring-slate-200 hover:opacity-100 dark:ring-white/10'
                  "
                  @click="activeSlideIndex = idx"
                >
                  <div class="aspect-[16/10] w-full overflow-hidden">
                    <img
                      :src="slide.imageUrl"
                      :alt="slide.title"
                      loading="lazy"
                      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span
                    class="absolute bottom-1.5 left-1.5 rounded-md bg-slate-950/85 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white"
                  >
                    #{{ String(slide.slideNumber).padStart(2, '0') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AntigravityCard>
    </section>

    <!-- SPIN Jobs & Career Opportunities Section -->
    <section
      id="spin-jobs"
      class="scroll-mt-24"
      aria-label="SPIN Jobs and Career Opportunities"
    >
      <AntigravityCard depth="elevated" :max-tilt="1.0" as="div">
        <div class="space-y-8 p-7 sm:p-10 lg:p-12">
          <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div class="max-w-3xl space-y-3">
              <div class="flex flex-wrap items-center gap-2.5">
                <span
                  class="flex h-11 w-11 items-center justify-center rounded-2xl bg-civic/12 text-civic dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF]"
                >
                  <Briefcase class="h-5 w-5" />
                </span>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-3 py-1 text-[11px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  {{ jobs?.statusLabel ?? 'No Active Postings · Talent Pool Open' }}
                </span>
              </div>

              <h2
                class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                {{ jobs?.heading ?? 'SPIN Jobs & Career Opportunities' }}
              </h2>

              <p class="text-sm leading-relaxed text-slate-body dark:text-slate-300">
                {{
                  jobs?.summary ??
                  'There are no open positions posted at the moment. Check back soon for newsroom, broadcast production, regional chapter, and PSEPRI field research opportunities.'
                }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <RouterLink
                to="/contact"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
              >
                Submit Career Interest
                <ArrowUpRight class="h-3.5 w-3.5" />
              </RouterLink>

              <RouterLink
                to="/leaders"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <Building2 class="h-3.5 w-3.5" />
                View Regional Chapters
              </RouterLink>
            </div>
          </div>

          <!-- Active Openings Grid (renders when openings are published) -->
          <div v-if="jobs && jobs.openings.length > 0" class="grid gap-5 md:grid-cols-3">
            <div
              v-for="opening in jobs.openings"
              :key="opening.id"
              class="flex flex-col justify-between rounded-2xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10"
            >
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span
                    class="rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
                  >
                    {{ opening.department }}
                  </span>
                  <span class="text-[11px] font-semibold text-slate-meta dark:text-slate-400">
                    {{ opening.employmentType }}
                  </span>
                </div>
                <h3 class="font-display mt-3 text-lg font-extrabold text-slate-ink dark:text-white">
                  {{ opening.title }}
                </h3>
                <p class="mt-1 text-xs font-semibold text-slate-meta dark:text-slate-400">
                  {{ opening.location }}
                </p>
                <p class="mt-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ opening.summary }}
                </p>
              </div>
              <div class="mt-4 border-t border-slate-200/70 pt-3 dark:border-white/10">
                <a
                  v-if="opening.applyUrl"
                  :href="opening.applyUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-bold text-crimson hover:underline dark:text-ochre-bright"
                >
                  Apply Now
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </a>
                <RouterLink
                  v-else
                  to="/contact"
                  class="inline-flex items-center gap-1 text-xs font-bold text-crimson hover:underline dark:text-ochre-bright"
                >
                  Apply via News Desk
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Upcoming Career Tracks -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-4 w-4 text-crimson dark:text-crimson-bright" />
              <h3 class="text-xs font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
                Upcoming Career Tracks Across SPIN &amp; PSEPRI
              </h3>
            </div>

            <div class="grid gap-5 md:grid-cols-3">
              <div
                v-for="track in jobs?.futureTracks ?? []"
                :key="track.title"
                class="rounded-2xl bg-slate-50/90 p-5 ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <span
                  class="inline-flex rounded-full bg-slate-900/8 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-ink uppercase dark:bg-white/12 dark:text-slate-100"
                >
                  {{ track.scope }}
                </span>
                <h4 class="font-display mt-3 text-base font-extrabold text-slate-ink dark:text-white">
                  {{ track.title }}
                </h4>
                <p class="mt-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ track.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AntigravityCard>
    </section>

    <!-- Fullscreen PSEPRI Presentation Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen && activeLightboxSlide"
        class="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 p-3 text-white backdrop-blur-md sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="psepri?.deckTitle ?? 'PSEPRI Investor Presentation'"
        @click.self="closeLightbox"
      >
        <!-- Lightbox Top Bar -->
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate text-[11px] font-bold tracking-widest text-amber-300 uppercase">
              {{ psepri?.shortName ?? 'PSEPRI' }} Investor Presentation 2026 &bull;
              {{ activeLightboxSlide.tag }}
            </p>
            <h2 class="font-display truncate text-base font-bold text-white sm:text-xl">
              {{ activeLightboxSlide.title }}
            </h2>
          </div>

          <div class="flex shrink-0 items-center gap-2.5">
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tabular-nums">
              {{ formatCounter(lightboxIndex, lightboxSlides.length) }}
            </span>
            <button
              type="button"
              aria-label="Close fullscreen presentation"
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-crimson"
              @click="closeLightbox"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Lightbox Main Image Stage -->
        <div class="relative mx-auto my-3 flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center">
          <img
            :src="activeLightboxSlide.imageUrl"
            :alt="activeLightboxSlide.title"
            class="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />

          <button
            type="button"
            aria-label="Previous lightbox slide"
            class="absolute top-1/2 left-1 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-900/80 text-white ring-1 ring-white/20 transition hover:bg-crimson sm:left-3"
            @click="prevLightboxSlide"
          >
            <ChevronLeft class="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Next lightbox slide"
            class="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-900/80 text-white ring-1 ring-white/20 transition hover:bg-crimson sm:right-3"
            @click="nextLightboxSlide"
          >
            <ChevronRight class="h-6 w-6" />
          </button>
        </div>

        <!-- Lightbox Caption & Thumbnail Jump Bar -->
        <div class="mx-auto w-full max-w-6xl space-y-3">
          <p class="text-center text-xs leading-relaxed text-slate-300 sm:text-sm">
            {{ activeLightboxSlide.caption }}
          </p>

          <div class="flex justify-center gap-2 overflow-x-auto pb-1">
            <button
              v-for="(slide, idx) in lightboxSlides"
              :key="slide.id"
              type="button"
              class="w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-900 transition sm:w-24"
              :class="
                idx === lightboxIndex
                  ? 'ring-2 ring-amber-400 opacity-100'
                  : 'opacity-50 hover:opacity-90'
              "
              @click="lightboxIndex = idx"
            >
              <div class="aspect-[16/10] w-full">
                <img :src="slide.imageUrl" :alt="slide.title" class="h-full w-full object-cover" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
