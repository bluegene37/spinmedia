<script setup lang="ts">
// Gene - Nov, 28, 2026: Super Admin panel for managing admin users, roles, and password setup/resets
import { onMounted, reactive, ref } from 'vue'
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-vue-next'
import { useAdminAuth } from '@/composables/useAdminAuth'
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
} from '@/services/adminService'
import type { AdminRole, AdminUserRecord } from '@/types/spin'

const { adminProfile } = useAdminAuth()

const usersList = ref<AdminUserRecord[]>([])
const loading = ref(true)
const saving = ref(false)
const statusMessage = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

// One-time in-memory credentials banner shown right after user creation or password reset
const shareableCredentials = ref<{
  email: string
  role: AdminRole
  password: string
  label: string
} | null>(null)
const showSharePassword = ref(false)
const copiedShare = ref(false)

// Add User modal/panel
const showAddForm = ref(false)
const showAddPassword = ref(false)
const addForm = reactive({
  email: '',
  displayName: '',
  role: 'editor' as AdminRole,
  password: '',
})

// Edit Role / Display Name modal
const editingUser = ref<AdminUserRecord | null>(null)
const editForm = reactive({
  displayName: '',
  role: 'editor' as AdminRole,
})

// Set New Password modal
const passwordTargetUser = ref<AdminUserRecord | null>(null)
const resetPasswordValue = ref('')
const showResetPassword = ref(false)

function generateStrongPassword(length = 16): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const symbols = '!@#$%&*_-'
  const all = upper + lower + digits + symbols
  const bytes = new Uint32Array(length)
  window.crypto.getRandomValues(bytes)

  const chars: string[] = [
    upper[(bytes[0] ?? 0) % upper.length] ?? 'A',
    lower[(bytes[1] ?? 0) % lower.length] ?? 'a',
    digits[(bytes[2] ?? 0) % digits.length] ?? '7',
    symbols[(bytes[3] ?? 0) % symbols.length] ?? '!',
  ]
  for (let i = 4; i < length; i++) {
    chars.push(all[(bytes[i] ?? 0) % all.length] ?? 'x')
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = (bytes[i] ?? 0) % (i + 1)
    const tmp = chars[i]!
    chars[i] = chars[j]!
    chars[j] = tmp
  }
  return chars.join('')
}

function roleLabel(role: AdminRole): string {
  if (role === 'super_admin') return 'Super Admin'
  if (role === 'admin') return 'Admin'
  return 'Editor'
}

function roleBadgeClass(role: AdminRole): string {
  if (role === 'super_admin') {
    return 'bg-crimson/12 text-crimson dark:bg-crimson-bright/20 dark:text-crimson-bright'
  }
  if (role === 'admin') {
    return 'bg-sky-500/12 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
  }
  return 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-slate-300'
}

function formatDate(iso?: string): string {
  if (!iso) return 'Never'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function superAdminCount(): number {
  return usersList.value.filter((u) => u.role === 'super_admin').length
}

function isSoleSuperAdmin(user: AdminUserRecord): boolean {
  return user.role === 'super_admin' && superAdminCount() <= 1
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedShare.value = true
    setTimeout(() => {
      copiedShare.value = false
    }, 2000)
  } catch {
    statusMessage.value = { type: 'err', text: 'Unable to copy to clipboard.' }
  }
}

async function loadUsers() {
  loading.value = true
  try {
    usersList.value = await fetchAdminUsers()
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to load admin users.',
    }
  } finally {
    loading.value = false
  }
}

function openAddForm() {
  addForm.email = ''
  addForm.displayName = ''
  addForm.role = 'editor'
  addForm.password = generateStrongPassword()
  showAddPassword.value = true
  showAddForm.value = true
}

async function handleCreateUser() {
  statusMessage.value = null
  if (!addForm.email.trim() || addForm.password.length < 8) {
    statusMessage.value = {
      type: 'err',
      text: 'Valid email and at least an 8-character password are required.',
    }
    return
  }

  saving.value = true
  try {
    const plainPassword = addForm.password
    const created = await createAdminUser({
      email: addForm.email.trim(),
      displayName: addForm.displayName.trim() || 'SPIN Media Editor',
      role: addForm.role,
      password: plainPassword,
    })

    shareableCredentials.value = {
      email: created.email,
      role: created.role,
      password: plainPassword,
      label: 'New User Credentials Ready',
    }
    showSharePassword.value = false
    showAddForm.value = false
    await loadUsers()
    statusMessage.value = {
      type: 'ok',
      text: `Created ${created.email} (${roleLabel(created.role)}).`,
    }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to create user.',
    }
  } finally {
    saving.value = false
  }
}

function openEditModal(user: AdminUserRecord) {
  editingUser.value = user
  editForm.displayName = user.displayName
  editForm.role = user.role
}

async function handleSaveEdit() {
  if (!editingUser.value) return
  statusMessage.value = null
  saving.value = true
  try {
    const updated = await updateAdminUser({
      userId: editingUser.value.userId,
      displayName: editForm.displayName.trim(),
      role: editForm.role,
    })
    editingUser.value = null
    await loadUsers()
    statusMessage.value = {
      type: 'ok',
      text: `Updated ${updated.email} to ${roleLabel(updated.role)}.`,
    }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to update user.',
    }
  } finally {
    saving.value = false
  }
}

function openResetPasswordModal(user: AdminUserRecord) {
  passwordTargetUser.value = user
  resetPasswordValue.value = generateStrongPassword()
  showResetPassword.value = true
}

async function handleSaveResetPassword() {
  if (!passwordTargetUser.value) return
  if (resetPasswordValue.value.length < 8) {
    statusMessage.value = { type: 'err', text: 'Password must be at least 8 characters.' }
    return
  }
  statusMessage.value = null
  saving.value = true
  try {
    const target = passwordTargetUser.value
    const plainPassword = resetPasswordValue.value
    await updateAdminUser({
      userId: target.userId,
      password: plainPassword,
    })

    shareableCredentials.value = {
      email: target.email,
      role: target.role,
      password: plainPassword,
      label: 'Updated User Password Ready',
    }
    showSharePassword.value = false
    passwordTargetUser.value = null
    statusMessage.value = {
      type: 'ok',
      text: `Updated password for ${target.email}.`,
    }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to update password.',
    }
  } finally {
    saving.value = false
  }
}

async function handleDeleteUser(user: AdminUserRecord) {
  if (user.userId === adminProfile.value?.userId || isSoleSuperAdmin(user)) return
  if (!window.confirm(`Remove admin access and delete user "${user.email}"?`)) return

  statusMessage.value = null
  try {
    await deleteAdminUser(user.userId)
    await loadUsers()
    statusMessage.value = { type: 'ok', text: `Removed ${user.email}.` }
  } catch (err) {
    statusMessage.value = {
      type: 'err',
      text: err instanceof Error ? err.message : 'Unable to remove user.',
    }
  }
}

onMounted(() => {
  void loadUsers()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-extrabold tracking-tight">Users &amp; Roles</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Add authorized editors, assign roles, or set a new password for any team member.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-crimson-dark"
        @click="openAddForm"
      >
        <Plus class="h-4 w-4" />
        Add Admin User
      </button>
    </div>

    <!-- Role Permissions Legend -->
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs dark:border-white/10 dark:bg-slate-900">
        <p class="font-bold text-crimson dark:text-crimson-bright">Super Admin</p>
        <p class="mt-1 text-slate-600 dark:text-slate-400">
          Full access including Users &amp; Roles management, Site &amp; URLs, Live, and CMS.
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs dark:border-white/10 dark:bg-slate-900">
        <p class="font-bold text-sky-700 dark:text-sky-300">Admin</p>
        <p class="mt-1 text-slate-600 dark:text-slate-400">
          Manages Live Broadcast, Site &amp; URLs, Media Hub, Weekly Shows, and CMS content.
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs dark:border-white/10 dark:bg-slate-900">
        <p class="font-bold text-slate-800 dark:text-slate-200">Editor</p>
        <p class="mt-1 text-slate-600 dark:text-slate-400">
          Manages Live Broadcast, Media Hub, Weekly Shows, Good News, Leaders, Gallery &amp; Jobs.
        </p>
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
      <ShieldAlert v-else class="h-4 w-4 shrink-0" />
      <span>{{ statusMessage.text }}</span>
    </div>

    <!-- One-time Shareable Credentials Banner (in-memory only) -->
    <section
      v-if="shareableCredentials"
      class="space-y-3 rounded-3xl border border-emerald-500/35 bg-emerald-50 p-5 text-xs dark:bg-emerald-950/30"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-display text-base font-bold text-emerald-900 dark:text-emerald-200">
            {{ shareableCredentials.label }}
          </p>
          <p class="mt-0.5 text-emerald-800/85 dark:text-emerald-300/90">
            Supabase hashes passwords on save, so copy or reveal this password now before
            dismissing.
          </p>
        </div>
        <button
          type="button"
          class="cursor-pointer rounded-lg p-1 text-emerald-800 hover:bg-emerald-500/15 dark:text-emerald-200"
          aria-label="Dismiss credentials banner"
          @click="shareableCredentials = null"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="grid gap-3 rounded-2xl bg-white/85 p-3.5 sm:grid-cols-3 dark:bg-slate-900/90">
        <div>
          <p class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Email</p>
          <p class="mt-0.5 font-mono text-xs font-semibold">{{ shareableCredentials.email }}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Role</p>
          <p class="mt-0.5 text-xs font-semibold">{{ roleLabel(shareableCredentials.role) }}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Password</p>
          <div class="mt-0.5 flex items-center gap-1.5">
            <code class="font-mono text-xs font-bold">
              {{ showSharePassword ? shareableCredentials.password : '••••••••••••••••' }}
            </code>
            <button
              type="button"
              class="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              :aria-label="showSharePassword ? 'Hide password' : 'Show password'"
              @click="showSharePassword = !showSharePassword"
            >
              <EyeOff v-if="showSharePassword" class="h-3.5 w-3.5" />
              <Eye v-else class="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-white dark:text-slate-950"
              @click="copyText(shareableCredentials.password)"
            >
              <Check v-if="copiedShare" class="h-3 w-3" />
              <Copy v-else class="h-3 w-3" />
              <span>{{ copiedShare ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Add User Form -->
    <section
      v-if="showAddForm"
      class="space-y-4 rounded-3xl border border-crimson/25 bg-white p-6 shadow-md dark:border-crimson-bright/30 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-bold">Create New Admin User</h2>
        <button
          type="button"
          class="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          @click="showAddForm = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Email *</label>
          <input
            v-model="addForm.email"
            type="email"
            required
            placeholder="editor@spinmediatv.ph"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Display Name</label>
          <input
            v-model="addForm.displayName"
            type="text"
            placeholder="Newsroom Editor"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Role *</label>
          <select
            v-model="addForm.role"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      <div>
        <div class="mb-1 flex items-center justify-between gap-2">
          <label class="text-xs font-bold uppercase">Initial Password * (Min 8 chars)</label>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-crimson hover:underline dark:text-crimson-bright"
            @click="
              addForm.password = generateStrongPassword();
              showAddPassword = true;
            "
          >
            <RefreshCw class="h-3 w-3" />
            Generate Strong Password
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <div class="relative min-w-60 flex-1">
            <input
              v-model="addForm.password"
              :type="showAddPassword ? 'text' : 'password'"
              minlength="8"
              autocomplete="new-password"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pr-10 pl-3.5 font-mono text-sm dark:border-white/15 dark:bg-slate-950"
            />
            <button
              type="button"
              class="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-lg p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              :aria-label="showAddPassword ? 'Hide password' : 'Show password'"
              @click="showAddPassword = !showAddPassword"
            >
              <EyeOff v-if="showAddPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold dark:border-white/15"
            @click="showAddForm = false"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white hover:bg-crimson-dark disabled:opacity-50"
            @click="handleCreateUser"
          >
            {{ saving ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Security Transparency Note -->
    <div
      class="flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
    >
      <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-crimson dark:text-crimson-bright" />
      <span>
        Supabase Auth one-way hashes passwords (existing passwords are never stored in plaintext).
        Use the eye toggle when creating a user or click <strong>Set Password</strong> on any user
        to assign and view a new password.
      </span>
    </div>

    <!-- Users List -->
    <div
      class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading admin users...</div>
      <div v-else-if="usersList.length === 0" class="p-8 text-center text-sm text-slate-500">
        No admin users found.
      </div>
      <div v-else class="divide-y divide-slate-100 dark:divide-white/8">
        <div
          v-for="member in usersList"
          :key="member.userId"
          class="flex flex-wrap items-center justify-between gap-4 p-4"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-bold text-slate-900 dark:text-white">
                {{ member.displayName || member.email }}
              </span>
              <span
                class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                :class="roleBadgeClass(member.role)"
              >
                {{ roleLabel(member.role) }}
              </span>
              <span
                v-if="member.userId === adminProfile?.userId"
                class="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-slate-950"
              >
                You
              </span>
            </div>
            <p class="mt-0.5 truncate font-mono text-xs text-slate-600 dark:text-slate-400">
              {{ member.email }}
            </p>
            <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Last sign-in: {{ formatDate(member.lastSignInAt) }}
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap items-center gap-1.5">
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              @click="openResetPasswordModal(member)"
            >
              <KeyRound class="h-3.5 w-3.5" />
              <span>Set Password</span>
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Edit user role and name"
              @click="openEditModal(member)"
            >
              <Pencil class="h-4 w-4" />
            </button>
            <button
              type="button"
              :disabled="member.userId === adminProfile?.userId || isSoleSuperAdmin(member)"
              :title="
                member.userId === adminProfile?.userId
                  ? 'You cannot remove your own account'
                  : isSoleSuperAdmin(member)
                    ? 'Cannot remove the last Super Admin'
                    : 'Remove user'
              "
              class="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Remove user"
              @click="handleDeleteUser(member)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Role / Name Modal -->
    <div
      v-if="editingUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      @click.self="editingUser = null"
    >
      <form
        class="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"
        @submit.prevent="handleSaveEdit"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">Edit Role &amp; Name</h2>
          <button
            type="button"
            class="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            @click="editingUser = null"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <p class="truncate font-mono text-xs text-slate-500">{{ editingUser.email }}</p>

        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Display Name</label>
          <input
            v-model="editForm.displayName"
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-950"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-bold uppercase">Role</label>
          <select
            v-model="editForm.role"
            :disabled="isSoleSuperAdmin(editingUser)"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-60 dark:border-white/15 dark:bg-slate-950"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <p v-if="isSoleSuperAdmin(editingUser)" class="mt-1 text-[11px] text-amber-600">
            Assign another Super Admin before demoting this account.
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold dark:border-white/15"
            @click="editingUser = null"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white hover:bg-crimson-dark disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Role' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Set New Password Modal (with Eye Toggle) -->
    <div
      v-if="passwordTargetUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      @click.self="passwordTargetUser = null"
    >
      <form
        class="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"
        @submit.prevent="handleSaveResetPassword"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold">Set New Password</h2>
          <button
            type="button"
            class="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            @click="passwordTargetUser = null"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <p class="truncate font-mono text-xs text-slate-500">{{ passwordTargetUser.email }}</p>

        <div>
          <div class="mb-1 flex items-center justify-between gap-2">
            <label class="text-xs font-bold uppercase">New Password</label>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-crimson hover:underline dark:text-crimson-bright"
              @click="
                resetPasswordValue = generateStrongPassword();
                showResetPassword = true;
              "
            >
              <RefreshCw class="h-3 w-3" />
              Generate
            </button>
          </div>
          <div class="relative">
            <input
              v-model="resetPasswordValue"
              :type="showResetPassword ? 'text' : 'password'"
              minlength="8"
              required
              autocomplete="new-password"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pr-10 pl-3.5 font-mono text-sm dark:border-white/15 dark:bg-slate-950"
            />
            <button
              type="button"
              class="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-lg p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              :aria-label="showResetPassword ? 'Hide password' : 'Show password'"
              @click="showResetPassword = !showResetPassword"
            >
              <EyeOff v-if="showResetPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            class="cursor-pointer rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold dark:border-white/15"
            @click="passwordTargetUser = null"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="cursor-pointer rounded-xl bg-crimson px-4 py-2 text-xs font-bold text-white hover:bg-crimson-dark disabled:opacity-50"
          >
            {{ saving ? 'Updating...' : 'Set Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
