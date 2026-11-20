<!-- Gene - Nov, 19, 2026: Empty-state Key Leaders Directory page across National, Regional, Provincial, District, and Municipal levels with dummy placeholder cards -->
<!-- Gene - Nov, 20, 2026: Populated Key Leaders Directory with real National & Regional leadership portraits, Mindanao Command showcase, island/search filters, and profile modal -->
<script setup lang="ts">
/*
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
*/
// Gene - Nov, 20, 2026: Live data-driven Key Leaders Directory backed by /data/leaders.json via useSpinData
import { type Component, computed, onMounted, onUnmounted, ref } from 'vue'
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Building2,
  Globe,
  Home,
  Layers,
  Map,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-vue-next'
import AntigravityCard from '@/components/ui/AntigravityCard.vue'
import { useSpinData } from '@/composables/useSpinData'
import type {
  DirectoryLeader,
  DirectoryLevel,
  LeaderLevelId,
  LeaderRoleTier,
  LevelAccent,
  RegionalIslandGroup,
} from '@/types/spin'

const { leaders: leaderLevelsData } = useSpinData()

const levelIcons: Record<LeaderLevelId, Component> = {
  national: Globe,
  regional: Map,
  provincial: MapPin,
  district: Building2,
  municipal: Home,
}

const selectedLevel = ref<'all' | LeaderLevelId>('all')
const selectedIsland = ref<'all' | 'luzon' | 'visayas' | 'mindanao'>('all')
const searchQuery = ref('')
const activeLeader = ref<{ leader: DirectoryLeader; level: DirectoryLevel } | null>(null)

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

const matchesSearch = (leader: DirectoryLeader) => {
  const q = normalizedQuery.value
  if (!q) return true
  return (
    leader.name.toLowerCase().includes(q) ||
    leader.role.toLowerCase().includes(q) ||
    leader.areaLabel.toLowerCase().includes(q) ||
    (leader.regionCode?.toLowerCase().includes(q) ?? false)
  )
}

const confirmedCount = computed(() =>
  leaderLevelsData.value.reduce(
    (sum, level) => sum + level.leaders.filter((l) => l.status === 'confirmed').length,
    0,
  ),
)

const nationalCount = computed(() => {
  const nat = leaderLevelsData.value.find((l) => l.id === 'national')
  return nat ? nat.leaders.filter((l) => l.status === 'confirmed').length : 0
})

const regionalRegionsCount = computed(() => {
  const reg = leaderLevelsData.value.find((l) => l.id === 'regional')
  if (!reg) return 0
  const codes = new Set(
    reg.leaders
      .filter((l) => l.status === 'confirmed' && l.islandGroup !== 'mindanao-command' && l.regionCode)
      .map((l) => l.regionCode),
  )
  return codes.size
})

const levelConfirmedCount = (level: DirectoryLevel) =>
  level.leaders.filter((l) => l.status === 'confirmed').length

const levelFilteredLeaders = (level: DirectoryLevel) => {
  let list = level.leaders.filter(matchesSearch)
  if (level.id === 'regional' && selectedIsland.value !== 'all') {
    list = list.filter((l) => {
      if (selectedIsland.value === 'mindanao') {
        return l.islandGroup === 'mindanao' || l.islandGroup === 'mindanao-command'
      }
      return l.islandGroup === selectedIsland.value
    })
  }
  return list
}

const visibleLevels = computed(() => {
  const base =
    selectedLevel.value === 'all'
      ? leaderLevelsData.value
      : leaderLevelsData.value.filter((level) => level.id === selectedLevel.value)

  if (!normalizedQuery.value) return base
  return base.filter((level) => levelFilteredLeaders(level).length > 0)
})

const mindanaoCommandLeaders = (level: DirectoryLevel) =>
  levelFilteredLeaders(level).filter((l) => l.islandGroup === 'mindanao-command')

const regionalChapterLeaders = (level: DirectoryLevel) =>
  levelFilteredLeaders(level).filter((l) => l.islandGroup !== 'mindanao-command')

const toggleLevel = (id: LeaderLevelId) => {
  selectedLevel.value = selectedLevel.value === id ? 'all' : id
}

const islandTabs: { id: 'all' | 'luzon' | 'visayas' | 'mindanao'; label: string }[] = [
  { id: 'all', label: 'All Regions' },
  { id: 'luzon', label: 'Luzon & NCR' },
  { id: 'visayas', label: 'Visayas' },
  { id: 'mindanao', label: 'Mindanao' },
]

const getInitials = (name: string) => {
  const cleaned = name
    .replace(/\b(Sr\.|Jr\.)\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (cleaned.length === 0) return 'SP'
  if (cleaned.length === 1) return cleaned[0].slice(0, 2).toUpperCase()
  return `${cleaned[0][0]}${cleaned[cleaned.length - 1][0]}`.toUpperCase()
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

const roleTierBadgeClass = (tier: LeaderRoleTier) => {
  if (tier === 'overall') {
    return 'bg-crimson/12 text-crimson ring-1 ring-crimson/20 dark:bg-crimson-bright/20 dark:text-crimson-bright dark:ring-crimson-bright/30'
  }
  if (tier === 'spin-media') {
    return 'bg-ochre/12 text-ochre ring-1 ring-ochre/20 dark:bg-ochre-bright/15 dark:text-ochre-bright dark:ring-ochre-bright/30'
  }
  if (tier === 'deputy') {
    return 'bg-civic/12 text-civic ring-1 ring-civic/20 dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF] dark:ring-[#2DD4BF]/30'
  }
  return 'bg-slate-900/8 text-slate-800 ring-1 ring-slate-900/10 dark:bg-white/12 dark:text-slate-100 dark:ring-white/15'
}

const islandLabel = (group?: RegionalIslandGroup) => {
  if (group === 'mindanao-command') return 'Mindanao Overall Command'
  if (group === 'luzon') return 'Luzon & NCR'
  if (group === 'visayas') return 'Visayas'
  if (group === 'mindanao') return 'Mindanao'
  return 'Philippines'
}

const openLeaderModal = (leader: DirectoryLeader, level: DirectoryLevel) => {
  if (leader.status !== 'confirmed') return
  activeLeader.value = { leader, level }
}

const closeLeaderModal = () => {
  activeLeader.value = null
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && activeLeader.value) {
    closeLeaderModal()
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
    <!-- Hero Directory Banner -->
  <!--
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
  -->

    <!-- 5-Level Hierarchy Selector Bar -->
  <!--
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
  -->

    <!-- Directory Level Sections -->
  <!--
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
  -->

  <!-- Gene - Nov, 20, 2026: Live National & Regional Key Leaders Directory with portrait cards, Mindanao Command highlight, and profile modal -->
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
              Official SPIN Philippines executive and field leadership across five organizational tiers —
              <strong class="font-semibold text-slate-ink dark:text-white">
                National, Regional, Provincial, District, and Municipal
              </strong>
              levels. National executive officers and Regional Directors are now live; Provincial, District,
              and Municipal bureaus are open for roster confirmation.
            </p>
          </div>

          <div class="flex flex-col items-start gap-3 lg:items-end">
            <span
              class="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1.5 text-xs font-bold tabular-nums text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright"
            >
              {{ confirmedCount }} Confirmed Posts &middot; {{ nationalCount }} National &middot;
              {{ regionalRegionsCount }} Regions
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

    <!-- 5-Level Hierarchy Selector Bar + Search -->
    <section class="space-y-4" aria-label="Filter Key Leaders by Level">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div class="flex items-center gap-2">
          <Layers class="h-4 w-4 text-crimson dark:text-crimson-bright" />
          <h2 class="text-xs font-bold tracking-[0.14em] text-slate-meta uppercase dark:text-slate-400">
            Select Directory Tier
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <div class="relative w-full sm:w-72">
            <Search
              class="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-meta dark:text-slate-400"
            />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search name, role, or region..."
              aria-label="Search key leaders by name, role, or region"
              class="w-full rounded-full bg-white/90 py-1.5 pr-8 pl-9 text-xs font-medium text-slate-ink shadow-float-chip ring-1 ring-slate-200/80 placeholder:text-slate-meta focus:ring-2 focus:ring-crimson focus:outline-none dark:bg-obsidian-float dark:text-white dark:ring-white/10 dark:placeholder:text-slate-400"
            />
            <button
              v-if="searchQuery"
              type="button"
              aria-label="Clear search"
              class="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-full p-0.5 text-slate-meta hover:text-slate-ink dark:text-slate-400 dark:hover:text-white"
              @click="searchQuery = ''"
            >
              <X class="h-3.5 w-3.5" />
            </button>
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
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="level in leaderLevelsData"
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
              :is="levelIcons[level.id]"
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
            <template v-if="levelConfirmedCount(level) > 0">
              {{ levelConfirmedCount(level) }} confirmed
              {{ level.id === 'national' ? 'officers' : 'posts' }}
            </template>
            <template v-else>
              Roster pending &middot; {{ level.leaders.length }} slots
            </template>
          </p>
        </button>
      </div>
    </section>

    <!-- Empty search state -->
    <AntigravityCard
      v-if="visibleLevels.length === 0 && normalizedQuery"
      depth="recessed"
      :max-tilt="0.5"
      as="section"
    >
      <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <Search class="h-7 w-7 text-slate-meta dark:text-slate-400" />
        <h2 class="font-display text-xl font-bold text-slate-ink dark:text-white">
          No leaders match “{{ searchQuery }}”
        </h2>
        <p class="text-xs text-slate-body dark:text-slate-300">
          Try searching by surname, region code (e.g. CAR, NCR, Region XIII, BARMM), or clear the filter.
        </p>
        <button
          type="button"
          class="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-crimson dark:bg-white dark:text-slate-950"
          @click="searchQuery = ''; selectedIsland = 'all'"
        >
          Reset Filters
        </button>
      </div>
    </AntigravityCard>

    <!-- Directory Level Sections -->
    <div v-else class="space-y-14">
      <section
        v-for="level in visibleLevels"
        :key="level.id"
        class="space-y-6"
        :aria-label="level.heading"
      >
        <!-- Level Header -->
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div class="flex items-start gap-3.5">
            <span
              class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              :class="accentBadgeClass(level.accent)"
            >
              <component :is="levelIcons[level.id]" class="h-5 w-5" />
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
              <p class="mt-1 max-w-3xl text-xs leading-relaxed text-slate-body sm:text-sm dark:text-slate-300">
                {{ level.description }}
              </p>
            </div>
          </div>

          <span
            v-if="levelConfirmedCount(level) > 0"
            class="inline-flex shrink-0 self-start rounded-full bg-crimson/10 px-3.5 py-1 text-[11px] font-bold tabular-nums text-crimson sm:self-auto dark:bg-crimson-bright/20 dark:text-crimson-bright"
          >
            {{ levelFilteredLeaders(level).length }}
            {{ level.id === 'national' ? 'Executive Officers' : 'Active Posts' }}
          </span>
          <span
            v-else
            class="inline-flex shrink-0 self-start rounded-full bg-slate-900/6 px-3 py-1 text-[11px] font-bold text-slate-body sm:self-auto dark:bg-white/10 dark:text-slate-300"
          >
            Roster Pending &middot; Open Slots
          </span>
        </div>

        <!-- LEVEL 01: National Executive Officers (4-col executive portrait grid) -->
        <div v-if="level.id === 'national'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AntigravityCard
            v-for="leader in levelFilteredLeaders(level)"
            :key="leader.id"
            depth="elevated"
            :max-tilt="1.5"
            as="article"
          >
            <button
              type="button"
              class="flex h-full w-full cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              @click="openLeaderModal(leader, level)"
            >
              <div class="p-3 pb-0">
                <div
                  class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900/90"
                >
                  <img
                    v-if="leader.photoUrl"
                    :src="leader.photoUrl"
                    :alt="`${leader.name} — ${leader.role}`"
                    loading="lazy"
                    class="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.03]"
                  />
                  <div
                    v-else
                    class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-crimson/90 p-6 text-center text-white"
                  >
                    <span
                      class="font-display flex h-20 w-20 items-center justify-center rounded-3xl bg-white/12 text-2xl font-extrabold tracking-wider text-white ring-1 ring-white/25 backdrop-blur-sm"
                    >
                      {{ getInitials(leader.name) }}
                    </span>
                    <span
                      class="mt-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-200 uppercase"
                    >
                      Portrait Coming Soon
                    </span>
                  </div>

                  <span
                    class="absolute top-3 left-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
                  >
                    National Executive
                  </span>
                </div>
              </div>

              <div class="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 class="font-display text-lg font-extrabold text-slate-ink dark:text-white">
                    {{ leader.name }}
                  </h3>
                  <p
                    class="mt-1 text-xs font-bold leading-snug tracking-wide text-crimson uppercase dark:text-crimson-bright"
                  >
                    {{ leader.role }}
                  </p>
                  <p v-if="leader.bio" class="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-body dark:text-slate-300">
                    {{ leader.bio }}
                  </p>
                </div>

                <div
                  class="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-meta dark:border-white/8 dark:text-slate-400"
                >
                  <span class="inline-flex items-center gap-1">
                    <MapPin class="h-3.5 w-3.5 text-crimson dark:text-crimson-bright" />
                    {{ leader.areaLabel }}
                  </span>
                  <span class="text-crimson dark:text-ochre-bright">Profile &rarr;</span>
                </div>
              </div>
            </button>
          </AntigravityCard>
        </div>

        <!-- LEVEL 02: Regional Leaders (Mindanao Overall Command + Island-filtered Regional Chapters) -->
        <div v-else-if="level.id === 'regional'" class="space-y-8">
          <!-- Island Group Filter Chips -->
          <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-white/85 px-4 py-3 shadow-float-recessed ring-1 ring-white/90 dark:bg-obsidian-float/85 dark:ring-white/[0.06]"
          >
            <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter regions by island group">
              <button
                v-for="tab in islandTabs"
                :key="tab.id"
                type="button"
                class="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                :class="
                  selectedIsland === tab.id
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                "
                :aria-pressed="selectedIsland === tab.id"
                @click="selectedIsland = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <span class="text-[11px] font-semibold tabular-nums text-slate-meta dark:text-slate-400">
              Showing {{ levelFilteredLeaders(level).length }} regional assignments
            </span>
          </div>

          <!-- Mindanao Overall Command Featured 3-Card Strip -->
          <div v-if="mindanaoCommandLeaders(level).length > 0" class="space-y-4">
            <div class="flex items-center gap-2.5">
              <span
                class="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-ochre/15 text-ochre dark:bg-ochre-bright/20 dark:text-ochre-bright"
              >
                <Award class="h-4 w-4" />
              </span>
              <div>
                <h3 class="font-display text-lg font-extrabold text-slate-ink dark:text-white">
                  Mindanao Overall Command
                </h3>
                <p class="text-[11px] font-medium text-slate-meta dark:text-slate-400">
                  Island-wide executive oversight and deputy directors across Mindanao chapters
                </p>
              </div>
            </div>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AntigravityCard
                v-for="leader in mindanaoCommandLeaders(level)"
                :key="leader.id"
                depth="elevated"
                :max-tilt="1.5"
                as="article"
              >
                <button
                  type="button"
                  class="flex h-full w-full cursor-pointer items-center gap-4 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
                  @click="openLeaderModal(leader, level)"
                >
                  <div
                    class="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-ochre/25 dark:bg-slate-900 dark:ring-ochre-bright/30"
                  >
                    <img
                      v-if="leader.photoUrl"
                      :src="leader.photoUrl"
                      :alt="`${leader.name} — ${leader.role}`"
                      loading="lazy"
                      class="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.04]"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-ochre text-lg font-extrabold text-white"
                    >
                      {{ getInitials(leader.name) }}
                    </div>
                  </div>

                  <div class="min-w-0 flex-1 space-y-1.5">
                    <span
                      class="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                      :class="roleTierBadgeClass(leader.roleTier)"
                    >
                      {{ leader.role }}
                    </span>
                    <h4 class="font-display truncate text-lg font-extrabold text-slate-ink dark:text-white">
                      {{ leader.name }}
                    </h4>
                    <p class="flex items-center gap-1 text-xs font-medium text-slate-body dark:text-slate-300">
                      <MapPin class="h-3.5 w-3.5 shrink-0 text-ochre dark:text-ochre-bright" />
                      {{ leader.areaLabel }} &bull; Overall Command
                    </p>
                  </div>
                </button>
              </AntigravityCard>
            </div>
          </div>

          <!-- Regional Chapters 4-Column Portrait Grid -->
          <div v-if="regionalChapterLeaders(level).length > 0" class="space-y-4">
            <h3 class="font-display text-lg font-extrabold text-slate-ink dark:text-white">
              Regional Chapters &amp; Directors
            </h3>

            <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AntigravityCard
                v-for="leader in regionalChapterLeaders(level)"
                :key="leader.id"
                depth="recessed"
                :max-tilt="1.4"
                as="article"
              >
                <button
                  type="button"
                  class="flex h-full w-full cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  @click="openLeaderModal(leader, level)"
                >
                  <div class="p-3 pb-0">
                    <div
                      class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900/90"
                    >
                      <img
                        v-if="leader.photoUrl"
                        :src="leader.photoUrl"
                        :alt="`${leader.name} — ${leader.role} (${leader.areaLabel})`"
                        loading="lazy"
                        class="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.03]"
                      />
                      <div
                        v-else
                        class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-ochre/75 p-5 text-center text-white"
                      >
                        <span
                          class="font-display flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12 text-xl font-extrabold tracking-wider text-white ring-1 ring-white/25"
                        >
                          {{ getInitials(leader.name) }}
                        </span>
                        <span
                          class="mt-3 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-200 uppercase"
                        >
                          Portrait Pending
                        </span>
                      </div>

                      <span
                        v-if="leader.regionCode"
                        class="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
                      >
                        {{ leader.regionCode }}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <span
                        class="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                        :class="roleTierBadgeClass(leader.roleTier)"
                      >
                        {{ leader.role }}
                      </span>
                      <h4 class="font-display mt-2 text-base font-extrabold text-slate-ink dark:text-white">
                        {{ leader.name }}
                      </h4>
                    </div>

                    <div
                      class="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-body dark:border-white/8 dark:text-slate-300"
                    >
                      <span class="inline-flex min-w-0 items-center gap-1 truncate">
                        <MapPin class="h-3.5 w-3.5 shrink-0 text-crimson dark:text-crimson-bright" />
                        <span class="truncate">{{ leader.areaLabel }}</span>
                      </span>
                    </div>
                  </div>
                </button>
              </AntigravityCard>
            </div>
          </div>
        </div>

        <!-- LEVELS 03–05: Provincial, District & Municipal Placeholder Cards -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AntigravityCard
            v-for="slot in levelFilteredLeaders(level)"
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
                        {{ slot.name }}
                      </h3>
                      <p
                        class="text-[11px] font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright"
                      >
                        {{ slot.role }}
                      </p>
                    </div>
                  </div>

                  <span
                    class="shrink-0 rounded-full bg-ochre/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-ochre uppercase dark:bg-ochre-bright/15 dark:text-ochre-bright"
                  >
                    Open Slot
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

    <!-- Interactive Leader Profile Modal -->
    <Teleport to="body">
      <div
        v-if="activeLeader"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        :aria-label="`${activeLeader.leader.name} profile`"
        @click.self="closeLeaderModal"
      >
        <div
          class="relative w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-white/80 dark:bg-obsidian-float dark:ring-white/10"
        >
          <button
            type="button"
            aria-label="Close leader profile"
            class="absolute top-4 right-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-crimson dark:bg-white/15 dark:hover:bg-crimson"
            @click="closeLeaderModal"
          >
            <X class="h-4 w-4" />
          </button>

          <div class="grid sm:grid-cols-5">
            <div class="bg-slate-100 sm:col-span-2 dark:bg-slate-900">
              <div class="aspect-[4/5] h-full w-full">
                <img
                  v-if="activeLeader.leader.photoUrl"
                  :src="activeLeader.leader.photoUrl"
                  :alt="`${activeLeader.leader.name} portrait`"
                  class="h-full w-full object-cover object-top"
                />
                <div
                  v-else
                  class="flex h-full min-h-[240px] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-crimson/90 p-6 text-center text-white"
                >
                  <span
                    class="font-display flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-2xl font-extrabold text-white ring-1 ring-white/25"
                  >
                    {{ getInitials(activeLeader.leader.name) }}
                  </span>
                  <span
                    class="mt-3 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-200 uppercase"
                  >
                    Portrait Pending
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-between p-6 sm:col-span-3 sm:p-7">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2 pr-8">
                  <span
                    class="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                    :class="accentBadgeClass(activeLeader.level.accent)"
                  >
                    {{ activeLeader.level.levelNumber }} &bull; {{ activeLeader.level.name }}
                  </span>
                  <span
                    v-if="activeLeader.leader.regionCode"
                    class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:bg-white/10 dark:text-slate-200"
                  >
                    {{ activeLeader.leader.regionCode }}
                  </span>
                </div>

                <div>
                  <h3 class="font-display text-2xl font-extrabold text-slate-ink dark:text-white">
                    {{ activeLeader.leader.name }}
                  </h3>
                  <p class="mt-1 text-xs font-bold tracking-wider text-crimson uppercase dark:text-crimson-bright">
                    {{ activeLeader.leader.role }}
                  </p>
                </div>

                <div class="space-y-1.5 rounded-2xl bg-slate-50 p-3.5 text-xs dark:bg-white/5">
                  <p class="flex items-center gap-1.5 font-semibold text-slate-ink dark:text-slate-100">
                    <MapPin class="h-3.5 w-3.5 shrink-0 text-crimson dark:text-crimson-bright" />
                    <span>{{ activeLeader.leader.areaLabel }}</span>
                  </p>
                  <p
                    v-if="activeLeader.leader.islandGroup"
                    class="text-[11px] font-medium text-slate-meta dark:text-slate-400"
                  >
                    Jurisdiction: {{ islandLabel(activeLeader.leader.islandGroup) }}
                  </p>
                </div>

                <p class="text-xs leading-relaxed text-slate-body dark:text-slate-300">
                  {{
                    activeLeader.leader.bio ??
                    `Confirmed SPIN Philippines ${activeLeader.leader.role} representing ${activeLeader.leader.areaLabel}.`
                  }}
                </p>
              </div>

              <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/8">
                <span class="text-[11px] font-semibold text-slate-meta dark:text-slate-400">
                  Verified SPIN Roster
                </span>
                <RouterLink
                  to="/contact"
                  class="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-crimson dark:bg-white dark:text-slate-950 dark:hover:bg-crimson-bright dark:hover:text-white"
                  @click="closeLeaderModal"
                >
                  Connect with Chapter
                  <ArrowUpRight class="h-3.5 w-3.5" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
