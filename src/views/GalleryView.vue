<!-- Gene - Nov, 19, 2026: Empty-state SPIN Gallery page with category filters and dummy placeholder album cards -->
<script setup lang="ts">
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
</script>

<template>
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

    <!-- Category Filter Bar -->
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

      <!-- Dummy Album Cards Grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AntigravityCard
          v-for="slot in filteredSlots"
          :key="slot.id"
          depth="recessed"
          :max-tilt="1.4"
          as="article"
        >
          <div class="flex h-full flex-col justify-between">
            <!-- Reserved Visual Frame -->
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

            <!-- Album Metadata -->
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
</template>
