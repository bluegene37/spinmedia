<script setup lang="ts">
// Gene - Nov, 28, 2026: Admin panel for editing site branding, URLs, social channels, and contact desk info
import { reactive, ref, watch } from 'vue'
import { CheckCircle2, Plus, Save, Trash2, Upload } from 'lucide-vue-next'
import { useSpinData } from '@/composables/useSpinData'
import { saveSiteSection, uploadSpinImage } from '@/services/adminService'
import type { SiteConfig, SocialChannel, SocialPlatform } from '@/types/spin'

const { site, reloadSpinData } = useSpinData()

const saving = ref(false)
const uploadingLogo = ref(false)
const statusMessage = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

const form = reactive<SiteConfig>({
  name: '',
  shortName: '',
  parentOrg: '',
  tagline: '',
  description: '',
  logoUrl: '',
  youtubeChannelId: '',
  facebookPageUrl: '',
  socials: [],
  contact: {
    email: '',
    messengerUrl: '',
    web3formsKey: '',
    formspreeEndpoint: '',
    locationLabel: '',
    responseNote: '',
  },
})

watch(
  site,
  (val) => {
    if (!val) return
    form.name = val.name
    form.shortName = val.shortName
    form.parentOrg = val.parentOrg
    form.tagline = val.tagline
    form.description = val.description
    form.logoUrl = val.logoUrl
    form.youtubeChannelId = val.youtubeChannelId
    form.facebookPageUrl = val.facebookPageUrl
    form.socials = val.socials.map((s) => ({ ...s }))
    form.contact = { ...val.contact }
  },
  { immediate: true },
)

async function handleLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  statusMessage.value = null
  uploadingLogo.value = true
  try {
    const publicUrl = await uploadSpinImage(file, 'branding')
    form.logoUrl = publicUrl
    statusMessage.value = { type: 'ok', text: 'Logo uploaded to Storage. Click Save Changes to publish.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Logo upload failed.',
    }
  } finally {
    uploadingLogo.value = false
    input.value = ''
  }
}

function addSocialChannel() {
  const newChannel: SocialChannel = {
    id: `social-${Date.now()}`,
    platform: 'youtube' as SocialPlatform,
    label: 'New Channel',
    handle: '@spinmediatv',
    url: 'https://',
    primaryEmbed: false,
  }
  form.socials.push(newChannel)
}

function removeSocialChannel(index: number) {
  form.socials.splice(index, 1)
}

async function handleSave() {
  statusMessage.value = null
  saving.value = true
  try {
    const payload: SiteConfig = {
      ...form,
      socials: form.socials.map((s) => ({ ...s })),
      contact: { ...form.contact },
    }
    await saveSiteSection('site', payload)
    await reloadSpinData()
    statusMessage.value = { type: 'ok', text: 'Site configuration and URLs saved to Supabase.' }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to save site configuration.',
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold tracking-tight">Site &amp; URLs Manager</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Update YouTube Channel ID, Facebook Page URL, social channel links, contact desk settings,
          and network logo.
        </p>
      </div>

      <button
        type="button"
        :disabled="saving"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-crimson-dark disabled:opacity-50"
        @click="handleSave"
      >
        <Save class="h-3.5 w-3.5" />
        {{ saving ? 'Saving...' : 'Save Site & URLs' }}
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

    <!-- Brand Identity & Core URLs -->
    <section
      class="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <h2 class="font-display text-base font-bold">Brand Identity &amp; Stream Endpoints</h2>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Network Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Short Name</label>
          <input
            v-model="form.shortName"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Tagline</label>
          <input
            v-model="form.tagline"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Parent Organization</label>
          <input
            v-model="form.parentOrg"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">YouTube Channel ID</label>
          <input
            v-model="form.youtubeChannelId"
            type="text"
            placeholder="UC..."
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Primary Facebook Page URL</label>
          <input
            v-model="form.facebookPageUrl"
            type="url"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Network Description</label>
        <textarea
          v-model="form.description"
          rows="2"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>

      <div class="flex flex-wrap items-center gap-4 pt-1">
        <div class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-900 ring-2 ring-slate-200 dark:ring-white/15">
          <img v-if="form.logoUrl" :src="form.logoUrl" alt="Network logo" class="h-full w-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <label class="mb-1 block text-xs font-bold uppercase">Logo URL</label>
          <input
            v-model="form.logoUrl"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <label
          class="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-white/15 dark:bg-slate-800"
        >
          <Upload class="h-3.5 w-3.5" />
          {{ uploadingLogo ? 'Uploading...' : 'Upload Logo' }}
          <input type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
        </label>
      </div>
    </section>

    <!-- Social Links -->
    <section
      class="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between">
        <h2 class="font-display text-base font-bold">Social Channels ({{ form.socials.length }})</h2>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-slate-950"
          @click="addSocialChannel"
        >
          <Plus class="h-3.5 w-3.5" />
          Add Channel
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(social, idx) in form.socials"
          :key="social.id"
          class="grid items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:grid-cols-12 dark:border-white/10 dark:bg-slate-950"
        >
          <div class="sm:col-span-2">
            <label class="mb-1 block text-[11px] font-bold uppercase">Platform</label>
            <select
              v-model="social.platform"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-white/15 dark:bg-slate-900"
            >
              <option value="youtube">youtube</option>
              <option value="facebook">facebook</option>
              <option value="tiktok">tiktok</option>
              <option value="linkedin">linkedin</option>
              <option value="instagram">instagram</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-[11px] font-bold uppercase">Label</label>
            <input
              v-model="social.label"
              type="text"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-white/15 dark:bg-slate-900"
            />
          </div>
          <div class="sm:col-span-3">
            <label class="mb-1 block text-[11px] font-bold uppercase">Handle</label>
            <input
              v-model="social.handle"
              type="text"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-white/15 dark:bg-slate-900"
            />
          </div>
          <div class="sm:col-span-4">
            <label class="mb-1 block text-[11px] font-bold uppercase">URL</label>
            <input
              v-model="social.url"
              type="url"
              class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-white/15 dark:bg-slate-900"
            />
          </div>
          <div class="flex justify-end sm:col-span-1">
            <button
              type="button"
              class="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-600"
              aria-label="Remove social channel"
              @click="removeSocialChannel(idx)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Desk -->
    <section
      class="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <h2 class="font-display text-base font-bold">Contact &amp; News Desk Settings</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">News Desk Email</label>
          <input
            v-model="form.contact.email"
            type="email"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Messenger URL</label>
          <input
            v-model="form.contact.messengerUrl"
            type="url"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Location Label</label>
          <input
            v-model="form.contact.locationLabel"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Formspree Endpoint</label>
          <input
            v-model="form.contact.formspreeEndpoint"
            type="text"
            placeholder="https://formspree.io/f/..."
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
      </div>
      <div>
        <label class="mb-1 block text-xs font-bold uppercase">Response Note</label>
        <textarea
          v-model="form.contact.responseNote"
          rows="2"
          class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
        />
      </div>
    </section>
  </div>
</template>
