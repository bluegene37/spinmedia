<script setup lang="ts">
// Gene - Nov, 28, 2026: Responsive shell layout for the /admin broadcast and CMS console
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
/*
import {
  CalendarClock,
  ExternalLink,
  Film,
  Globe,
  Layers,
  LogOut,
  Menu,
  Moon,
  Radio,
  RefreshCw,
  Sun,
  X,
} from 'lucide-vue-next'
*/
// Gene - Nov, 28, 2026: Add KeyRound and CheckCircle2 icons for Change Password modal
import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Film,
  Globe,
  KeyRound,
  Layers,
  LogOut,
  Menu,
  Moon,
  Radio,
  RefreshCw,
  Sun,
  X,
} from 'lucide-vue-next'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useSpinData } from '@/composables/useSpinData'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
// const { adminProfile, signOut } = useAdminAuth()
const { adminProfile, signOut, updatePassword } = useAdminAuth()
const { site, liveBroadcast, dataSource, loading, loadSpinData, reloadSpinData } = useSpinData()
const { isDark, applyTheme } = useTheme()

const sidebarOpen = ref(false)
const refreshing = ref(false)
const showPasswordModal = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)
const passwordFeedback = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

function openPasswordModal() {
  newPassword.value = ''
  confirmPassword.value = ''
  passwordFeedback.value = null
  showPasswordModal.value = true
}

async function handleUpdatePassword() {
  passwordFeedback.value = null
  if (newPassword.value.length < 8) {
    passwordFeedback.value = { type: 'err', text: 'Password must be at least 8 characters.' }
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordFeedback.value = { type: 'err', text: 'Passwords do not match.' }
    return
  }
  savingPassword.value = true
  try {
    const res = await updatePassword(newPassword.value)
    if (!res.ok) {
      passwordFeedback.value = { type: 'err', text: res.error || 'Unable to update password.' }
      return
    }
    passwordFeedback.value = { type: 'ok', text: 'Password updated successfully.' }
    newPassword.value = ''
    confirmPassword.value = ''
  } finally {
    savingPassword.value = false
  }
}

const navItems = [
  { label: 'Live Broadcast', to: '/admin', icon: Radio, exact: true },
  { label: 'Site & URLs', to: '/admin/site', icon: Globe, exact: false },
  { label: 'Media Hub', to: '/admin/media', icon: Film, exact: false },
  { label: 'Weekly Shows', to: '/admin/shows', icon: CalendarClock, exact: false },
  { label: 'News, Leaders & CMS', to: '/admin/content', icon: Layers, exact: false },
]

function isNavActive(to: string, exact: boolean): boolean {
  return exact ? route.path === to : route.path.startsWith(to)
}

async function handleRefresh() {
  refreshing.value = true
  try {
    await reloadSpinData()
  } finally {
    refreshing.value = false
  }
}

async function handleSignOut() {
  await signOut()
  await router.replace('/admin/login')
}

onMounted(() => {
  void loadSpinData()
})
</script>

<template>
  <div
    class="flex min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-[#070B14] dark:text-slate-100"
  >
    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-68 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 dark:border-white/10 dark:bg-slate-900"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
        <RouterLink to="/admin" class="flex items-center gap-2.5" @click="sidebarOpen = false">
          <div class="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-900 ring-2 ring-crimson/30">
            <img
              :src="site?.logoUrl || '/images/spin-logo.jpg'"
              alt="SPIN Media TV"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <p class="font-display truncate text-sm font-extrabold tracking-tight">SPIN Admin</p>
            <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">Broadcast &amp; CMS</p>
          </div>
        </RouterLink>

        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-white/10"
          aria-label="Close sidebar"
          @click="sidebarOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 p-3" aria-label="Admin Navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition"
          :class="
            isNavActive(item.to, item.exact)
              ? 'bg-crimson text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-white'
          "
          @click="sidebarOpen = false"
        >
          <span class="flex items-center gap-2.5">
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </span>
          <span
            v-if="item.to === '/admin' && liveBroadcast?.isLive"
            class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
            :class="
              isNavActive(item.to, item.exact)
                ? 'bg-white/20 text-white'
                : 'bg-crimson/12 text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright'
            "
          >
            <span class="h-1.5 w-1.5 animate-ping rounded-full bg-current" />
            Live
          </span>
        </RouterLink>
      </nav>

      <div class="space-y-3 border-t border-slate-200 p-4 dark:border-white/10">
        <div class="rounded-xl bg-slate-50 p-3 text-xs dark:bg-white/5">
          <p class="font-semibold text-slate-800 dark:text-slate-200">
            {{ adminProfile?.displayName || 'Authorized Admin' }}
          </p>
          <p class="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {{ adminProfile?.email }}
          </p>
        </div>

        <!-- Gene - Nov, 28, 2026: Change Password trigger button in admin sidebar -->
        <button
          type="button"
          class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          @click="openPasswordModal"
        >
          <KeyRound class="h-3.5 w-3.5" />
          Change Password
        </button>

        <button
          type="button"
          class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-500/40 hover:text-crimson dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
          @click="handleSignOut"
        >
          <LogOut class="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-white/10 dark:bg-slate-900/90"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            aria-label="Open menu"
            @click="sidebarOpen = true"
          >
            <Menu class="h-4 w-4" />
          </button>

          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
            :class="
              dataSource === 'supabase'
                ? 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
            "
          >
            <span class="h-1.5 w-1.5 rounded-full bg-current" />
            {{ dataSource === 'supabase' ? 'Supabase Live' : 'Static JSON Fallback' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="refreshing || loading"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            @click="handleRefresh"
          >
            <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': refreshing || loading }" />
            <span class="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            type="button"
            class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-amber-300"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="applyTheme(!isDark)"
          >
            <Sun v-if="isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </button>

          <RouterLink
            to="/"
            target="_blank"
            class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <span>View Public Site</span>
            <ExternalLink class="h-3.5 w-3.5" />
          </RouterLink>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>

    <!-- Gene - Nov, 28, 2026: Lightweight modal for updating admin password inside /admin -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      @click.self="showPasswordModal = false"
    >
      <form
        class="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"
        @submit.prevent="handleUpdatePassword"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">Change Admin Password</h2>
          <button
            type="button"
            class="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Close password modal"
            @click="showPasswordModal = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div
          v-if="passwordFeedback"
          class="flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold"
          :class="
            passwordFeedback.type === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
          "
        >
          <CheckCircle2 v-if="passwordFeedback.type === 'ok'" class="h-4 w-4 shrink-0" />
          <span>{{ passwordFeedback.text }}</span>
        </div>

        <div>
          <label class="mb-1 block text-xs font-bold uppercase">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            minlength="8"
            required
            autocomplete="new-password"
            placeholder="Minimum 8 characters"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Confirm New Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            minlength="8"
            required
            autocomplete="new-password"
            placeholder="Re-enter new password"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold dark:border-white/15"
            @click="showPasswordModal = false"
          >
            Close
          </button>
          <button
            type="submit"
            :disabled="savingPassword"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white hover:bg-crimson-dark disabled:opacity-50"
          >
            {{ savingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
