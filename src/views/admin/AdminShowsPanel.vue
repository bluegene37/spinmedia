<script setup lang="ts">
// Gene - Nov, 28, 2026: Weekly Broadcast Shows schedule manager (/admin/shows)
import { onMounted, reactive, ref } from 'vue'
import { CheckCircle2, Pencil, Plus, Trash2, X } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { deleteShow, fetchAdminShows, upsertShow } from '@/services/adminService'
import type { ShowProgram } from '@/types/spin'

const { reloadSpinData } = useSpinData()

const showsList = ref<ShowProgram[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const statusMessage = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

const weekdayOptions = [
  { id: 0, label: 'Sun' },
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
]

const form = reactive({
  id: '',
  slug: '',
  title: '',
  subtitle: '',
  hostsInput: '',
  director: '',
  dayOfWeek: [1] as number[],
  dayLabel: 'Every Monday',
  timeLabel: '7:00 PM – 8:00 PM PHT',
  startHourPht: 19,
  endHourPht: 20,
  summary: '',
  accentColor: 'crimson',
  sortOrder: 1,
  isActive: true,
})

async function loadShows() {
  loading.value = true
  try {
    showsList.value = await fetchAdminShows()
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to fetch shows.',
    }
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  form.id = ''
  form.slug = ''
  form.title = ''
  form.subtitle = ''
  form.hostsInput = ''
  form.director = ''
  form.dayOfWeek = [1]
  form.dayLabel = 'Every Monday'
  form.timeLabel = '7:00 PM – 8:00 PM PHT'
  form.startHourPht = 19
  form.endHourPht = 20
  form.summary = ''
  form.accentColor = 'crimson'
  form.sortOrder = showsList.value.length + 1
  form.isActive = true
  showForm.value = true
}

function openEditForm(show: ShowProgram) {
  form.id = show.id
  form.slug = show.slug
  form.title = show.title
  form.subtitle = show.subtitle
  form.hostsInput = show.hosts.join(', ')
  form.director = show.director ?? ''
  form.dayOfWeek = [...show.dayOfWeek]
  form.dayLabel = show.dayLabel
  form.timeLabel = show.timeLabel
  form.startHourPht = show.startHourPht
  form.endHourPht = show.endHourPht
  form.summary = show.summary
  form.accentColor = show.accentColor
  form.sortOrder = show.sortOrder ?? 1
  form.isActive = show.isActive !== false
  showForm.value = true
}

function toggleDay(dayId: number) {
  const idx = form.dayOfWeek.indexOf(dayId)
  if (idx >= 0) {
    form.dayOfWeek.splice(idx, 1)
  } else {
    form.dayOfWeek.push(dayId)
    form.dayOfWeek.sort((a, b) => a - b)
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function handleSave() {
  statusMessage.value = null
  if (!form.title.trim()) {
    statusMessage.value = { type: 'err', text: 'Show title is required.' }
    return
  }

  const slug = form.slug.trim() || slugify(form.title)
  const id = form.id.trim() || `show-${slug}`
  const hosts = form.hostsInput
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)

  saving.value = true
  try {
    await upsertShow({
      id,
      slug,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      hosts,
      director: form.director.trim() || undefined,
      dayOfWeek: [...form.dayOfWeek],
      dayLabel: form.dayLabel.trim(),
      timeLabel: form.timeLabel.trim(),
      startHourPht: Number(form.startHourPht),
      endHourPht: Number(form.endHourPht),
      summary: form.summary.trim(),
      accentColor: form.accentColor,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    })

    showForm.value = false
    await Promise.all([loadShows(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Show program saved.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to save show.',
    }
  } finally {
    saving.value = false
  }
}

async function handleDelete(show: ShowProgram) {
  if (!window.confirm(`Delete show "${show.title}"?`)) return
  try {
    await deleteShow(show.id)
    await Promise.all([loadShows(), reloadSpinData()])
    statusMessage.value = { type: 'ok', text: 'Show deleted.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to delete show.',
    }
  }
}

onMounted(() => {
  void loadShows()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold tracking-tight">Weekly Shows Manager</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage SPIN Media TV's scheduled PHT broadcast lineup, hosts, and airtime slots.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-crimson-dark"
        @click="openCreateForm"
      >
        <Plus class="h-4 w-4" />
        Add Show
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

    <section
      v-if="showForm"
      class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 shadow-md dark:border-crimson-bright/30 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-bold">{{ form.id ? 'Edit Show' : 'New Show' }}</h2>
        <button
          type="button"
          class="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          @click="showForm = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Title *</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="auto-generated-from-title"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Accent Color</label>
          <select
            v-model="form.accentColor"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          >
            <option value="crimson">crimson</option>
            <option value="gold">gold</option>
            <option value="blue">blue</option>
          </select>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Subtitle</label>
          <input
            v-model="form.subtitle"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Hosts (comma separated)</label>
          <input
            v-model="form.hostsInput"
            type="text"
            placeholder="Host A, Host B"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>

      <div>
        <label class="mb-1.5 block text-xs font-bold uppercase">Broadcast Days (PHT)</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="day in weekdayOptions"
            :key="day.id"
            type="button"
            class="cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition"
            :class="
              form.dayOfWeek.includes(day.id)
                ? 'bg-crimson text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
            "
            @click="toggleDay(day.id)"
          >
            {{ day.label }}
          </button>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-5">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-xs font-bold uppercase">Day Label</label>
          <input
            v-model="form.dayLabel"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block text-xs font-bold uppercase">Time Label</label>
          <input
            v-model="form.timeLabel"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Sort Order</label>
          <input
            v-model.number="form.sortOrder"
            type="number"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Start Hour (0–23 PHT)</label>
          <input
            v-model.number="form.startHourPht"
            type="number"
            min="0"
            max="23"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">End Hour (1–24 PHT)</label>
          <input
            v-model.number="form.endHourPht"
            type="number"
            min="1"
            max="24"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Director (Optional)</label>
          <input
            v-model="form.director"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Program Summary</label>
        <textarea
          v-model="form.summary"
          rows="2"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
          <input v-model="form.isActive" type="checkbox" class="h-4 w-4 accent-crimson" />
          Active on Public Schedule
        </label>

        <div class="flex gap-2">
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
            {{ saving ? 'Saving...' : 'Save Show' }}
          </button>
        </div>
      </div>
    </section>

    <div
      class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading shows...</div>
      <div v-else class="divide-y divide-slate-100 dark:divide-white/8">
        <div
          v-for="show in showsList"
          :key="show.id"
          class="flex flex-wrap items-center justify-between gap-4 p-4"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-bold">{{ show.title }}</span>
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold dark:bg-white/10">
                {{ show.dayLabel }} &bull; {{ show.timeLabel }}
              </span>
              <span
                v-if="show.isActive === false"
                class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700"
              >
                Inactive
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Hosts: {{ show.hosts.join(', ') || 'TBA' }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              class="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Edit show"
              @click="openEditForm(show)"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-600"
              aria-label="Delete show"
              @click="handleDelete(show)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
