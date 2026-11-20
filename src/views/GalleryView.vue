<!-- Gene - Nov, 19, 2026: Empty-state SPIN Gallery page with category filters and dummy placeholder album cards -->
<!-- Gene - Nov, 20, 2026: Integrated 17-slide SPIN Media Annual Awards presentation deck stage, fullscreen lightbox, and live albums -->
<script setup lang="ts">
/*
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowUpRight, Calendar, Camera, Image, MapPin } from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'

type GalleryCategory = 'all' | 'studio' | 'gawad' | 'community' | 'chapters'

interface GalleryAlbumSlot {
  id: string
  slotNumber: string
  title: string
  category: Exclude<GalleryCategory, 'all'>
  categoryLabel: string
  description: string
  locationLabel: string
  dateLabel: string
  photoCount: number
}

const categories: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Albums' },
  { id: 'studio', label: 'Studio & Broadcast' },
  { id: 'gawad', label: 'Gawad Parangal' },
  { id: 'community', label: 'Community Outreach' },
  { id: 'chapters', label: 'Chapter Events' },
]

const albumSlots: GalleryAlbumSlot[] = [
  {
    id: 'album-studio-highlights',
    slotNumber: '01',
    title: 'Broadcast Studio Highlights',
    category: 'studio',
    categoryLabel: 'Studio & Broadcast',
    description:
      'Behind-the-scenes studio snapshots from weekly public affairs broadcasts and live simulcasts.',
    locationLabel: 'SPIN Studio Desk',
    dateLabel: 'TBA · Coming Soon',
    photoCount: 0,
  },
  {
    id: 'album-gawad-parangal',
    slotNumber: '02',
    title: 'Gawad Parangal Ceremonies',
    category: 'gawad',
    categoryLabel: 'Gawad Parangal',
    description:
      'Awarding highlights honoring exemplary civic servants, community builders, and Filipino achievers.',
    locationLabel: 'Metro Manila Venue',
    dateLabel: 'TBA · Coming Soon',
    photoCount: 0,
  },
  {
    id: 'album-national-regional-assemblies',
    slotNumber: '03',
    title: 'National & Regional Assemblies',
    category: 'chapters',
    categoryLabel: 'Chapter Events',
    description:
      'Key moments from SPIN leadership summits, chapter inductions, and network orientations.',
    locationLabel: 'Regional Chapters PH',
    dateLabel: 'TBA · Coming Soon',
    photoCount: 0,
  },
  {
    id: 'album-community-outreach',
    slotNumber: '04',
    title: 'Community & Relief Outreach',
    category: 'community',
    categoryLabel: 'Community Outreach',
    description:
      'Field coverage of grassroots bayanihan drives, family workshops, and citizen partnerships.',
    locationLabel: 'Partner Barangays',
    dateLabel: 'TBA · Coming Soon',
    photoCount: 0,
  },
  {
    id: 'album-usapang-pilipino-desk',
    slotNumber: '05',
    title: 'Usapang Pilipino Live Desk',
    category: 'studio',
    categoryLabel: 'Studio & Broadcast',
    description:
      'Candid studio frames with program anchors, contributors, and guests during Wednesday broadcasts.',
    locationLabel: 'Live Broadcast Set',
    dateLabel: 'TBA · Coming Soon',
    photoCount: 0,
  },
  {
    id: 'album-provincial-municipal-visits',
    slotNumber: '06',
    title: 'Provincial & Municipal Visits',
    category: 'chapters',
    categoryLabel: 'Chapter Events',
    description:
      'On-ground chapter visits, local dialogues, and community coverage across Luzon, Visayas, and Mindanao.',
    locationLabel: 'Nationwide Coverage',
    dateLabel: 'TBA · Coming Soon',
    photoCount: 0,
  },
]

const selectedCategory = ref<GalleryCategory>('all')

const filteredSlots = computed(() => {
  if (selectedCategory.value === 'all') return albumSlots
  return albumSlots.filter((slot) => slot.category === selectedCategory.value)
})
*/
// Gene - Nov, 20, 2026: Live gallery data, interactive PPTX slide deck stage, and fullscreen lightbox
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Image,
  MapPin,
  Maximize2,
  Presentation,
  Sparkles,
  X,
} from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'
import { useSpinData } from '@/composables/useSpinData'
import type { GalleryAlbum, GalleryCategory, GallerySlide } from '@/types/spin'

type DeckScope = 'all' | 'gawad' | 'studio'

const route = useRoute()
const { gallery } = useSpinData()

const categories: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Albums' },
  { id: 'gawad', label: 'Gawad Parangal' },
  { id: 'studio', label: 'Studio & Broadcast' },
  { id: 'community', label: 'Community Outreach' },
  { id: 'chapters', label: 'Chapter Events' },
]

const selectedCategory = ref<GalleryCategory>('all')
const deckScope = ref<DeckScope>('all')
const activeSlideIndex = ref(0)

const lightboxSlides = ref<GallerySlide[]>([])
const lightboxIndex = ref(0)
const lightboxTitle = ref('')
const isLightboxOpen = ref(false)

const albums = computed<GalleryAlbum[]>(() => gallery.value?.albums ?? [])

const allSlidesSorted = computed<GallerySlide[]>(() =>
  albums.value.flatMap((album) => album.slides).sort((a, b) => a.slideNumber - b.slideNumber),
)

const gawadSlides = computed<GallerySlide[]>(() =>
  allSlidesSorted.value.filter((slide) => slide.category === 'gawad'),
)

const studioSlides = computed<GallerySlide[]>(() =>
  allSlidesSorted.value.filter((slide) => slide.category === 'studio'),
)

const deckScopes = computed(() => [
  { id: 'all' as const, label: `Full Deck (${allSlidesSorted.value.length} Slides)` },
  { id: 'gawad' as const, label: `Gawad Parangal 2026 (${gawadSlides.value.length} Slides)` },
  { id: 'studio' as const, label: `Programs & Milestones (${studioSlides.value.length} Slides)` },
])

const activeDeckSlides = computed<GallerySlide[]>(() => {
  if (deckScope.value === 'gawad') return gawadSlides.value
  if (deckScope.value === 'studio') return studioSlides.value
  return allSlidesSorted.value
})

const currentSlide = computed<GallerySlide | null>(
  () => activeDeckSlides.value[activeSlideIndex.value] ?? null,
)

const publishedAlbumsCount = computed(
  () => albums.value.filter((album) => album.slides.length > 0).length,
)

const filteredAlbums = computed(() => {
  if (selectedCategory.value === 'all') return albums.value
  return albums.value.filter((album) => album.category === selectedCategory.value)
})

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

const openLightbox = (slides: GallerySlide[], startIndex: number, title: string) => {
  if (!slides.length) return
  lightboxSlides.value = slides
  lightboxIndex.value = Math.max(0, Math.min(startIndex, slides.length - 1))
  lightboxTitle.value = title
  isLightboxOpen.value = true
}

const openAlbumInLightbox = (album: GalleryAlbum) => {
  if (!album.slides.length) return
  openLightbox(album.slides, 0, album.title)
}

const openCurrentDeckLightbox = () => {
  openLightbox(
    activeDeckSlides.value,
    activeSlideIndex.value,
    gallery.value?.presentationTitle ?? 'SPIN Media Presentation Deck',
  )
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

const activeLightboxSlide = computed<GallerySlide | null>(
  () => lightboxSlides.value[lightboxIndex.value] ?? null,
)

const syncSlideFromQuery = () => {
  const raw = route.query.slide
  if (!raw || !allSlidesSorted.value.length) return
  const num = Number(Array.isArray(raw) ? raw[0] : raw)
  if (!Number.isFinite(num)) return
  deckScope.value = 'all'
  const idx = allSlidesSorted.value.findIndex((s) => s.slideNumber === num)
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!--
  <div class="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-10">
  -->
    <!-- Hero Banner -->
  <!--
    <AntigravityCard depth="hero" :max-tilt="1.0" as="section" aria-label="SPIN Gallery">
      <div class="p-7 sm:p-10 lg:p-12">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl space-y-4">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
            >
              <Camera class="h-3.5 w-3.5" />
              Official Photo Archive &bull; SPIN Media TV
            </span>

            <h1
              class="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-ink sm:text-4xl lg:text-5xl dark:text-white"
            >
              SPIN Gallery
            </h1>

            <p class="text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
              Our visual archive of studio broadcasts, Gawad Parangal ceremonies, community outreach,
              and regional chapter gatherings is currently empty. Official photos and event albums
              will be published into these reserved slots soon.
            </p>
          </div>

          <div class="flex flex-col items-start gap-3 lg:items-end">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-ochre/12 px-3.5 py-1.5 text-xs font-bold text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
            >
              Gallery Empty &middot; Placeholder Slots Ready
            </span>

            <div class="flex flex-wrap items-center gap-2.5">
              <RouterLink
                to="/"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <ArrowLeft class="h-3.5 w-3.5" />
                Back to Front Page
              </RouterLink>

              <RouterLink
                to="/contact"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
              >
                Submit Event Photos
                <ArrowUpRight class="h-3.5 w-3.5" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </AntigravityCard>
  -->

    <!-- Category Filter Bar -->
  <!--
    <section class="space-y-6" aria-label="Gallery Album Placeholders">
      <div
        class="flex flex-col justify-between gap-4 rounded-[22px] bg-white/85 px-5 py-4 backdrop-blur-md shadow-float-recessed ring-1 ring-white/90 sm:flex-row sm:items-center dark:bg-obsidian-float/85 dark:ring-white/[0.06]"
      >
        <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter gallery albums">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            "
            :aria-pressed="selectedCategory === cat.id"
            @click="selectedCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <p class="text-xs font-semibold tabular-nums text-slate-meta dark:text-slate-400">
          {{ filteredSlots.length }} placeholder slots &middot; 0 published photos
        </p>
      </div>
  -->

      <!-- Dummy Album Cards Grid -->
  <!--
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AntigravityCard
          v-for="slot in filteredSlots"
          :key="slot.id"
          depth="recessed"
          :max-tilt="1.4"
          as="article"
        >
          <div class="flex h-full flex-col justify-between">
  -->
            <!-- Reserved Visual Frame -->
  <!--
            <div class="p-3 pb-0">
              <div
                class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100/90 p-3 dark:bg-white/[0.04]"
              >
                <div
                  class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/90 px-4 text-center dark:border-white/15"
                >
                  <span
                    class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-crimson shadow-sm dark:bg-slate-900 dark:text-crimson-bright"
                  >
                    <Image class="h-5 w-5" />
                  </span>
                  <p class="mt-2.5 text-xs font-semibold text-slate-body dark:text-slate-300">
                    Photo slot reserved &middot; {{ slot.photoCount }} photos
                  </p>
                </div>

                <span
                  class="absolute top-5 left-5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-ink uppercase shadow-xs backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {{ slot.categoryLabel }}
                </span>

                <span
                  class="absolute top-5 right-5 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white dark:bg-white/90 dark:text-slate-950"
                >
                  {{ slot.slotNumber }}
                </span>
              </div>
            </div>
  -->

            <!-- Album Metadata -->
  <!--
            <div class="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 class="font-display text-lg font-bold text-slate-ink dark:text-white">
                  {{ slot.title }}
                </h2>
                <p class="mt-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ slot.description }}
                </p>
              </div>

              <div
                class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-white/8"
              >
                <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-meta dark:text-slate-400">
                  <span class="inline-flex items-center gap-1">
                    <MapPin class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                    {{ slot.locationLabel }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <Calendar class="h-3.5 w-3.5 text-ochre dark:text-ochre-bright" />
                    {{ slot.dateLabel }}
                  </span>
                </div>

                <span
                  class="inline-flex rounded-full bg-ochre/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  Placeholder
                </span>
              </div>
            </div>
          </div>
        </AntigravityCard>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 20, 2026: Live SPIN Gallery with Interactive 17-Slide Presentation Deck Stage, Albums, and Fullscreen Lightbox -->
  <div class="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-10">
    <!-- Hero Banner -->
    <AntigravityCard depth="hero" :max-tilt="1.0" as="section" aria-label="SPIN Gallery">
      <div class="p-7 sm:p-10 lg:p-12">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl space-y-4">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
            >
              <Camera class="h-3.5 w-3.5" />
              Official Photo &amp; Presentation Archive &bull; SPIN Media TV
            </span>

            <h1
              class="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-ink sm:text-4xl lg:text-5xl dark:text-white"
            >
              SPIN Gallery
            </h1>

            <p class="text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
              Explore the complete <strong class="font-semibold text-slate-ink dark:text-white">{{ gallery?.presentationTitle }}</strong>
              deck alongside broadcast milestone graphics, selection criteria, awardee categories, and
              upcoming regional chapter albums.
            </p>
          </div>

          <div class="flex flex-col items-start gap-3 lg:items-end">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-ochre/12 px-3.5 py-1.5 text-xs font-bold tabular-nums text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
            >
              <Sparkles class="h-3.5 w-3.5" />
              {{ allSlidesSorted.length }} Published Slides &middot; {{ publishedAlbumsCount }} Featured
              Albums &middot; {{ gallery?.eventDate ?? 'Dec 14, 2026' }} Annual Awards
            </span>

            <div class="flex flex-wrap items-center gap-2.5">
              <RouterLink
                to="/"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <ArrowLeft class="h-3.5 w-3.5" />
                Back to Front Page
              </RouterLink>

              <RouterLink
                to="/contact"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
              >
                Submit Event Photos
                <ArrowUpRight class="h-3.5 w-3.5" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </AntigravityCard>

    <!-- Featured Interactive Presentation Deck Stage -->
    <section
      id="gawad-parangal"
      class="scroll-mt-24 space-y-5"
      aria-label="SPIN Media Annual Awards Interactive Presentation Deck"
    >
      <AntigravityCard depth="elevated" :max-tilt="0.4" as="div">
        <div class="space-y-6 p-5 sm:p-8">
          <!-- Deck Header + Scope Switcher -->
          <div class="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end dark:border-white/8">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-ochre/12 px-3 py-1 text-[10px] font-bold tracking-widest text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  <Presentation class="h-3.5 w-3.5" />
                  Interactive Presentation Deck
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-body dark:bg-white/8 dark:text-slate-300"
                >
                  <Calendar class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                  {{ gallery?.eventDate }}
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-body dark:bg-white/8 dark:text-slate-300"
                >
                  <MapPin class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                  {{ gallery?.eventVenue }}
                </span>
              </div>

              <h2 class="font-display text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white">
                {{ gallery?.presentationTitle }}
              </h2>
              <p class="text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                {{ gallery?.presentationSubtitle }} &mdash;
                <span class="italic text-ochre dark:text-ochre-bright">{{ gallery?.themeVerse }}</span>
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Presentation deck scope">
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
              <div class="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
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
                <h3 class="font-display text-lg font-extrabold text-slate-ink sm:text-xl dark:text-white">
                  {{ currentSlide.title }}
                </h3>
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

              <div class="flex gap-2.5 overflow-x-auto pb-2" role="listbox" aria-label="Presentation slide thumbnails">
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

    <!-- Category Filter Bar & Albums Grid -->
    <section class="space-y-6" aria-label="Gallery Albums">
      <div
        class="flex flex-col justify-between gap-4 rounded-[22px] bg-white/85 px-5 py-4 backdrop-blur-md shadow-float-recessed ring-1 ring-white/90 sm:flex-row sm:items-center dark:bg-obsidian-float/85 dark:ring-white/[0.06]"
      >
        <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter gallery albums">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            :class="
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            "
            :aria-pressed="selectedCategory === cat.id"
            @click="selectedCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>

        <p class="text-xs font-semibold tabular-nums text-slate-meta dark:text-slate-400">
          {{ filteredAlbums.length }} albums &middot; {{ allSlidesSorted.length }} published slides
        </p>
      </div>

      <!-- Album Cards Grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AntigravityCard
          v-for="album in filteredAlbums"
          :key="album.id"
          :depth="album.slides.length ? 'elevated' : 'recessed'"
          :max-tilt="1.4"
          as="article"
        >
          <div class="flex h-full flex-col justify-between">
            <!-- Album Cover Frame -->
            <div class="p-3 pb-0">
              <button
                v-if="album.slides.length && album.coverImageUrl"
                type="button"
                class="group/cover relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-950 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                @click="openAlbumInLightbox(album)"
              >
                <img
                  :src="album.coverImageUrl"
                  :alt="album.title"
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent"
                />

                <span
                  class="absolute top-3 left-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-ink uppercase shadow-xs backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {{ album.categoryLabel }}
                </span>

                <span
                  class="absolute top-3 right-3 rounded-full bg-crimson px-2.5 py-1 text-[10px] font-bold tabular-nums text-white"
                >
                  {{ album.slides.length }} Slides
                </span>

                <span
                  class="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md transition group-hover/cover:bg-crimson"
                >
                  <Maximize2 class="h-3 w-3" />
                  Open Album
                </span>
              </button>

              <div
                v-else
                class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100/90 p-3 dark:bg-white/[0.04]"
              >
                <div
                  class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/90 px-4 text-center dark:border-white/15"
                >
                  <span
                    class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-crimson shadow-sm dark:bg-slate-900 dark:text-crimson-bright"
                  >
                    <Image class="h-5 w-5" />
                  </span>
                  <p class="mt-2.5 text-xs font-semibold text-slate-body dark:text-slate-300">
                    Upcoming album &middot; Open for event photos
                  </p>
                </div>

                <span
                  class="absolute top-5 left-5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-ink uppercase shadow-xs backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-100"
                >
                  {{ album.categoryLabel }}
                </span>

                <span
                  class="absolute top-5 right-5 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white dark:bg-white/90 dark:text-slate-950"
                >
                  {{ album.slotNumber }}
                </span>
              </div>
            </div>

            <!-- Album Metadata -->
            <div class="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 class="font-display text-lg font-bold text-slate-ink dark:text-white">
                  {{ album.title }}
                </h2>
                <p class="mt-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ album.description }}
                </p>
              </div>

              <div
                class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-white/8"
              >
                <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-meta dark:text-slate-400">
                  <span class="inline-flex items-center gap-1">
                    <MapPin class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                    {{ album.locationLabel }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <Calendar class="h-3.5 w-3.5 text-ochre dark:text-ochre-bright" />
                    {{ album.dateLabel }}
                  </span>
                </div>

                <button
                  v-if="album.slides.length"
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1 rounded-full bg-civic/12 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-civic uppercase transition hover:bg-civic hover:text-white dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF] dark:hover:bg-[#2DD4BF] dark:hover:text-slate-950"
                  @click="openAlbumInLightbox(album)"
                >
                  <Award class="h-3 w-3" />
                  Published
                </button>
                <span
                  v-else
                  class="inline-flex rounded-full bg-ochre/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                >
                  Upcoming &middot; Open for Photos
                </span>
              </div>
            </div>
          </div>
        </AntigravityCard>
      </div>
    </section>

    <!-- Fullscreen Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen && activeLightboxSlide"
        class="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 p-3 text-white backdrop-blur-md sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="lightboxTitle"
        @click.self="closeLightbox"
      >
        <!-- Lightbox Top Bar -->
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate text-[11px] font-bold tracking-widest text-amber-300 uppercase">
              {{ lightboxTitle }} &bull; {{ activeLightboxSlide.tag }}
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
              aria-label="Close fullscreen gallery"
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
