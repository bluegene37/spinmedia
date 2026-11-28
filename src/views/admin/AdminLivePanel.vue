<script setup lang="ts">
// Gene - Nov, 28, 2026: Live Broadcast ON/OFF controller with YouTube/Facebook auto-embed preview
import { onMounted, reactive, ref, watch } from 'vue'
import { CheckCircle2, ExternalLink, Radio, Save, Sparkles, VideoOff } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { fetchAdminLiveBroadcast, saveLiveBroadcast } from '@/services/adminService'
import { resolveLiveEmbedUrl, sanitizeExternalUrl } from '@/utils/streamUrl'
import type { LiveBroadcastPlatform } from '@/types/spin'

const { site, shows, reloadSpinData } = useSpinData()

const loadingState = ref(true)
const saving = ref(false)
const embedManuallyEdited = ref(false)
const statusMessage = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

const form = reactive({
  isLive: false,
  platform: 'youtube' as LiveBroadcastPlatform,
  title: '',
  subtitle: '',
  streamUrl: '',
  embedUrl: '',
  showSlug: '',
  showBanner: true,
  autoEmbedOnHome: true,
  startedAt: undefined as string | undefined,
})

async function loadCurrentLive() {
  loadingState.value = true
  try {
    const current = await fetchAdminLiveBroadcast()
    form.isLive = current.isLive
    form.platform = current.platform
    form.title = current.title
    form.subtitle = current.subtitle
    form.streamUrl = current.streamUrl
    form.embedUrl = current.embedUrl
    form.showSlug = current.showSlug ?? ''
    form.showBanner = current.showBanner
    form.autoEmbedOnHome = current.autoEmbedOnHome
    form.startedAt = current.startedAt
    embedManuallyEdited.value = Boolean(current.embedUrl)
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to load live broadcast settings.',
    }
  } finally {
    loadingState.value = false
  }
}

watch(
  () => [form.platform, form.streamUrl] as const,
  ([platform, streamUrl]) => {
    if (embedManuallyEdited.value) return
    form.embedUrl = resolveLiveEmbedUrl(platform, streamUrl, site.value?.youtubeChannelId)
  },
)

function handleUseChannelLive() {
  const channelId = site.value?.youtubeChannelId || 'UCyZfcpNIrLMU5TPD_mA7dsg'
  form.platform = 'youtube'
  form.streamUrl = `https://www.youtube.com/channel/${channelId}/live`
  embedManuallyEdited.value = false
  form.embedUrl = resolveLiveEmbedUrl('youtube', form.streamUrl, channelId)
}

function handleAutoDetectEmbed() {
  embedManuallyEdited.value = false
  form.embedUrl = resolveLiveEmbedUrl(form.platform, form.streamUrl, site.value?.youtubeChannelId)
}

async function persistLive(forceLive?: boolean) {
  statusMessage.value = null
  if (typeof forceLive === 'boolean') {
    form.isLive = forceLive
  }

  const safeStreamUrl = form.streamUrl.trim() ? sanitizeExternalUrl(form.streamUrl) : ''
  if (form.streamUrl.trim() && !safeStreamUrl) {
    statusMessage.value = { type: 'err', text: 'Stream URL must start with https:// or http://' }
    return
  }

  const finalEmbed =
    form.embedUrl.trim() ||
    resolveLiveEmbedUrl(form.platform, safeStreamUrl, site.value?.youtubeChannelId)

  saving.value = true
  try {
    const saved = await saveLiveBroadcast({
      isLive: form.isLive,
      platform: form.platform,
      title: form.title,
      subtitle: form.subtitle,
      streamUrl: safeStreamUrl,
      embedUrl: finalEmbed,
      showSlug: form.showSlug || undefined,
      showBanner: form.showBanner,
      autoEmbedOnHome: form.autoEmbedOnHome,
      startedAt: form.isLive ? form.startedAt : undefined,
    })
    form.startedAt = saved.startedAt
    form.embedUrl = saved.embedUrl
    await reloadSpinData()
    statusMessage.value = {
      type: 'ok',
      text: saved.isLive
        ? 'Live broadcast is now ACTIVE on the public site.'
        : 'Live override turned OFF — site returned to scheduled PHT lineup.',
    }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Failed to save live broadcast state.',
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadCurrentLive()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold tracking-tight">Live Broadcast Control</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Turn on a live YouTube, Facebook, or custom broadcast override for the On Air pill and Home
          Page spotlight.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="form.isLive"
          type="button"
          :disabled="saving || loadingState"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/15 dark:bg-slate-800 dark:text-slate-200"
          @click="persistLive(false)"
        >
          <VideoOff class="h-3.5 w-3.5" />
          End Live Stream
        </button>

        <button
          type="button"
          :disabled="saving || loadingState"
          class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-crimson-dark disabled:opacity-50"
          @click="persistLive()"
        >
          <Save class="h-3.5 w-3.5" />
          {{ saving ? 'Saving...' : 'Save Live Settings' }}
        </button>
      </div>
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

    <div class="grid gap-6 lg:grid-cols-12">
      <!-- Form -->
      <section
        class="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-7 dark:border-white/10 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
          <div class="flex items-center gap-3">
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              :class="
                form.isLive
                  ? 'bg-crimson text-white'
                  : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
              "
            >
              <Radio class="h-5 w-5" />
            </span>
            <div>
              <p class="text-sm font-bold">
                {{ form.isLive ? 'Broadcast Status: ON AIR' : 'Broadcast Status: Off Air' }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                When off, the navbar falls back to your weekly PHT show schedule.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            :aria-checked="form.isLive"
            class="relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors"
            :class="form.isLive ? 'bg-crimson' : 'bg-slate-300 dark:bg-slate-700'"
            @click="form.isLive = !form.isLive"
          >
            <span
              class="h-5 w-5 rounded-full bg-white shadow transition-transform"
              :class="form.isLive ? 'translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-bold tracking-wide uppercase">Platform</label>
            <select
              v-model="form.platform"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            >
              <option value="youtube">YouTube Live</option>
              <option value="facebook">Facebook Live</option>
              <option value="custom">Custom Stream URL</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-bold tracking-wide uppercase">
              Related Show (Optional)
            </label>
            <select
              v-model="form.showSlug"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
            >
              <option value="">Special / Breaking Coverage</option>
              <option v-for="show in shows" :key="show.id" :value="show.slug">
                {{ show.title }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <div class="mb-1.5 flex items-center justify-between gap-2">
            <label class="text-xs font-bold tracking-wide uppercase">Live Stream URL</label>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-crimson hover:underline dark:text-crimson-bright"
              @click="handleUseChannelLive"
            >
              <Sparkles class="h-3 w-3" />
              Use YouTube Channel /live
            </button>
          </div>
          <input
            v-model="form.streamUrl"
            type="url"
            placeholder="https://www.youtube.com/watch?v=... or Facebook Live URL"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-bold tracking-wide uppercase">
            Broadcast Title
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="LIVE: F.O.C.U.S. Special Public Affairs Forum"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-bold tracking-wide uppercase">
            Subtitle / Hosts Line
          </label>
          <input
            v-model="form.subtitle"
            type="text"
            placeholder="Anchored live from SPIN Media Studio Manila"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>

        <div>
          <div class="mb-1.5 flex items-center justify-between gap-2">
            <label class="text-xs font-bold tracking-wide uppercase">Embed Player URL</label>
            <button
              type="button"
              class="cursor-pointer text-[11px] font-semibold text-slate-600 hover:text-crimson dark:text-slate-400"
              @click="handleAutoDetectEmbed"
            >
              Re-detect from Stream URL
            </button>
          </div>
          <input
            v-model="form.embedUrl"
            type="url"
            placeholder="https://www.youtube-nocookie.com/embed/..."
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-mono dark:border-white/15 dark:bg-slate-950"
            @input="embedManuallyEdited = true"
          />
        </div>

        <div class="flex flex-wrap gap-5 pt-1">
          <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
            <input v-model="form.showBanner" type="checkbox" class="h-4 w-4 accent-crimson" />
            Show Live Spotlight Banner on Front Page
          </label>
          <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
            <input v-model="form.autoEmbedOnHome" type="checkbox" class="h-4 w-4 accent-crimson" />
            Embed Video Player Directly on Front Page
          </label>
        </div>
      </section>

      <!-- Live Preview -->
      <section
        class="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-5 dark:border-white/10 dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-base font-bold">Public Preview</h2>
          <a
            v-if="form.streamUrl"
            :href="form.streamUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-semibold text-crimson hover:underline dark:text-crimson-bright"
          >
            Open Stream
            <ExternalLink class="h-3 w-3" />
          </a>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
              :class="form.isLive ? 'bg-crimson' : 'bg-slate-500'"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-white" :class="{ 'animate-ping': form.isLive }" />
              On Air &middot; {{ form.title || 'Live Broadcast' }}
            </span>
          </div>
          <p class="mt-2.5 text-sm font-bold text-slate-900 dark:text-white">
            {{ form.title || 'Untitled Live Broadcast' }}
          </p>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {{ form.subtitle || 'Subtitle appears below the live headline on the Front Page.' }}
          </p>
        </div>

        <div
          v-if="form.embedUrl && form.autoEmbedOnHome"
          class="aspect-video overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-slate-200 dark:ring-white/10"
        >
          <iframe
            :src="form.embedUrl"
            title="Live Broadcast Preview"
            class="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
        <div
          v-else
          class="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-xs text-slate-500 dark:border-white/15 dark:bg-slate-950"
        >
          Paste a YouTube or Facebook Live URL to preview the embedded player here.
        </div>
      </section>
    </div>
  </div>
</template>
