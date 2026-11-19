<!-- Gene - Nov, 19, 2026: Empty-state Key Leaders Directory page across National, Regional, Provincial, District, and Municipal levels with dummy placeholder cards -->
<script setup lang="ts">
import { type Component, computed, ref } from 'vue'
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Globe,
  Home,
  Layers,
  Map,
  MapPin,
  ShieldCheck,
  UserRound,
} from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'

type LeaderLevelId = 'national' | 'regional' | 'provincial' | 'district' | 'municipal'
type LevelAccent = 'crimson' | 'ochre' | 'civic'

interface DummyLeaderSlot {
  id: string
  roleSlot: string
  areaLabel: string
  bio: string
}

interface LeaderLevelGroup {
  id: LeaderLevelId
  levelNumber: string
  name: string
  heading: string
  scope: string
  description: string
  accent: LevelAccent
  icon: Component
  slots: DummyLeaderSlot[]
}

const leaderLevels: LeaderLevelGroup[] = [
  {
    id: 'national',
    levelNumber: 'Level 01',
    name: 'National',
    heading: 'National Key Leaders',
    scope: 'Philippines-Wide',
    description:
      'National executive officers, council leads, and network-wide spokespersons.',
    accent: 'crimson',
    icon: Globe,
    slots: [
      {
        id: 'nat-chairperson',
        roleSlot: 'National Chairperson',
        areaLabel: 'Philippines — National Headquarters',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'nat-vice-chair',
        roleSlot: 'National Vice Chairperson',
        areaLabel: 'Philippines — National Headquarters',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'nat-secretary-general',
        roleSlot: 'National Secretary-General',
        areaLabel: 'Philippines — National Headquarters',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
    ],
  },
  {
    id: 'regional',
    levelNumber: 'Level 02',
    name: 'Regional',
    heading: 'Regional Key Leaders',
    scope: 'Regional Chapters',
    description:
      'Regional directors and coordinators overseeing chapter operations across Philippine regions.',
    accent: 'ochre',
    icon: Map,
    slots: [
      {
        id: 'reg-slot-01',
        roleSlot: 'Regional Director (Sample Slot 01)',
        areaLabel: 'National Capital Region (NCR)',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'reg-slot-02',
        roleSlot: 'Regional Director (Sample Slot 02)',
        areaLabel: 'Luzon / Visayas Regional Desk',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'reg-slot-03',
        roleSlot: 'Regional Coordinator (Sample Slot 03)',
        areaLabel: 'Mindanao Regional Desk',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
    ],
  },
  {
    id: 'provincial',
    levelNumber: 'Level 03',
    name: 'Provincial',
    heading: 'Provincial Key Leaders',
    scope: 'Provincial Bureaus',
    description:
      'Provincial chairpersons and chapter bureau leads coordinating civic reporting and outreach.',
    accent: 'civic',
    icon: MapPin,
    slots: [
      {
        id: 'prov-slot-01',
        roleSlot: 'Provincial Chairperson (Sample Slot 01)',
        areaLabel: 'Province Assignment TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'prov-slot-02',
        roleSlot: 'Provincial Vice Chair (Sample Slot 02)',
        areaLabel: 'Province Assignment TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'prov-slot-03',
        roleSlot: 'Provincial Coordinator (Sample Slot 03)',
        areaLabel: 'Province Assignment TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
    ],
  },
  {
    id: 'district',
    levelNumber: 'Level 04',
    name: 'District',
    heading: 'District Key Leaders',
    scope: 'Legislative Districts',
    description:
      'District coordinators connecting congressional and legislative districts with SPIN programs.',
    accent: 'crimson',
    icon: Building2,
    slots: [
      {
        id: 'dist-slot-01',
        roleSlot: 'District Coordinator (Sample Slot 01)',
        areaLabel: '1st District — TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'dist-slot-02',
        roleSlot: 'District Coordinator (Sample Slot 02)',
        areaLabel: '2nd District — TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'dist-slot-03',
        roleSlot: 'District Representative (Sample Slot 03)',
        areaLabel: 'District Assignment TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
    ],
  },
  {
    id: 'municipal',
    levelNumber: 'Level 05',
    name: 'Municipal',
    heading: 'Municipal Key Leaders',
    scope: 'Cities & Municipalities',
    description:
      'City and municipal chapter leaders anchoring grassroots engagement in local communities.',
    accent: 'ochre',
    icon: Home,
    slots: [
      {
        id: 'mun-slot-01',
        roleSlot: 'Municipal Chapter Head (Sample Slot 01)',
        areaLabel: 'City / Municipality TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'mun-slot-02',
        roleSlot: 'City / Municipal Coordinator (Sample Slot 02)',
        areaLabel: 'City / Municipality TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
      {
        id: 'mun-slot-03',
        roleSlot: 'Local Liaison Officer (Sample Slot 03)',
        areaLabel: 'City / Municipality TBA',
        bio: 'Official name, portrait, and chapter profile will be published here once confirmed.',
      },
    ],
  },
]

const selectedLevel = ref<'all' | LeaderLevelId>('all')

const visibleLevels = computed(() => {
  if (selectedLevel.value === 'all') return leaderLevels
  return leaderLevels.filter((level) => level.id === selectedLevel.value)
})

const toggleLevel = (id: LeaderLevelId) => {
  selectedLevel.value = selectedLevel.value === id ? 'all' : id
}

const accentBadgeClass = (accent: LevelAccent) => {
  if (accent === 'ochre') {
    return 'bg-ochre/10 text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright'
  }
  if (accent === 'civic') {
    return 'bg-civic/10 text-civic dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF]'
  }
  return 'bg-crimson/10 text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright'
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-10">
    <!-- Hero Directory Banner -->
    <AntigravityCard depth="hero" :max-tilt="1.0" as="section" aria-label="Key Leaders Directory">
      <div class="p-7 sm:p-10 lg:p-12">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl space-y-4">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/20 dark:text-crimson-bright"
            >
              <ShieldCheck class="h-3.5 w-3.5" />
              Official Network Directory &bull; SPIN Philippines
            </span>

            <h1
              class="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-ink sm:text-4xl lg:text-5xl dark:text-white"
            >
              Key Leaders Directory
            </h1>

            <p class="text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
              Organized across five Philippine leadership tiers —
              <strong class="font-semibold text-slate-ink dark:text-white">
                National, Regional, Provincial, District, and Municipal
              </strong>
              levels. Official rosters are currently empty while chapter confirmations are underway;
              placeholder cards below preview each tier.
            </p>
          </div>

          <div class="flex flex-col items-start gap-3 lg:items-end">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-ochre/12 px-3.5 py-1.5 text-xs font-bold text-ochre dark:bg-ochre-bright/15 dark:text-ochre-bright"
            >
              0 Confirmed Officers &middot; 15 Dummy Slots Ready
            </span>

            <div class="flex flex-wrap items-center gap-2.5">
              <RouterLink
                to="/about"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <ArrowLeft class="h-3.5 w-3.5" />
                Meet Core Newsroom Team
              </RouterLink>

              <RouterLink
                to="/contact"
                class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
              >
                Submit Chapter Roster
                <ArrowUpRight class="h-3.5 w-3.5" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </AntigravityCard>

    <!-- 5-Level Hierarchy Selector Bar -->
    <section class="space-y-4" aria-label="Filter Key Leaders by Level">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <Layers class="h-4 w-4 text-crimson dark:text-crimson-bright" />
          <h2 class="text-xs font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
            Select Directory Tier
          </h2>
        </div>

        <button
          type="button"
          class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          :class="
            selectedLevel === 'all'
              ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
              : 'bg-white/85 text-slate-700 shadow-float-chip ring-1 ring-white/90 hover:bg-slate-100 dark:bg-obsidian-float dark:text-slate-200 dark:ring-white/[0.08] dark:hover:bg-white/10'
          "
          :aria-pressed="selectedLevel === 'all'"
          @click="selectedLevel = 'all'"
        >
          All 5 Levels
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="level in leaderLevels"
          :key="level.id"
          type="button"
          class="group cursor-pointer rounded-[20px] p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
          :class="
            selectedLevel === level.id
              ? 'bg-slate-900 text-white shadow-float-elevated ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white'
              : 'bg-white/88 text-slate-ink shadow-float-recessed ring-1 ring-white/90 hover:-translate-y-0.5 hover:shadow-float-elevated dark:bg-obsidian-float/88 dark:text-white dark:ring-white/[0.06]'
          "
          :aria-pressed="selectedLevel === level.id"
          @click="toggleLevel(level.id)"
        >
          <div class="flex items-center justify-between gap-2">
            <span
              class="text-[10px] font-bold tracking-widest uppercase"
              :class="
                selectedLevel === level.id
                  ? 'text-amber-300 dark:text-crimson'
                  : 'text-crimson dark:text-crimson-bright'
              "
            >
              {{ level.levelNumber }}
            </span>
            <component
              :is="level.icon"
              class="h-4 w-4 shrink-0"
              :class="
                selectedLevel === level.id
                  ? 'text-white/90 dark:text-slate-900'
                  : 'text-slate-meta dark:text-slate-400'
              "
            />
          </div>

          <p class="font-display mt-2 text-base font-extrabold tracking-tight">
            {{ level.name }}
          </p>
          <p
            class="mt-0.5 text-[11px] font-medium"
            :class="
              selectedLevel === level.id
                ? 'text-slate-300 dark:text-slate-600'
                : 'text-slate-body dark:text-slate-400'
            "
          >
            {{ level.scope }}
          </p>
          <p
            class="mt-2.5 text-[10px] font-semibold tabular-nums"
            :class="
              selectedLevel === level.id
                ? 'text-slate-200 dark:text-slate-700'
                : 'text-slate-meta dark:text-slate-400'
            "
          >
            0 confirmed &middot; {{ level.slots.length }} dummy slots
          </p>
        </button>
      </div>
    </section>

    <!-- Directory Level Sections -->
    <div class="space-y-12">
      <section
        v-for="level in visibleLevels"
        :key="level.id"
        class="space-y-5"
        :aria-label="level.heading"
      >
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div class="flex items-start gap-3.5">
            <span
              class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              :class="accentBadgeClass(level.accent)"
            >
              <component :is="level.icon" class="h-5 w-5" />
            </span>
            <div>
              <p
                class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright"
              >
                {{ level.levelNumber }} &bull; {{ level.name }} Level
              </p>
              <h2
                class="font-display mt-0.5 text-2xl font-extrabold tracking-tight text-slate-ink sm:text-3xl dark:text-white"
              >
                {{ level.heading }}
              </h2>
              <p class="mt-1 text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                {{ level.description }}
              </p>
            </div>
          </div>

          <span
            class="inline-flex shrink-0 self-start rounded-full bg-slate-900/6 px-3 py-1 text-[11px] font-bold text-slate-body sm:self-auto dark:bg-white/10 dark:text-slate-300"
          >
            Roster Pending &middot; Dummy Cards
          </span>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AntigravityCard
            v-for="slot in level.slots"
            :key="slot.id"
            depth="recessed"
            :max-tilt="1.4"
            as="article"
          >
            <div class="flex h-full flex-col justify-between p-6">
              <div>
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100/90 text-slate-meta dark:border-white/15 dark:bg-white/5 dark:text-slate-400"
                    >
                      <UserRound class="h-5 w-5" />
                    </span>
                    <div>
                      <h3 class="font-display text-base font-bold text-slate-ink dark:text-white">
                        To Be Announced
                      </h3>
                      <p
                        class="text-[11px] font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright"
                      >
                        {{ slot.roleSlot }}
                      </p>
                    </div>
                  </div>

                  <span
                    class="shrink-0 rounded-full bg-ochre/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                  >
                    Dummy Slot
                  </span>
                </div>

                <div
                  class="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-ink dark:text-slate-200"
                >
                  <MapPin class="h-3.5 w-3.5 shrink-0 text-crimson dark:text-crimson-bright" />
                  <span>{{ slot.areaLabel }}</span>
                </div>

                <p class="mt-2.5 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{ slot.bio }}
                </p>
              </div>

              <div
                class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 dark:border-white/8"
              >
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                  :class="accentBadgeClass(level.accent)"
                >
                  {{ level.name }}
                </span>

                <span class="text-[11px] font-medium text-slate-meta dark:text-slate-400">
                  Awaiting Official Entry
                </span>
              </div>
            </div>
          </AntigravityCard>
        </div>
      </section>
    </div>
  </div>
</template>
