<script setup lang="ts">
// Gene - Nov, 28, 2026: Tabbed CMS manager for Good News PH, Key Leaders, Gallery Slides, SPIN Jobs & About/Public Info
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { CheckCircle2, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import {
  deleteGallerySlide,
  deleteJob,
  deleteLeader,
  deletePositiveNews,
  fetchAdminGallery,
  fetchAdminJobs,
  fetchAdminLeaders,
  fetchAdminPositiveNews,
  saveSiteSection,
  uploadSpinImage,
  upsertGallerySlide,
  upsertJob,
  upsertLeader,
  upsertPositiveNews,
} from '@/services/adminService'
import type {
  AboutData,
  DirectoryLeader,
  DirectoryLevel,
  GalleryCategory,
  GalleryData,
  GallerySlide,
  LeaderLevelId,
  LeaderRoleTier,
  PositiveNewsCategory,
  PositiveNewsItem,
  PublicInfoData,
  RegionalIslandGroup,
  SpinJobOpening,
} from '@/types/spin'

type ContentTab = 'news' | 'leaders' | 'gallery' | 'jobs' | 'about'

const { about, publicInfo, reloadSpinData } = useSpinData()

const activeTab = ref<ContentTab>('news')
const saving = ref(false)
const uploading = ref(false)
const statusMessage = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

// Good News PH state
const newsItems = ref<PositiveNewsItem[]>([])
const showNewsForm = ref(false)
const newsForm = reactive<PositiveNewsItem>({
  id: '',
  category: 'community',
  categoryLabel: 'Community Hero',
  title: '',
  summary: '',
  body: '',
  location: '',
  publishedAt: new Date().toISOString().slice(0, 16),
  readTime: '3 min read',
  highlightTag: '',
  accentColor: 'crimson',
  relatedShowSlug: '',
  isPublished: true,
})

// Leaders state
const leaderLevels = ref<DirectoryLevel[]>([])
const selectedLevelId = ref<LeaderLevelId>('national')
const showLeaderForm = ref(false)
const leaderForm = reactive<{
  id: string
  levelId: LeaderLevelId
  name: string
  role: string
  areaLabel: string
  regionCode: string
  islandGroup: '' | RegionalIslandGroup
  roleTier: LeaderRoleTier
  photoUrl: string
  status: 'confirmed' | 'placeholder'
  bio: string
  sortOrder: number
}>({
  id: '',
  levelId: 'national',
  name: '',
  role: '',
  areaLabel: '',
  regionCode: '',
  islandGroup: '',
  roleTier: 'director',
  photoUrl: '',
  status: 'confirmed',
  bio: '',
  sortOrder: 1,
})

// Gallery state
const galleryData = ref<GalleryData | null>(null)
const selectedAlbumId = ref('')
const showSlideForm = ref(false)
const slideForm = reactive<GallerySlide>({
  id: '',
  slideNumber: 1,
  title: '',
  caption: '',
  category: 'gawad',
  imageUrl: '',
  tag: '',
})

// Jobs state
const jobsList = ref<SpinJobOpening[]>([])
const showJobForm = ref(false)
const jobForm = reactive<SpinJobOpening>({
  id: '',
  title: '',
  department: '',
  location: '',
  employmentType: 'Full-Time',
  summary: '',
  applyUrl: '',
  isOpen: true,
  sortOrder: 1,
})

// About & Citizen Info state
const aboutForm = reactive<AboutData>({
  headline: '',
  intro: '',
  mission: '',
  vision: '',
  coreValues: [],
  affiliations: [],
  leadership: [],
})
const hotlinesJson = ref('[]')

watch(
  about,
  (val) => {
    if (!val) return
    aboutForm.headline = val.headline
    aboutForm.intro = val.intro
    aboutForm.mission = val.mission
    aboutForm.vision = val.vision
    aboutForm.coreValues = val.coreValues.map((c) => ({ ...c }))
    aboutForm.affiliations = [...val.affiliations]
    aboutForm.leadership = val.leadership.map((l) => ({ ...l }))
  },
  { immediate: true },
)

watch(
  publicInfo,
  (val) => {
    if (!val) return
    hotlinesJson.value = JSON.stringify(val, null, 2)
  },
  { immediate: true },
)

const currentLevelLeaders = computed(() => {
  return leaderLevels.value.find((l) => l.id === selectedLevelId.value)?.leaders ?? []
})

const currentAlbum = computed(() => {
  const albums = galleryData.value?.albums ?? []
  return albums.find((a) => a.id === selectedAlbumId.value) ?? albums[0] ?? null
})

async function loadAllContent() {
  try {
    const [newsRes, leadersRes, galleryRes, jobsRes] = await Promise.all([
      fetchAdminPositiveNews(),
      fetchAdminLeaders(),
      fetchAdminGallery(),
      fetchAdminJobs(),
    ])
    newsItems.value = newsRes
    leaderLevels.value = leadersRes
    galleryData.value = galleryRes
    if (!selectedAlbumId.value && galleryRes.albums.length > 0) {
      selectedAlbumId.value = galleryRes.albums[0]?.id ?? ''
    }
    jobsList.value = jobsRes
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to load CMS records.',
    }
  }
}

// Good News handlers
const categoryLabelMap: Record<PositiveNewsCategory, string> = {
  community: 'Community Hero',
  ofw: 'OFW & Bayanihan',
  family: 'Family & Values',
  progress: 'Innovation & Progress',
}

function openNewStory() {
  Object.assign(newsForm, {
    id: '',
    category: 'community' as PositiveNewsCategory,
    categoryLabel: 'Community Hero',
    title: '',
    summary: '',
    body: '',
    location: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    readTime: '3 min read',
    highlightTag: '',
    accentColor: 'crimson' as const,
    relatedShowSlug: '',
    isPublished: true,
  })
  showNewsForm.value = true
}

function editStory(item: PositiveNewsItem) {
  Object.assign(newsForm, {
    ...item,
    publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
    relatedShowSlug: item.relatedShowSlug ?? '',
    isPublished: item.isPublished !== false,
  })
  showNewsForm.value = true
}

async function saveStory() {
  if (!newsForm.title.trim()) {
    statusMessage.value = { type: 'err', text: 'Story title is required.' }
    return
  }
  saving.value = true
  statusMessage.value = null
  try {
    await upsertPositiveNews({
      ...newsForm,
      id: newsForm.id.trim() || `gn-${Date.now()}`,
      categoryLabel: newsForm.categoryLabel.trim() || categoryLabelMap[newsForm.category],
      publishedAt: new Date(newsForm.publishedAt || Date.now()).toISOString(),
      relatedShowSlug: newsForm.relatedShowSlug?.trim() || undefined,
    })
    showNewsForm.value = false
    await Promise.all([loadAllContent(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Good News PH story saved.' }
  } catch (err) {
    statusMessage.value = { type: 'err', text: err instanceof Error ? err.message : 'Save failed.' }
  } finally {
    saving.value = false
  }
}

async function removeStory(item: PositiveNewsItem) {
  if (!window.confirm(`Delete story "${item.title}"?`)) return
  await deletePositiveNews(item.id)
  await Promise.all([loadAllContent(), reloadSpinData()])
}

// Leader handlers
function openNewLeader() {
  Object.assign(leaderForm, {
    id: '',
    levelId: selectedLevelId.value,
    name: '',
    role: '',
    areaLabel: '',
    regionCode: '',
    islandGroup: '' as '' | RegionalIslandGroup,
    roleTier: 'director' as LeaderRoleTier,
    photoUrl: '',
    status: 'confirmed' as const,
    bio: '',
    sortOrder: currentLevelLeaders.value.length + 1,
  })
  showLeaderForm.value = true
}

function editLeader(leader: DirectoryLeader) {
  Object.assign(leaderForm, {
    id: leader.id,
    levelId: selectedLevelId.value,
    name: leader.name,
    role: leader.role,
    areaLabel: leader.areaLabel,
    regionCode: leader.regionCode ?? '',
    islandGroup: leader.islandGroup ?? '',
    roleTier: leader.roleTier,
    photoUrl: leader.photoUrl ?? '',
    status: leader.status,
    bio: leader.bio ?? '',
    sortOrder: leader.sortOrder ?? 1,
  })
  showLeaderForm.value = true
}

async function handleLeaderPhotoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    leaderForm.photoUrl = await uploadSpinImage(file, 'leaders')
    statusMessage.value = { type: 'ok', text: 'Leader portrait uploaded.' }
  } catch (err) {
    statusMessage.value = { type: 'err', text: err instanceof Error ? err.message : 'Upload failed.' }
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function saveLeader() {
  if (!leaderForm.name.trim() || !leaderForm.role.trim()) {
    statusMessage.value = { type: 'err', text: 'Leader name and role are required.' }
    return
  }
  saving.value = true
  statusMessage.value = null
  try {
    await upsertLeader(
      leaderForm.levelId,
      {
        id: leaderForm.id.trim() || `ldr-${Date.now()}`,
        name: leaderForm.name,
        role: leaderForm.role,
        areaLabel: leaderForm.areaLabel,
        regionCode: leaderForm.regionCode || undefined,
        islandGroup: leaderForm.islandGroup || undefined,
        roleTier: leaderForm.roleTier,
        photoUrl: leaderForm.photoUrl || undefined,
        status: leaderForm.status,
        bio: leaderForm.bio || undefined,
        sortOrder: leaderForm.sortOrder,
      },
      leaderForm.sortOrder,
    )
    showLeaderForm.value = false
    await Promise.all([loadAllContent(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Leader entry saved.' }
  } catch (err) {
    statusMessage.value = { type: 'err', text: err instanceof Error ? err.message : 'Save failed.' }
  } finally {
    saving.value = false
  }
}

async function removeLeader(leader: DirectoryLeader) {
  if (!window.confirm(`Remove leader "${leader.name}"?`)) return
  await deleteLeader(leader.id)
  await Promise.all([loadAllContent(), reloadSpinData()])
}

// Gallery handlers
function openNewSlide() {
  const album = currentAlbum.value
  Object.assign(slideForm, {
    id: '',
    slideNumber: (album?.slides.length ?? 0) + 1,
    title: '',
    caption: '',
    category: (album?.category ?? 'gawad') as Exclude<GalleryCategory, 'all'>,
    imageUrl: '',
    tag: 'Showcase',
  })
  showSlideForm.value = true
}

function editSlide(slide: GallerySlide) {
  Object.assign(slideForm, { ...slide })
  showSlideForm.value = true
}

async function handleSlideImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    slideForm.imageUrl = await uploadSpinImage(file, 'gallery')
    statusMessage.value = { type: 'ok', text: 'Slide image uploaded.' }
  } catch (err) {
    statusMessage.value = { type: 'err', text: err instanceof Error ? err.message : 'Upload failed.' }
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function saveSlide() {
  const album = currentAlbum.value
  if (!album || !slideForm.title.trim() || !slideForm.imageUrl.trim()) {
    statusMessage.value = { type: 'err', text: 'Album, title, and image URL are required.' }
    return
  }
  saving.value = true
  statusMessage.value = null
  try {
    await upsertGallerySlide(
      album.id,
      {
        ...slideForm,
        id: slideForm.id.trim() || `slide-${Date.now()}`,
      },
      slideForm.slideNumber,
    )
    showSlideForm.value = false
    await Promise.all([loadAllContent(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Gallery slide saved.' }
  } catch (err) {
    statusMessage.value = { type: 'err', text: err instanceof Error ? err.message : 'Save failed.' }
  } finally {
    saving.value = false
  }
}

async function removeSlide(slide: GallerySlide) {
  if (!window.confirm(`Delete slide "${slide.title}"?`)) return
  await deleteGallerySlide(slide.id)
  await Promise.all([loadAllContent(), reloadSpinData()])
}

// Jobs handlers
function openNewJob() {
  Object.assign(jobForm, {
    id: '',
    title: '',
    department: 'Broadcast & Newsroom',
    location: 'Metro Manila / Remote',
    employmentType: 'Full-Time',
    summary: '',
    applyUrl: '',
    isOpen: true,
    sortOrder: jobsList.value.length + 1,
  })
  showJobForm.value = true
}

function editJob(job: SpinJobOpening) {
  Object.assign(jobForm, {
    ...job,
    applyUrl: job.applyUrl ?? '',
    isOpen: job.isOpen !== false,
    sortOrder: job.sortOrder ?? 1,
  })
  showJobForm.value = true
}

async function saveJob() {
  if (!jobForm.title.trim()) {
    statusMessage.value = { type: 'err', text: 'Job title is required.' }
    return
  }
  saving.value = true
  statusMessage.value = null
  try {
    await upsertJob({
      ...jobForm,
      id: jobForm.id.trim() || `job-${Date.now()}`,
    })
    showJobForm.value = false
    await Promise.all([loadAllContent(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'SPIN Job posting saved.' }
  } catch (err) {
    statusMessage.value = { type: 'err', text: err instanceof Error ? err.message : 'Save failed.' }
  } finally {
    saving.value = false
  }
}

async function removeJob(job: SpinJobOpening) {
  if (!window.confirm(`Delete job "${job.title}"?`)) return
  await deleteJob(job.id)
  await Promise.all([loadAllContent(), reloadSpinData()])
}

// About & Public Info handler
async function saveAboutAndPublicInfo() {
  saving.value = true
  statusMessage.value = null
  try {
    const parsedPublicInfo = JSON.parse(hotlinesJson.value) as PublicInfoData
    await Promise.all([
      saveSiteSection('about', {
        ...aboutForm,
        coreValues: aboutForm.coreValues.map((c) => ({ ...c })),
        affiliations: [...aboutForm.affiliations],
        leadership: aboutForm.leadership.map((l) => ({ ...l })),
      }),
      saveSiteSection('public_info', parsedPublicInfo),
    ])
    await reloadSpinData()
    statusMessage.value = { type: 'ok', text: 'About Us & Citizen Info saved.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Check Citizen Info JSON syntax and try again.',
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadAllContent()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-extrabold tracking-tight">
        News, Leaders, Gallery &amp; Jobs CMS
      </h1>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Manage Good News PH articles, Key Leaders portraits, Gallery slides, SPIN Jobs, and About
        Us pages.
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in [
          { id: 'news', label: 'Good News PH' },
          { id: 'leaders', label: 'Key Leaders' },
          { id: 'gallery', label: 'Gallery Slides' },
          { id: 'jobs', label: 'SPIN Jobs' },
          { id: 'about', label: 'About & Citizen Info' },
        ]"
        :key="tab.id"
        type="button"
        class="cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition"
        :class="
          activeTab === tab.id
            ? 'bg-crimson text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-white/10'
        "
        @click="activeTab = tab.id as ContentTab"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-if="statusMessage"
      class="flex items-center gap-2.5 rounded-2xl border p-3.5 text-xs font-semibold"
      :class="
        statusMessage.type === 'ok'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
          : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
      "
    >
      <CheckCircle2 v-if="statusMessage.type === 'ok'" class="h-4 w-4 shrink-0" />
      <span>{{ statusMessage.text }}</span>
    </div>

    <!-- TAB 1: GOOD NEWS PH -->
    <div v-if="activeTab === 'news'" class="space-y-4">
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
          @click="openNewStory"
        >
          <Plus class="h-4 w-4" />
          Add Story
        </button>
      </div>

      <section
        v-if="showNewsForm"
        class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">{{ newsForm.id ? 'Edit Story' : 'New Story' }}</h2>
          <button type="button" class="cursor-pointer p-1" @click="showNewsForm = false">
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Category</label>
            <select
              v-model="newsForm.category"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            >
              <option value="community">community</option>
              <option value="ofw">ofw</option>
              <option value="family">family</option>
              <option value="progress">progress</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Location</label>
            <input
              v-model="newsForm.location"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Highlight Tag</label>
            <input
              v-model="newsForm.highlightTag"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Headline *</label>
          <input
            v-model="newsForm.title"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Summary</label>
          <textarea
            v-model="newsForm.summary"
            rows="2"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Full Story Body</label>
          <textarea
            v-model="newsForm.body"
            rows="4"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
            <input v-model="newsForm.isPublished" type="checkbox" class="h-4 w-4 accent-crimson" />
            Published
          </label>
          <button
            type="button"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
            @click="saveStory"
          >
            {{ saving ? 'Saving...' : 'Save Story' }}
          </button>
        </div>
      </section>

      <div class="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white dark:divide-white/8 dark:border-white/10 dark:bg-slate-900">
        <div
          v-for="item in newsItems"
          :key="item.id"
          class="flex items-center justify-between gap-4 p-4"
        >
          <div class="min-w-0">
            <p class="text-[11px] font-bold text-crimson uppercase">{{ item.categoryLabel }} &bull; {{ item.location }}</p>
            <p class="truncate text-sm font-bold">{{ item.title }}</p>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="cursor-pointer rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" @click="editStory(item)">
              <Pencil class="h-4 w-4" />
            </button>
            <button type="button" class="cursor-pointer rounded-lg p-2 text-slate-400 hover:text-red-600" @click="removeStory(item)">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: KEY LEADERS -->
    <div v-else-if="activeTab === 'leaders'" class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <select
          v-model="selectedLevelId"
          class="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold dark:border-white/15 dark:bg-slate-900"
        >
          <option v-for="level in leaderLevels" :key="level.id" :value="level.id">
            {{ level.levelNumber }} — {{ level.name }} ({{ level.leaders.length }})
          </option>
        </select>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
          @click="openNewLeader"
        >
          <Plus class="h-4 w-4" />
          Add Leader
        </button>
      </div>

      <section
        v-if="showLeaderForm"
        class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">{{ leaderForm.id ? 'Edit Leader' : 'Add Leader' }}</h2>
          <button type="button" class="cursor-pointer p-1" @click="showLeaderForm = false">
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Full Name *</label>
            <input
              v-model="leaderForm.name"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Role / Title *</label>
            <input
              v-model="leaderForm.role"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Area Label</label>
            <input
              v-model="leaderForm.areaLabel"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Role Tier</label>
            <select
              v-model="leaderForm.roleTier"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            >
              <option value="executive">executive</option>
              <option value="overall">overall</option>
              <option value="director">director</option>
              <option value="spin-media">spin-media</option>
              <option value="deputy">deputy</option>
              <option value="placeholder">placeholder</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Status</label>
            <select
              v-model="leaderForm.status"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            >
              <option value="confirmed">confirmed</option>
              <option value="placeholder">placeholder</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Sort Order</label>
            <input
              v-model.number="leaderForm.sortOrder"
              type="number"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <div class="min-w-0 flex-1">
            <label class="mb-1 block text-xs font-bold uppercase">Portrait URL</label>
            <input
              v-model="leaderForm.photoUrl"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-white/15">
            <Upload class="h-3.5 w-3.5" />
            {{ uploading ? 'Uploading...' : 'Upload Portrait' }}
            <input type="file" accept="image/*" class="hidden" @change="handleLeaderPhotoUpload" />
          </label>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Bio</label>
          <textarea
            v-model="leaderForm.bio"
            rows="2"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
            @click="saveLeader"
          >
            {{ saving ? 'Saving...' : 'Save Leader' }}
          </button>
        </div>
      </section>

      <div class="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white dark:divide-white/8 dark:border-white/10 dark:bg-slate-900">
        <div
          v-for="leader in currentLevelLeaders"
          :key="leader.id"
          class="flex items-center justify-between gap-4 p-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <img
              v-if="leader.photoUrl"
              :src="leader.photoUrl"
              :alt="leader.name"
              class="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold">{{ leader.name }}</p>
              <p class="truncate text-xs text-slate-500">{{ leader.role }} &bull; {{ leader.areaLabel }}</p>
            </div>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="cursor-pointer rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" @click="editLeader(leader)">
              <Pencil class="h-4 w-4" />
            </button>
            <button type="button" class="cursor-pointer rounded-lg p-2 text-slate-400 hover:text-red-600" @click="removeLeader(leader)">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: GALLERY SLIDES -->
    <div v-else-if="activeTab === 'gallery'" class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <select
          v-model="selectedAlbumId"
          class="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold dark:border-white/15 dark:bg-slate-900"
        >
          <option v-for="album in galleryData?.albums ?? []" :key="album.id" :value="album.id">
            {{ album.title }} ({{ album.slides.length }} slides)
          </option>
        </select>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
          @click="openNewSlide"
        >
          <Plus class="h-4 w-4" />
          Add Slide
        </button>
      </div>

      <section
        v-if="showSlideForm"
        class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">{{ slideForm.id ? 'Edit Slide' : 'Add Slide' }}</h2>
          <button type="button" class="cursor-pointer p-1" @click="showSlideForm = false">
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="sm:col-span-2">
            <label class="mb-1 block text-xs font-bold uppercase">Slide Title *</label>
            <input
              v-model="slideForm.title"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Slide Number</label>
            <input
              v-model.number="slideForm.slideNumber"
              type="number"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <div class="min-w-0 flex-1">
            <label class="mb-1 block text-xs font-bold uppercase">Image URL *</label>
            <input
              v-model="slideForm.imageUrl"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-white/15">
            <Upload class="h-3.5 w-3.5" />
            {{ uploading ? 'Uploading...' : 'Upload Slide Image' }}
            <input type="file" accept="image/*" class="hidden" @change="handleSlideImageUpload" />
          </label>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Caption</label>
          <textarea
            v-model="slideForm.caption"
            rows="2"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
            @click="saveSlide"
          >
            {{ saving ? 'Saving...' : 'Save Slide' }}
          </button>
        </div>
      </section>

      <div class="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white dark:divide-white/8 dark:border-white/10 dark:bg-slate-900">
        <div
          v-for="slide in currentAlbum?.slides ?? []"
          :key="slide.id"
          class="flex items-center justify-between gap-4 p-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <img :src="slide.imageUrl" :alt="slide.title" class="h-12 w-20 shrink-0 rounded-lg object-cover" />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold">#{{ slide.slideNumber }} &mdash; {{ slide.title }}</p>
              <p class="truncate text-xs text-slate-500">{{ slide.caption }}</p>
            </div>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="cursor-pointer rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" @click="editSlide(slide)">
              <Pencil class="h-4 w-4" />
            </button>
            <button type="button" class="cursor-pointer rounded-lg p-2 text-slate-400 hover:text-red-600" @click="removeSlide(slide)">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: SPIN JOBS -->
    <div v-else-if="activeTab === 'jobs'" class="space-y-4">
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
          @click="openNewJob"
        >
          <Plus class="h-4 w-4" />
          Add Job Opening
        </button>
      </div>

      <section
        v-if="showJobForm"
        class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">{{ jobForm.id ? 'Edit Job' : 'New Job' }}</h2>
          <button type="button" class="cursor-pointer p-1" @click="showJobForm = false">
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Role Title *</label>
            <input
              v-model="jobForm.title"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Department</label>
            <input
              v-model="jobForm.department"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Location</label>
            <input
              v-model="jobForm.location"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase">Apply URL</label>
            <input
              v-model="jobForm.applyUrl"
              type="url"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            />
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Summary</label>
          <textarea
            v-model="jobForm.summary"
            rows="2"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
            <input v-model="jobForm.isOpen" type="checkbox" class="h-4 w-4 accent-crimson" />
            Open for Applications
          </label>
          <button
            type="button"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
            @click="saveJob"
          >
            {{ saving ? 'Saving...' : 'Save Job' }}
          </button>
        </div>
      </section>

      <div class="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white dark:divide-white/8 dark:border-white/10 dark:bg-slate-900">
        <div v-if="jobsList.length === 0" class="p-6 text-center text-sm text-slate-500">
          No job postings yet. Add one above to display it under Initiatives → SPIN Jobs.
        </div>
        <div
          v-for="job in jobsList"
          :key="job.id"
          class="flex items-center justify-between gap-4 p-4"
        >
          <div class="min-w-0">
            <p class="text-sm font-bold">{{ job.title }}</p>
            <p class="text-xs text-slate-500">{{ job.department }} &bull; {{ job.location }} &bull; {{ job.isOpen ? 'Open' : 'Closed' }}</p>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="cursor-pointer rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" @click="editJob(job)">
              <Pencil class="h-4 w-4" />
            </button>
            <button type="button" class="cursor-pointer rounded-lg p-2 text-slate-400 hover:text-red-600" @click="removeJob(job)">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: ABOUT & CITIZEN INFO -->
    <div
      v-else
      class="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-bold">About Us &amp; Citizen Essentials</h2>
        <button
          type="button"
          :disabled="saving"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white"
          @click="saveAboutAndPublicInfo"
        >
          <Save class="h-3.5 w-3.5" />
          {{ saving ? 'Saving...' : 'Save About & Citizen Info' }}
        </button>
      </div>
      <div>
        <label class="mb-1 block text-xs font-bold uppercase">About Headline</label>
        <input
          v-model="aboutForm.headline"
          type="text"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Intro</label>
        <textarea
          v-model="aboutForm.intro"
          rows="3"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Mission</label>
          <textarea
            v-model="aboutForm.mission"
            rows="3"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Vision</label>
          <textarea
            v-model="aboutForm.vision"
            rows="3"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>
      <div>
        <label class="mb-1 block text-xs font-bold uppercase">
          Citizen Essentials (Hotlines, Advisories, Holidays JSON)
        </label>
        <textarea
          v-model="hotlinesJson"
          rows="10"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-xs dark:border-white/15 dark:bg-slate-950"
        />
      </div>
    </div>
  </div>
</template>
