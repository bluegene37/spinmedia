<script setup lang="ts">
// Gene - Nov, 28, 2026: Hidden /admin sign-in screen backed by Supabase Auth + admin_users allowlist
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-vue-next'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { useSpinData } from '@/composables/useSpinData'

const route = useRoute()
const router = useRouter()
const { site } = useSpinData()
const { signIn, authLoading, authError, isSupabaseConfigured } = useAdminAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const localError = ref<string | null>(null)

async function handleSubmit() {
  localError.value = null
  if (!email.value.trim() || !password.value) {
    localError.value = 'Enter both your admin email and password.'
    return
  }

  const ok = await signIn(email.value, password.value)
  if (ok) {
    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    await router.replace(redirectPath.startsWith('/admin') ? redirectPath : '/admin')
  }
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12 text-slate-900 dark:bg-[#070B14] dark:text-slate-100"
  >
    <div class="w-full max-w-md space-y-6">
      <div class="flex flex-col items-center text-center">
        <div
          class="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 shadow-md ring-2 ring-crimson/30"
        >
          <img
            :src="site?.logoUrl || '/images/spin-logo.jpg'"
            alt="SPIN Media TV Philippines"
            class="h-full w-full object-cover"
          />
        </div>
        <div
          class="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-[11px] font-bold tracking-wider text-crimson uppercase dark:bg-crimson-bright/15 dark:text-crimson-bright"
        >
          <ShieldCheck class="h-3.5 w-3.5" />
          Newsroom Admin Desk
        </div>
        <h1 class="font-display mt-3 text-2xl font-extrabold tracking-tight">
          SPIN Media Control Console
        </h1>
        <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Authorized broadcast editors only. The public portal remains accessible without login.
        </p>
      </div>

      <div
        v-if="!isSupabaseConfigured"
        class="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      >
        <p class="font-bold">Supabase Environment Variables Required</p>
        <p class="mt-1 leading-relaxed">
          Set <code class="font-mono">VITE_SUPABASE_URL</code> and
          <code class="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> in Vercel (or local
          <code class="font-mono">.env.local</code>) and run
          <code class="font-mono">supabase/migrations/001_initial_schema.sql</code> to enable admin
          authentication.
        </p>
      </div>

      <form
        class="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/90"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="localError || authError"
          class="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300"
        >
          <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
          <span>{{ localError || authError }}</span>
        </div>

        <div>
          <label
            for="admin-email"
            class="mb-1.5 block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
          >
            Admin Email
          </label>
          <input
            id="admin-email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            placeholder="admin@spinmediatv.ph"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition outline-none focus:border-crimson focus:bg-white focus:ring-2 focus:ring-crimson/20 dark:border-white/15 dark:bg-slate-950 dark:text-white dark:focus:border-crimson-bright"
          />
        </div>

        <div>
          <label
            for="admin-password"
            class="mb-1.5 block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
          >
            Password
          </label>
          <div class="relative">
            <input
              id="admin-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              placeholder="Enter admin password"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition outline-none focus:border-crimson focus:bg-white focus:ring-2 focus:ring-crimson/20 dark:border-white/15 dark:bg-slate-950 dark:text-white dark:focus:border-crimson-bright"
            />
            <button
              type="button"
              class="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-lg p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="authLoading || !isSupabaseConfigured"
          class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-crimson px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-crimson-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Lock class="h-4 w-4" />
          {{ authLoading ? 'Signing in...' : 'Sign In to Admin Desk' }}
        </button>
      </form>

      <div class="text-center">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-crimson dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft class="h-3.5 w-3.5" />
          Back to SPIN Media TV Public Site
        </RouterLink>
      </div>
    </div>
  </div>
</template>
