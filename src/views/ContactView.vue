<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Check,
  Copy,
  ExternalLink,
  Facebook,
  Mail,
  MapPin,
  MessageSquare,
  Send,
} from 'lucide-vue-next'
// import { useSpinData } from '@/composables/useSpinData'
// import { useTheme } from '@/composables/useTheme'
//
// const { site, shows } = useSpinData()
// const { isDark } = useTheme()
// Gene - Nov, 19, 2026: Editorial News Desk header relies on paper/obsidian CSS tokens directly
import { useSpinData } from '@/composables/useSpinData'

const { site, shows } = useSpinData()

const inquiryCategories = [
  'News Tip / Citizen Report',
  'Program Guesting Proposal',
  'Gawad Parangal / Community Partnership',
  'Sponsorship & Media Inquiry',
  'General Feedback',
]

const form = reactive({
  name: '',
  contactInfo: '',
  category: inquiryCategories[0],
  program: 'General / Network-Wide',
  message: '',
})

const validationError = ref<string | null>(null)
const submitting = ref(false)
const submitMode = ref<'idle' | 'api-sent' | 'static-ready'>('idle')
const apiError = ref<string | null>(null)
const copied = ref(false)

const formattedInquiryText = computed(() => {
  return [
    `[SPIN Media TV Philippines — ${form.category}]`,
    `Name: ${form.name.trim()}`,
    `Contact: ${form.contactInfo.trim()}`,
    `Program Reference: ${form.program}`,
    '',
    form.message.trim(),
  ].join('\n')
})

const mailtoHref = computed(() => {
  const email = site.value?.contact.email ?? 'desk@spinmediatv.ph'
  const subject = encodeURIComponent(`[SPIN Media] ${form.category} — ${form.name.trim()}`)
  const body = encodeURIComponent(formattedInquiryText.value)
  return `mailto:${email}?subject=${subject}&body=${body}`
})

const handleSubmit = async () => {
  validationError.value = null
  apiError.value = null

  if (!form.name.trim() || !form.contactInfo.trim() || !form.message.trim()) {
    validationError.value = 'Please fill in your name, contact info, and message.'
    return
  }

  const web3Key = site.value?.contact.web3formsKey?.trim()
  const formspree = site.value?.contact.formspreeEndpoint?.trim()

  if (web3Key || formspree) {
    submitting.value = true
    try {
      const endpoint = formspree || 'https://api.web3forms.com/submit'
      const payload = formspree
        ? {
            name: form.name,
            contact: form.contactInfo,
            category: form.category,
            program: form.program,
            message: form.message,
          }
        : {
            access_key: web3Key,
            subject: `[SPIN Media] ${form.category}`,
            from_name: form.name,
            contact: form.contactInfo,
            program: form.program,
            message: form.message,
          }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Submission returned ${res.status}`)
      }
      submitMode.value = 'api-sent'
    } catch {
      apiError.value =
        'External form endpoint unavailable; generated your ready-to-send email & Messenger dispatch below.'
      submitMode.value = 'static-ready'
    } finally {
      submitting.value = false
    }
    return
  }

  submitMode.value = 'static-ready'
}

const copyForMessenger = async () => {
  try {
    await navigator.clipboard.writeText(formattedInquiryText.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    copied.value = false
  }
}

const resetForm = () => {
  submitMode.value = 'idle'
  copied.value = false
  apiError.value = null
}
</script>

<template>
  <!--
  <div>
    <section
      class="border-b border-slate-200/80 dark:border-slate-800/80"
      :class="isDark ? 'studio-grid-bg bg-[#070D1F]' : 'newsroom-grid-bg bg-white'"
    >
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="max-w-2xl space-y-3">
          <p class="text-xs font-bold tracking-wider text-red-600 uppercase dark:text-amber-400">
            News Desk &amp; Partnerships
          </p>
          <h1 class="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            Contact SPIN Media TV Philippines
          </h1>
          <p class="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            Send a breaking news tip, propose a show guesting on <em>Usapang Pilipino</em> or
            <em>F.O.C.U.S.</em>, or reach our regional coordinators directly on Facebook.
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-12">
  -->
        <!-- Left Column: Direct Social & Desk Directory -->
  <!--
        <div class="space-y-5 lg:col-span-5">
  -->
          <!-- Primary Facebook Card -->
  <!--
          <div
            class="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-white to-white p-6 shadow-sm dark:from-blue-600/20 dark:via-[#0E1730] dark:to-[#0E1730]"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase"
              >
                <Facebook class="h-3.5 w-3.5" />
                Fastest Response Desk
              </span>
              <span class="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Active Daily
              </span>
            </div>
            <h2 class="font-display mt-3 text-lg font-extrabold text-slate-900 dark:text-white">
              Spin Media TV Philippines Page
            </h2>
            <p class="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {{
                site?.contact.responseNote ??
                'Direct message our official Facebook page for news tips, Gawad Parangal coordination, and regional inquiries.'
              }}
            </p>
            <a
              :href="site?.contact.messengerUrl ?? site?.facebookPageUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
            >
              <MessageSquare class="h-4 w-4" />
              Message on Facebook
              <ExternalLink class="h-3.5 w-3.5" />
            </a>
          </div>
  -->
          <!-- Other Social & Location Cards -->
  <!--
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0E1730]"
          >
            <h3 class="font-display text-sm font-bold text-slate-900 dark:text-white">
              Official Network Channels
            </h3>
            <div class="mt-4 space-y-2.5">
              <a
                v-for="social in site?.socials ?? []"
                :key="social.id"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs transition hover:border-red-500/40 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-amber-400/40 dark:hover:bg-slate-900/80"
              >
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">{{ social.label }}</p>
                  <p class="text-slate-500 dark:text-slate-400">{{ social.handle }}</p>
                </div>
                <ExternalLink class="h-4 w-4 text-slate-400" />
              </a>
            </div>

            <div class="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
              <p class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail class="h-4 w-4 text-red-600 dark:text-amber-400" />
                <span>{{ site?.contact.email ?? 'desk@spinmediatv.ph' }}</span>
              </p>
              <p class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin class="h-4 w-4 text-red-600 dark:text-amber-400" />
                <span>{{ site?.contact.locationLabel ?? 'Philippines' }}</span>
              </p>
            </div>
          </div>
        </div>
  -->
        <!-- Right Column: Smart Zero-Backend Inquiry Form -->
  <!--
        <div class="lg:col-span-7">
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#0E1730]"
          >
            <h2 class="font-display text-xl font-extrabold text-slate-900 dark:text-white">
              Send a Broadcast Desk Inquiry
            </h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Prepares a structured dispatch ready for Email or Facebook Messenger while operating
              without a backend database.
            </p>
  -->
            <!-- Submitted via API State -->
  <!--
            <div
              v-if="submitMode === 'api-sent'"
              class="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
            >
              <Check class="mx-auto h-10 w-10 text-emerald-500" />
              <h3 class="font-display mt-3 text-lg font-bold text-slate-900 dark:text-white">
                Inquiry Sent to SPIN Media Desk
              </h3>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Thank you, {{ form.name }}. Our team will review your message shortly.
              </p>
              <button
                type="button"
                class="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white dark:bg-amber-400 dark:text-slate-950"
                @click="resetForm"
              >
                Send Another Inquiry
              </button>
            </div>
  -->
            <!-- Zero-Backend Generated Dispatch State -->
  <!--
            <div v-else-if="submitMode === 'static-ready'" class="mt-6 space-y-4">
              <div
                v-if="apiError"
                class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200"
              >
                {{ apiError }}
              </div>

              <div
                class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/90"
              >
                <p
                  class="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                >
                  Your Formatted Dispatch
                </p>
                <pre
                  class="font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200"
                >{{ formattedInquiryText }}</pre>
              </div>

              <div class="flex flex-wrap gap-3">
                <a
                  :href="mailtoHref"
                  class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-500"
                >
                  <Mail class="h-4 w-4" />
                  Send via Email App
                </a>

                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  @click="copyForMessenger"
                >
                  <Check v-if="copied" class="h-4 w-4 text-emerald-500" />
                  <Copy v-else class="h-4 w-4" />
                  {{ copied ? 'Copied! Now Paste in Facebook' : 'Copy for Facebook Messenger' }}
                </button>

                <a
                  :href="site?.contact.messengerUrl ?? site?.facebookPageUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
                >
                  <Facebook class="h-4 w-4" />
                  Open Facebook Page
                </a>
              </div>

              <button
                type="button"
                class="text-xs font-semibold text-slate-500 underline hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                @click="resetForm"
              >
                &larr; Edit inquiry details
              </button>
            </div>
  -->
            <!-- Form Inputs -->
  <!--
            <form v-else class="mt-6 space-y-4" @submit.prevent="handleSubmit">
              <div
                v-if="validationError"
                class="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {{ validationError }}
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="contact-name"
                    class="block text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    v-model="form.name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    class="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    for="contact-info"
                    class="block text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    Email or Mobile Number *
                  </label>
                  <input
                    id="contact-info"
                    v-model="form.contactInfo"
                    type="text"
                    placeholder="name@example.com / 09xx..."
                    class="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="contact-category"
                    class="block text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-category"
                    v-model="form.category"
                    class="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option v-for="cat in inquiryCategories" :key="cat" :value="cat">
                      {{ cat }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    for="contact-program"
                    class="block text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    Related Program
                  </label>
                  <select
                    id="contact-program"
                    v-model="form.program"
                    class="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="General / Network-Wide">General / Network-Wide</option>
                    <option v-for="show in shows" :key="show.id" :value="show.title">
                      {{ show.title }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  for="contact-message"
                  class="block text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  Details / Story Summary *
                </label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  rows="5"
                  placeholder="Share details of your news tip, guesting proposal, or inquiry..."
                  class="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:opacity-60 sm:w-auto"
              >
                <Send class="h-4 w-4" />
                {{ submitting ? 'Sending...' : 'Prepare & Send Inquiry' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Editorial News Desk Contact & Citizen Report Dispatch Form -->
  <!--
  <div>
    <section class="border-b border-rule bg-white dark:border-obsidian-rule dark:bg-obsidian-card">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="max-w-2xl space-y-3">
          <p
            class="font-mono text-[11px] font-semibold tracking-widest text-crimson uppercase dark:text-crimson-bright"
          >
            News Desk &amp; Partnerships
          </p>
          <h1
            class="font-display text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl dark:text-[#F5F4F0]"
          >
            Contact SPIN Media TV Philippines
          </h1>
          <p class="text-sm leading-relaxed text-ink-muted sm:text-base dark:text-[#C4C1B8]">
            Send a breaking news tip, propose a show guesting on <em>Usapang Pilipino</em> or
            <em>F.O.C.U.S.</em>, or reach our regional coordinators directly on Facebook.
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-12">
        <div class="space-y-5 lg:col-span-5">
          <div
            class="rounded-sm border border-rule border-t-[3px] border-t-[#1877F2] bg-white p-6 shadow-sm dark:border-obsidian-rule dark:bg-obsidian-card"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-[2px] bg-[#1877F2] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-white uppercase"
              >
                <Facebook class="h-3.5 w-3.5" />
                Fastest Response Desk
              </span>
              <span
                class="font-mono text-[11px] font-semibold text-[#1877F2] dark:text-[#60A5FA]"
              >
                Active Daily
              </span>
            </div>
            <h2 class="font-display mt-3 text-xl font-extrabold text-ink dark:text-[#F5F4F0]">
              Spin Media TV Philippines Page
            </h2>
            <p class="mt-1.5 text-xs leading-relaxed text-ink-muted dark:text-[#C4C1B8]">
              {{
                site?.contact.responseNote ??
                'Direct message our official Facebook page for news tips, Gawad Parangal coordination, and regional inquiries.'
              }}
            </p>
            <a
              :href="site?.contact.messengerUrl ?? site?.facebookPageUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#1877F2] px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#1565C0]"
            >
              <MessageSquare class="h-4 w-4" />
              Message on Facebook
              <ExternalLink class="h-3.5 w-3.5" />
            </a>
          </div>

          <div
            class="rounded-sm border border-rule bg-white p-6 shadow-sm dark:border-obsidian-rule dark:bg-obsidian-card"
          >
            <h3 class="font-display text-base font-bold text-ink dark:text-[#F5F4F0]">
              Official Network Channels
            </h3>
            <div class="mt-4 space-y-2.5">
              <a
                v-for="social in site?.socials ?? []"
                :key="social.id"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between rounded-sm border border-rule px-3.5 py-2.5 text-xs transition hover:border-crimson hover:bg-paper dark:border-obsidian-rule dark:hover:border-ochre-bright dark:hover:bg-obsidian"
              >
                <div>
                  <p class="font-bold text-ink dark:text-[#F5F4F0]">{{ social.label }}</p>
                  <p class="font-mono text-[11px] text-ink-subtle dark:text-[#9A968D]">
                    {{ social.handle }}
                  </p>
                </div>
                <ExternalLink class="h-4 w-4 text-ink-subtle dark:text-[#9A968D]" />
              </a>
            </div>

            <div class="mt-5 space-y-2 border-t border-rule pt-4 text-xs dark:border-obsidian-rule">
              <p class="flex items-center gap-2 text-ink-muted dark:text-[#C4C1B8]">
                <Mail class="h-4 w-4 text-crimson dark:text-ochre-bright" />
                <span class="font-mono">{{ site?.contact.email ?? 'desk@spinmediatv.ph' }}</span>
              </p>
              <p class="flex items-center gap-2 text-ink-muted dark:text-[#C4C1B8]">
                <MapPin class="h-4 w-4 text-crimson dark:text-ochre-bright" />
                <span>{{ site?.contact.locationLabel ?? 'Philippines' }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div
            class="rounded-sm border border-rule border-t-2 border-t-ink bg-white p-6 shadow-sm sm:p-8 dark:border-obsidian-rule dark:border-t-crimson-bright dark:bg-obsidian-card"
          >
            <h2 class="font-display text-2xl font-extrabold text-ink dark:text-[#F5F4F0]">
              Send a Broadcast Desk Inquiry
            </h2>
            <p class="mt-1 text-xs text-ink-muted dark:text-[#9A968D]">
              Prepares a structured dispatch ready for Email or Facebook Messenger while operating
              without a backend database.
            </p>

            <div
              v-if="submitMode === 'api-sent'"
              class="mt-6 rounded-sm border border-emerald-600/30 bg-emerald-600/10 p-6 text-center"
            >
              <Check class="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              <h3 class="font-display mt-3 text-lg font-bold text-ink dark:text-[#F5F4F0]">
                Inquiry Sent to SPIN Media Desk
              </h3>
              <p class="mt-1 text-xs text-ink-muted dark:text-[#C4C1B8]">
                Thank you, {{ form.name }}. Our team will review your message shortly.
              </p>
              <button
                type="button"
                class="mt-4 cursor-pointer rounded-sm bg-ink px-4 py-2 font-mono text-xs font-semibold tracking-wider text-white uppercase dark:bg-crimson-bright"
                @click="resetForm"
              >
                Send Another Inquiry
              </button>
            </div>

            <div v-else-if="submitMode === 'static-ready'" class="mt-6 space-y-4">
              <div
                v-if="apiError"
                class="rounded-sm border border-ochre/30 bg-ochre/10 p-3 text-xs text-ochre dark:border-ochre-bright/30 dark:text-ochre-bright"
              >
                {{ apiError }}
              </div>

              <div
                class="rounded-sm border border-rule bg-paper p-4 dark:border-obsidian-rule dark:bg-obsidian"
              >
                <p
                  class="mb-2 font-mono text-[10px] font-semibold tracking-widest text-ink-subtle uppercase dark:text-[#9A968D]"
                >
                  Your Formatted Dispatch
                </p>
                <pre
                  class="font-sans text-xs leading-relaxed whitespace-pre-wrap text-ink dark:text-[#F5F4F0]"
                >{{ formattedInquiryText }}</pre>
              </div>

              <div class="flex flex-wrap gap-3">
                <a
                  :href="mailtoHref"
                  class="inline-flex items-center gap-2 rounded-sm bg-crimson px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-crimson-dark"
                >
                  <Mail class="h-4 w-4" />
                  Send via Email App
                </a>
  -->

                <!--
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-rule bg-white px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-ink uppercase transition hover:bg-paper-alt dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:hover:border-white/25"
                  @click="copyForMessenger"
                >
                  <Check v-if="copied" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <Copy v-else class="h-4 w-4" />
                  {{ copied ? 'Copied! Paste in Facebook' : 'Copy for Facebook Messenger' }}
                </button>
                -->
                <!-- Gene - Nov, 19, 2026: Ensure Copy for Facebook Messenger button keeps dark hover background -->
                <!--
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-rule bg-white px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-ink uppercase transition hover:bg-paper-alt dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0] dark:hover:border-white/25 dark:hover:bg-[#242428]"
                  @click="copyForMessenger"
                >
                  <Check v-if="copied" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <Copy v-else class="h-4 w-4" />
                  {{ copied ? 'Copied! Paste in Facebook' : 'Copy for Facebook Messenger' }}
                </button>

                <a
                  :href="site?.contact.messengerUrl ?? site?.facebookPageUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-sm bg-[#1877F2] px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#1565C0]"
                >
                  <Facebook class="h-4 w-4" />
                  Open Facebook Page
                </a>
              </div>

              <button
                type="button"
                class="cursor-pointer font-mono text-xs font-semibold text-ink-subtle underline hover:text-ink dark:text-[#9A968D] dark:hover:text-white"
                @click="resetForm"
              >
                &larr; Edit inquiry details
              </button>
            </div>

            <form v-else class="mt-6 space-y-4" @submit.prevent="handleSubmit">
              <div
                v-if="validationError"
                class="rounded-sm border border-crimson/30 bg-crimson/10 p-3 text-xs font-medium text-crimson dark:border-crimson-bright/30 dark:text-crimson-bright"
              >
                {{ validationError }}
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="contact-name"
                    class="block text-xs font-bold text-ink dark:text-[#F5F4F0]"
                  >
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    v-model="form.name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    class="mt-1.5 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-crimson focus:outline-none dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0]"
                  />
                </div>

                <div>
                  <label
                    for="contact-info"
                    class="block text-xs font-bold text-ink dark:text-[#F5F4F0]"
                  >
                    Email or Mobile Number *
                  </label>
                  <input
                    id="contact-info"
                    v-model="form.contactInfo"
                    type="text"
                    placeholder="name@example.com / 09xx..."
                    class="mt-1.5 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-crimson focus:outline-none dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0]"
                  />
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="contact-category"
                    class="block text-xs font-bold text-ink dark:text-[#F5F4F0]"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-category"
                    v-model="form.category"
                    class="mt-1.5 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-crimson focus:outline-none dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0]"
                  >
                    <option v-for="cat in inquiryCategories" :key="cat" :value="cat">
                      {{ cat }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    for="contact-program"
                    class="block text-xs font-bold text-ink dark:text-[#F5F4F0]"
                  >
                    Related Program
                  </label>
                  <select
                    id="contact-program"
                    v-model="form.program"
                    class="mt-1.5 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-crimson focus:outline-none dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0]"
                  >
                    <option value="General / Network-Wide">General / Network-Wide</option>
                    <option v-for="show in shows" :key="show.id" :value="show.title">
                      {{ show.title }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  for="contact-message"
                  class="block text-xs font-bold text-ink dark:text-[#F5F4F0]"
                >
                  Details / Story Summary *
                </label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  rows="5"
                  placeholder="Share details of your news tip, guesting proposal, or inquiry..."
                  class="mt-1.5 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-crimson focus:outline-none dark:border-obsidian-rule dark:bg-obsidian dark:text-[#F5F4F0]"
                />
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-crimson px-5 py-3 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-crimson-dark disabled:opacity-60 sm:w-auto"
              >
                <Send class="h-4 w-4" />
                {{ submitting ? 'Sending...' : 'Prepare & Send Inquiry' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
  -->

  <!-- Gene - Nov, 19, 2026: Antigravity borderless News Desk contact page harmonized at max-w-[1600px] -->
  <div class="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-10">
    <!-- Hero Header Card -->
    <section
      class="rounded-[28px] bg-white p-7 shadow-float-elevated ring-1 ring-white/90 sm:p-10 dark:bg-obsidian-float dark:ring-white/[0.06]"
    >
      <div class="max-w-3xl space-y-3">
        <p class="text-[11px] font-bold tracking-[0.16em] text-crimson uppercase dark:text-crimson-bright">
          News Desk &amp; Partnerships
        </p>
        <h1 class="font-display text-3xl font-extrabold tracking-tight text-slate-ink sm:text-4xl lg:text-5xl dark:text-white">
          Contact SPIN Media TV Philippines
        </h1>
        <p class="text-sm leading-relaxed text-slate-body sm:text-base dark:text-slate-300">
          Send a breaking news tip, propose a show guesting on <em>Usapang Pilipino</em> or
          <em>F.O.C.U.S.</em>, or reach our regional coordinators directly on Facebook.
        </p>
      </div>
    </section>

    <section class="grid gap-8 lg:grid-cols-12">
      <!-- Left Desk Cards -->
      <div class="space-y-6 lg:col-span-5">
        <div
          class="rounded-[24px] bg-white p-6 shadow-float-recessed ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/[0.06]"
        >
          <div class="flex items-center justify-between gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase"
            >
              <Facebook class="h-3.5 w-3.5" />
              Fastest Response Desk
            </span>
            <span class="text-[11px] font-bold text-[#1877F2] dark:text-[#60A5FA]">
              Active Daily
            </span>
          </div>
          <h2 class="font-display mt-3.5 text-xl font-extrabold text-slate-ink dark:text-white">
            Spin Media TV Philippines Page
          </h2>
          <p class="mt-1.5 text-xs leading-relaxed text-slate-body dark:text-slate-300">
            {{
              site?.contact.responseNote ??
              'Direct message our official Facebook page for news tips, Gawad Parangal coordination, and regional inquiries.'
            }}
          </p>
          <a
            :href="site?.contact.messengerUrl ?? site?.facebookPageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-[#1565C0]"
          >
            <MessageSquare class="h-4 w-4" />
            Message on Facebook
            <ExternalLink class="h-3.5 w-3.5" />
          </a>
        </div>

        <div
          class="rounded-[24px] bg-white p-6 shadow-float-recessed ring-1 ring-white/90 dark:bg-obsidian-float dark:ring-white/[0.06]"
        >
          <h3 class="font-display text-lg font-bold text-slate-ink dark:text-white">
            Official Network Channels
          </h3>
          <div class="mt-4 space-y-2.5">
            <a
              v-for="social in site?.socials ?? []"
              :key="social.id"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between rounded-2xl bg-slate-50/90 px-4 py-3 text-xs transition hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div>
                <p class="font-bold text-slate-ink dark:text-white">{{ social.label }}</p>
                <p class="text-[11px] text-slate-meta dark:text-slate-400">
                  {{ social.handle }}
                </p>
              </div>
              <ExternalLink class="h-4 w-4 text-slate-meta dark:text-slate-400" />
            </a>
          </div>

          <div class="mt-5 space-y-2 pt-2 text-xs">
            <p class="flex items-center gap-2 text-slate-body dark:text-slate-300">
              <Mail class="h-4 w-4 text-crimson dark:text-ochre-bright" />
              <span class="font-semibold">{{ site?.contact.email ?? 'desk@spinmediatv.ph' }}</span>
            </p>
            <p class="flex items-center gap-2 text-slate-body dark:text-slate-300">
              <MapPin class="h-4 w-4 text-crimson dark:text-ochre-bright" />
              <span>{{ site?.contact.locationLabel ?? 'Philippines' }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Inquiry Form Card -->
      <div class="lg:col-span-7">
        <div
          class="rounded-[28px] bg-white p-6 shadow-float-elevated ring-1 ring-white/90 sm:p-8 dark:bg-obsidian-float dark:ring-white/[0.06]"
        >
          <h2 class="font-display text-2xl font-extrabold text-slate-ink dark:text-white">
            Send a Broadcast Desk Inquiry
          </h2>
          <p class="mt-1 text-xs text-slate-meta dark:text-slate-400">
            Prepares a structured dispatch ready for Email or Facebook Messenger while operating
            without a backend database.
          </p>

          <div
            v-if="submitMode === 'api-sent'"
            class="mt-6 rounded-2xl bg-emerald-500/10 p-6 text-center"
          >
            <Check class="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            <h3 class="font-display mt-3 text-lg font-bold text-slate-ink dark:text-white">
              Inquiry Sent to SPIN Media Desk
            </h3>
            <p class="mt-1 text-xs text-slate-body dark:text-slate-300">
              Thank you, {{ form.name }}. Our team will review your message shortly.
            </p>
            <button
              type="button"
              class="mt-4 cursor-pointer rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white dark:bg-crimson-bright"
              @click="resetForm"
            >
              Send Another Inquiry
            </button>
          </div>

          <div v-else-if="submitMode === 'static-ready'" class="mt-6 space-y-4">
            <div
              v-if="apiError"
              class="rounded-2xl bg-ochre/10 p-3.5 text-xs text-ochre dark:text-ochre-bright"
            >
              {{ apiError }}
            </div>

            <div class="rounded-2xl bg-slate-100/90 p-4 dark:bg-white/5">
              <p class="mb-2 text-[10px] font-bold tracking-widest text-slate-meta uppercase dark:text-slate-400">
                Your Formatted Dispatch
              </p>
              <pre class="font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-ink dark:text-slate-100">{{ formattedInquiryText }}</pre>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                :href="mailtoHref"
                class="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-crimson-dark"
              >
                <Mail class="h-4 w-4" />
                Send via Email App
              </a>

              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                @click="copyForMessenger"
              >
                <Check v-if="copied" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <Copy v-else class="h-4 w-4" />
                {{ copied ? 'Copied! Paste in Facebook' : 'Copy for Facebook Messenger' }}
              </button>

              <a
                :href="site?.contact.messengerUrl ?? site?.facebookPageUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1565C0]"
              >
                <Facebook class="h-4 w-4" />
                Open Facebook Page
              </a>
            </div>

            <button
              type="button"
              class="cursor-pointer text-xs font-semibold text-slate-meta underline hover:text-slate-ink dark:text-slate-400 dark:hover:text-white"
              @click="resetForm"
            >
              &larr; Edit inquiry details
            </button>
          </div>

          <form v-else class="mt-6 space-y-4" @submit.prevent="handleSubmit">
            <div
              v-if="validationError"
              class="rounded-2xl bg-crimson/10 p-3.5 text-xs font-medium text-crimson dark:text-crimson-bright"
            >
              {{ validationError }}
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="contact-name" class="block text-xs font-bold text-slate-ink dark:text-slate-100">
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  class="mt-1.5 w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-ink focus:bg-white focus:ring-2 focus:ring-crimson/40 focus:outline-none dark:bg-white/8 dark:text-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label for="contact-info" class="block text-xs font-bold text-slate-ink dark:text-slate-100">
                  Email or Mobile Number *
                </label>
                <input
                  id="contact-info"
                  v-model="form.contactInfo"
                  type="text"
                  placeholder="name@example.com / 09xx..."
                  class="mt-1.5 w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-ink focus:bg-white focus:ring-2 focus:ring-crimson/40 focus:outline-none dark:bg-white/8 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="contact-category" class="block text-xs font-bold text-slate-ink dark:text-slate-100">
                  Inquiry Topic
                </label>
                <select
                  id="contact-category"
                  v-model="form.category"
                  class="mt-1.5 w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-ink focus:bg-white focus:ring-2 focus:ring-crimson/40 focus:outline-none dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                >
                  <option v-for="cat in inquiryCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div>
                <label for="contact-program" class="block text-xs font-bold text-slate-ink dark:text-slate-100">
                  Related Program
                </label>
                <select
                  id="contact-program"
                  v-model="form.program"
                  class="mt-1.5 w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-ink focus:bg-white focus:ring-2 focus:ring-crimson/40 focus:outline-none dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                >
                  <option value="General / Network-Wide">General / Network-Wide</option>
                  <option v-for="show in shows" :key="show.id" :value="show.title">
                    {{ show.title }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label for="contact-message" class="block text-xs font-bold text-slate-ink dark:text-slate-100">
                Details / Story Summary *
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="5"
                placeholder="Share details of your news tip, guesting proposal, or inquiry..."
                class="mt-1.5 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-ink focus:bg-white focus:ring-2 focus:ring-crimson/40 focus:outline-none dark:bg-white/8 dark:text-white dark:focus:bg-slate-900"
              />
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-crimson px-6 py-3 text-xs font-bold tracking-wide text-white shadow-sm transition hover:bg-crimson-dark disabled:opacity-60 sm:w-auto"
            >
              <Send class="h-4 w-4" />
              {{ submitting ? 'Sending...' : 'Prepare & Send Inquiry' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
