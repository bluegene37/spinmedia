// Gene - Nov, 28, 2026: Singleton Supabase admin authentication and allowlist verification composable
import { computed, ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { AdminUserProfile } from '@/types/spin'

const user = ref<User | null>(null)
const adminProfile = ref<AdminUserProfile | null>(null)
const authLoading = ref(false)
const authReady = ref(false)
const authError = ref<string | null>(null)

let initPromise: Promise<void> | null = null
let listenerRegistered = false

async function fetchAdminProfile(targetUser: User | null): Promise<AdminUserProfile | null> {
  if (!targetUser || !supabase) return null
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id, email, display_name, role')
    .eq('user_id', targetUser.id)
    .maybeSingle()

  if (error || !data) return null

  return {
    userId: data.user_id,
    email: data.email,
    displayName: data.display_name ?? undefined,
    role: data.role as AdminUserProfile['role'],
  }
}

async function applySessionUser(sessionUser: User | null): Promise<void> {
  if (!sessionUser) {
    user.value = null
    adminProfile.value = null
    return
  }

  const profile = await fetchAdminProfile(sessionUser)
  if (!profile) {
    if (supabase) {
      await supabase.auth.signOut()
    }
    user.value = null
    adminProfile.value = null
    return
  }

  user.value = sessionUser
  adminProfile.value = profile
}

export function useAdminAuth() {
  const isAdmin = computed(() => Boolean(user.value && adminProfile.value))
  // Gene - Nov, 28, 2026: Role-based permission computeds for /admin/users and /admin/site gating
  const isSuperAdmin = computed(() => adminProfile.value?.role === 'super_admin')
  const canManageSite = computed(
    () => adminProfile.value?.role === 'super_admin' || adminProfile.value?.role === 'admin',
  )
  // Gene - Nov, 28, 2026: Allow admin and super_admin to access /admin/users (scoped server-side)
  const canManageUsers = computed(
    () => adminProfile.value?.role === 'super_admin' || adminProfile.value?.role === 'admin',
  )

  const initAdminAuth = async (): Promise<void> => {
    if (!isSupabaseConfigured || !supabase) {
      authReady.value = true
      return
    }
    if (authReady.value) return
    if (initPromise) return initPromise

    initPromise = (async () => {
      authLoading.value = true
      try {
        const { data } = await supabase.auth.getSession()
        await applySessionUser(data.session?.user ?? null)

        if (!listenerRegistered) {
          listenerRegistered = true
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session?.user) {
              user.value = null
              adminProfile.value = null
              return
            }
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
              void applySessionUser(session.user)
            }
          })
        }
      } catch (err) {
        authError.value = err instanceof Error ? err.message : 'Unable to check admin session.'
      } finally {
        authLoading.value = false
        authReady.value = true
      }
    })()

    return initPromise
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    authError.value = null
    if (!isSupabaseConfigured || !supabase) {
      authError.value =
        'Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY first.'
      return false
    }

    authLoading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error || !data.user) {
        authError.value = error?.message ?? 'Invalid admin email or password.'
        return false
      }

      const profile = await fetchAdminProfile(data.user)
      if (!profile) {
        await supabase.auth.signOut()
        user.value = null
        adminProfile.value = null
        authError.value =
          'This account signed in, but is not listed in public.admin_users. Add its user_id in Supabase SQL Editor.'
        return false
      }

      user.value = data.user
      adminProfile.value = profile
      authReady.value = true
      return true
    } catch (err) {
      authError.value = err instanceof Error ? err.message : 'Sign-in failed.'
      return false
    } finally {
      authLoading.value = false
    }
  }

  const signOut = async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    user.value = null
    adminProfile.value = null
    authError.value = null
  }

  // Gene - Nov, 28, 2026: Allow signed-in admin to change their temporary/current password from /admin
  const updatePassword = async (newPassword: string): Promise<{ ok: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, error: 'Supabase is not configured.' }
    }
    if (newPassword.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters long.' }
    }
    authLoading.value = true
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        return { ok: false, error: error.message }
      }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Unable to update password.' }
    } finally {
      authLoading.value = false
    }
  }

  /*
  return {
    user,
    adminProfile,
    isAdmin,
    isSupabaseConfigured,
    authLoading,
    authReady,
    authError,
    initAdminAuth,
    signIn,
    signOut,
  }
  */
  /*
  // Gene - Nov, 28, 2026: Expose updatePassword alongside existing auth methods
  return {
    user,
    adminProfile,
    isAdmin,
    isSupabaseConfigured,
    authLoading,
    authReady,
    authError,
    initAdminAuth,
    signIn,
    signOut,
    updatePassword,
  }
  */
  /*
  // Gene - Nov, 28, 2026: Expose isSuperAdmin and canManageSite permission computeds
  return {
    user,
    adminProfile,
    isAdmin,
    isSuperAdmin,
    canManageSite,
    isSupabaseConfigured,
    authLoading,
    authReady,
    authError,
    initAdminAuth,
    signIn,
    signOut,
    updatePassword,
  }
  */
  // Gene - Nov, 28, 2026: Expose canManageUsers alongside existing auth helpers
  return {
    user,
    adminProfile,
    isAdmin,
    isSuperAdmin,
    canManageSite,
    canManageUsers,
    isSupabaseConfigured,
    authLoading,
    authReady,
    authError,
    initAdminAuth,
    signIn,
    signOut,
    updatePassword,
  }
}
