<script setup lang="ts">
// Gene - Nov, 28, 2026: Media Hub manager with smart YouTube/Facebook URL auto-fill, feature toggle, and CRUD
import { computed, onMounted, reactive, ref } from 'vue'
import { CheckCircle2, ExternalLink, Pencil, Plus, Search, Sparkles, Star, Trash2, X } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { deleteMediaItem, fetchAdminMediaItems, upsertMediaItem } from '@/services/adminService'
import { parseMediaInputUrl } from '@/utils/streamUrl'
import type { MediaFormat, MediaItem, MediaPlatform } from '@/types/spin'

const { shows, reloadSpinData } = useSpinData()

const items = ref<MediaItem[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const searchQuery = ref('')
const platformFilter = ref<'all' | MediaPlatform>('all')
const statusMessage = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

const form = reactive({
  id: '',
  platform: 'youtube' as MediaPlatform,
  format: 'episode' as MediaFormat,
  title: '',
  summary: '',
  publishedAt: new Date().toISOString().slice(0, 16),
  showSlug: 'breaking-news',
  showLabel: 'Daily & Global Dispatches',
  videoId: '',
  externalUrl: '',
  embedUrl: '',
  thumbnailUrl: '',
  views: '' as string | number,
  featured: false,
  isPublished: true,
})

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return items.value.filter((item) => {
    if (platformFilter.value !== 'all' && item.platform !== platformFilter.value) return false
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.showLabel.toLowerCase().includes(q) ||
      item.externalUrl.toLowerCase().includes(q)
    )
  })
})

async function loadItems() {
  loading.value = true
  try {
    items.value = await fetchAdminMediaItems()
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to fetch media items.',
    }
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  form.id = ''
  form.platform = 'youtube'
  form.format = 'episode'
  form.title = ''
  form.summary = ''
  form.publishedAt = new Date().toISOString().slice(0, 16)
  form.showSlug = 'breaking-news'
  form.showLabel = 'Daily & Global Dispatches'
  form.videoId = ''
  form.externalUrl = ''
  form.embedUrl = ''
  form.thumbnailUrl = ''
  form.views = ''
  form.featured = false
  form.isPublished = true
  showForm.value = true
}

function openEditForm(item: MediaItem) {
  form.id = item.id
  form.platform = item.platform
  form.format = item.format
  form.title = item.title
  form.summary = item.summary
  form.publishedAt = item.publishedAt ? item.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16)
  form.showSlug = item.showSlug
  form.showLabel = item.showLabel
  form.videoId = item.videoId ?? ''
  form.externalUrl = item.externalUrl
  form.embedUrl = item.embedUrl ?? ''
  form.thumbnailUrl = item.thumbnailUrl ?? ''
  form.views = item.views ?? ''
  form.featured = Boolean(item.featured)
  form.isPublished = item.isPublished !== false
  showForm.value = true
}

function handleAutoFillFromUrl() {
  const parsed = parseMediaInputUrl(form.externalUrl)
  if (!parsed) {
    statusMessage.value = { type: 'err', text: 'Paste a valid YouTube or Facebook URL first.' }
    return
  }
  form.platform = parsed.platform
  form.format = parsed.format
  form.videoId = parsed.videoId ?? ''
  form.embedUrl = parsed.embedUrl ?? ''
  if (parsed.thumbnailUrl) {
    form.thumbnailUrl = parsed.thumbnailUrl
  }
  if (!form.id && parsed.videoId) {
    form.id = `yt-${parsed.videoId}`
  }
  statusMessage.value = { type: 'ok', text: 'Auto-detected embed and thumbnail from URL.' }
}

function syncShowLabel() {
  const matched = shows.value.find((s) => s.slug === form.showSlug)
  if (matched) {
    form.showLabel = matched.title
  }
}

async function handleSave() {
  statusMessage.value = null
  if (!form.title.trim() || !form.externalUrl.trim()) {
    statusMessage.value = { type: 'err', text: 'Title and External URL are required.' }
    return
  }

  saving.value = true
  try {
    const generatedId =
      form.id.trim() ||
      (form.videoId.trim() ? `yt-${form.videoId.trim()}` : `${form.platform}-${Date.now()}`)

    const parsedViews =
      form.views === '' || form.views === null ? undefined : Number(form.views)

    await upsertMediaItem({
      id: generatedId,
      platform: form.platform,
      format: form.format,
      title: form.title.trim(),
      summary: form.summary.trim() || form.title.trim(),
      publishedAt: new Date(form.publishedAt || Date.now()).toISOString(),
      showSlug: form.showSlug,
      showLabel: form.showLabel,
      videoId: form.videoId.trim() || undefined,
      externalUrl: form.externalUrl.trim(),
      embedUrl: form.embedUrl.trim() || undefined,
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      views: Number.isFinite(parsedViews) ? parsedViews : undefined,
      featured: form.featured,
      isPublished: form.isPublished,
    })

    showForm.value = false
    await Promise.all([loadItems(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Media item saved.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to save media item.',
    }
  } finally {
    saving.value = false
  }
}

async function toggleFeatured(item: MediaItem) {
  try {
    await upsertMediaItem({ ...item, featured: !item.featured })
    await Promise.all([loadItems(), reloadSpinData()])
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Failed to toggle featured state.',
    }
  }
}

async function handleDelete(item: MediaItem) {
  if (!window.confirm(`Delete "${item.title}"?`)) return
  try {
    await deleteMediaItem(item.id)
    await Promise.all([loadItems(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Media item removed.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to delete media item.',
    }
  }
}

onMounted(() => {
  void loadItems()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold tracking-tight">Media Hub Manager</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Add or edit YouTube episodes, Shorts, and Facebook Live / Post links.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-crimson-dark"
        @click="openCreateForm"
      >
        <Plus class="h-4 w-4" />
        Add Video / Post
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

    <!-- Add / Edit Form -->
    <section
      v-if="showForm"
      class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 shadow-md dark:border-crimson-bright/30 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-bold">
          {{ form.id ? 'Edit Media Item' : 'Add New Media Item' }}
        </h2>
        <button
          type="button"
          class="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          @click="showForm = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Video or Post URL *</label>
        <div class="flex flex-wrap gap-2">
          <input
            v-model="form.externalUrl"
            type="url"
            placeholder="https://www.youtube.com/watch?v=... or Facebook URL"
            class="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950"
            @click="handleAutoFillFromUrl"
          >
            <Sparkles class="h-3.5 w-3.5" />
            Auto-Detect from URL
          </button>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-4">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Platform</label>
          <select
            v-model="form.platform"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          >
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Format</label>
          <select
            v-model="form.format"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          >
            <option value="episode">Episode</option>
            <option value="short">Short</option>
            <option value="report">Report</option>
            <option value="post">Facebook Post</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Show</label>
          <select
            v-model="form.showSlug"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            @change="syncShowLabel"
          >
            <option v-for="show in shows" :key="show.id" :value="show.slug">
              {{ show.title }}
            </option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Published Date</label>
          <input
            v-model="form.publishedAt"
            type="datetime-local"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Headline / Title *</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Summary</label>
        <textarea
          v-model="form.summary"
          rows="2"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">YouTube Video ID</label>
          <input
            v-model="form.videoId"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Embed URL</label>
          <input
            v-model="form.embedUrl"
            type="url"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Thumbnail URL</label>
          <input
            v-model="form.thumbnailUrl"
            type="url"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div class="flex flex-wrap gap-5">
          <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
            <input v-model="form.featured" type="checkbox" class="h-4 w-4 accent-crimson" />
            Featured on Front Page
          </label>
          <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
            <input v-model="form.isPublished" type="checkbox" class="h-4 w-4 accent-crimson" />
            Published
          </label>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold dark:border-white/15"
            @click="showForm = false"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white hover:bg-crimson-dark disabled:opacity-50"
            @click="handleSave"
          >
            {{ saving ? 'Saving...' : 'Save Item' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Search & Filter -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-60 flex-1">
        <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search videos, shows, or URLs..."
          class="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm dark:border-white/10 dark:bg-slate-900"
        />
      </div>
      <select
        v-model="platformFilter"
        class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold dark:border-white/10 dark:bg-slate-900"
      >
        <option value="all">All Platforms</option>
        <option value="youtube">YouTube Only</option>
        <option value="facebook">Facebook Only</option>
      </select>
    </div>

    <!-- List -->
    <div
      class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading media items...</div>
      <div v-else-if="filteredItems.length === 0" class="p-8 text-center text-sm text-slate-500">
        No matching media items found.
      </div>
      <div v-else class="divide-y divide-slate-100 dark:divide-white/8">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="flex flex-wrap items-center justify-between gap-4 p-4 transition hover:bg-slate-50 dark:hover:bg-white/4"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3.5">
            <img
              v-if="item.thumbnailUrl"
              :src="item.thumbnailUrl"
              :alt="item.title"
              class="h-14 w-24 shrink-0 rounded-xl bg-slate-900 object-cover"
            />
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase">
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                  {{ item.platform }} &middot; {{ item.format }}
                </span>
                <span class="text-crimson dark:text-crimson-bright">{{ item.showLabel }}</span>
                <span
                  v-if="item.isPublished === false"
                  class="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-300"
                >
                  Draft
                </span>
              </div>
              <p class="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">
                {{ item.title }}
              </p>
              <a
                :href="item.externalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 truncate text-xs text-slate-500 hover:text-crimson"
              >
                <span class="truncate">{{ item.externalUrl }}</span>
                <ExternalLink class="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              :title="item.featured ? 'Remove featured status' : 'Mark featured'"
              class="cursor-pointer rounded-lg p-2 transition"
              :class="
                item.featured
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              "
              @click="toggleFeatured(item)"
            >
              <Star class="h-4 w-4" :class="{ 'fill-current': item.featured }" />
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Edit media item"
              @click="openEditForm(item)"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-600"
              aria-label="Delete media item"
              @click="handleDelete(item)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
