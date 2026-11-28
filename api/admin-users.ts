// Gene - Nov, 28, 2026: Server-side super_admin user & role management API (Vercel Function + Vite dev handler)
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type AdminRole = 'super_admin' | 'admin' | 'editor'
const VALID_ROLES = new Set<AdminRole>(['super_admin', 'admin', 'editor'])

interface EnvOverrides {
  supabaseUrl?: string
  serviceRoleKey?: string
}

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function getAdminClient(envOverrides?: EnvOverrides): SupabaseClient | null {
  const supabaseUrl = (
    envOverrides?.supabaseUrl ||
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  ).trim()

  const serviceRoleKey = (
    envOverrides?.serviceRoleKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim()

  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/*
async function requireSuperAdmin(
  request: Request,
  adminClient: SupabaseClient,
): Promise<{ callerId: string } | { errorResponse: Response }> {
  const authHeader = request.headers.get('authorization') || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  const token = match?.[1]?.trim()
  if (!token) {
    return { errorResponse: jsonResponse({ error: 'Missing Authorization bearer token.' }, 401) }
  }

  const { data: userData, error: userErr } = await adminClient.auth.getUser(token)
  if (userErr || !userData.user) {
    return { errorResponse: jsonResponse({ error: 'Invalid or expired admin session.' }, 401) }
  }

  const { data: adminRow, error: adminErr } = await adminClient
    .from('admin_users')
    .select('user_id, role')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (adminErr || !adminRow || adminRow.role !== 'super_admin') {
    return {
      errorResponse: jsonResponse({ error: 'Super Admin access is required for user management.' }, 403),
    }
  }

  return { callerId: userData.user.id }
}
*/
// Gene - Nov, 28, 2026: Allow super_admin and admin roles into user management (admins restricted to editor accounts)
async function requireUserManager(
  request: Request,
  adminClient: SupabaseClient,
): Promise<{ callerId: string; callerRole: 'super_admin' | 'admin' } | { errorResponse: Response }> {
  const authHeader = request.headers.get('authorization') || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  const token = match?.[1]?.trim()
  if (!token) {
    return { errorResponse: jsonResponse({ error: 'Missing Authorization bearer token.' }, 401) }
  }

  const { data: userData, error: userErr } = await adminClient.auth.getUser(token)
  if (userErr || !userData.user) {
    return { errorResponse: jsonResponse({ error: 'Invalid or expired admin session.' }, 401) }
  }

  const { data: adminRow, error: adminErr } = await adminClient
    .from('admin_users')
    .select('user_id, role')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (
    adminErr ||
    !adminRow ||
    (adminRow.role !== 'super_admin' && adminRow.role !== 'admin')
  ) {
    return {
      errorResponse: jsonResponse(
        { error: 'Admin or Super Admin privileges are required for user management.' },
        403,
      ),
    }
  }

  return {
    callerId: userData.user.id,
    callerRole: adminRow.role as 'super_admin' | 'admin',
  }
}

async function countSuperAdmins(adminClient: SupabaseClient): Promise<number> {
  const { count, error } = await adminClient
    .from('admin_users')
    .select('user_id', { count: 'exact', head: true })
    .eq('role', 'super_admin')
  if (error) throw new Error(error.message)
  return count ?? 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function handleAdminUsersRequest(
  request: Request,
  envOverrides?: EnvOverrides,
): Promise<Response> {
  const adminClient = getAdminClient(envOverrides)
  if (!adminClient) {
    return jsonResponse(
      {
        error:
          'Server-side SUPABASE_SERVICE_ROLE_KEY is not configured. Add SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables (without VITE_ prefix) and redeploy.',
      },
      503,
    )
  }

  /*
  const authCheck = await requireSuperAdmin(request, adminClient)
  if ('errorResponse' in authCheck) {
    return authCheck.errorResponse
  }
  */
  const authCheck = await requireUserManager(request, adminClient)
  if ('errorResponse' in authCheck) {
    return authCheck.errorResponse
  }

  const method = request.method.toUpperCase()

  try {
    if (method === 'GET') {
      const [{ data: adminRows, error: rowsErr }, { data: authList, error: listErr }] =
        await Promise.all([
          adminClient
            .from('admin_users')
            .select('user_id, email, display_name, role, created_at')
            .order('created_at', { ascending: true }),
          adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        ])

      if (rowsErr) return jsonResponse({ error: rowsErr.message }, 500)
      if (listErr) return jsonResponse({ error: listErr.message }, 500)

      const authMap = new Map(
        (authList?.users ?? []).map((u) => [
          u.id,
          {
            emailConfirmed: Boolean(u.email_confirmed_at),
            lastSignInAt: u.last_sign_in_at ?? undefined,
          },
        ]),
      )

      const users = (adminRows ?? []).map((row) => {
        const meta = authMap.get(String(row.user_id))
        return {
          userId: String(row.user_id),
          email: String(row.email),
          displayName: row.display_name ? String(row.display_name) : '',
          role: row.role as AdminRole,
          createdAt: String(row.created_at),
          emailConfirmed: meta?.emailConfirmed ?? false,
          lastSignInAt: meta?.lastSignInAt,
        }
      })

      return jsonResponse({ users }, 200)
    }

    if (method === 'POST') {
      const payload = (await request.json().catch(() => null)) as {
        email?: string
        displayName?: string
        role?: string
        password?: string
      } | null

      const email = payload?.email?.trim().toLowerCase() ?? ''
      const displayName = payload?.displayName?.trim() || 'SPIN Media Editor'
      const role = (payload?.role?.trim() ?? 'editor') as AdminRole
      const password = payload?.password ?? ''

      if (!isValidEmail(email)) {
        return jsonResponse({ error: 'Enter a valid email address.' }, 400)
      }
      if (!VALID_ROLES.has(role)) {
        return jsonResponse({ error: 'Invalid admin role selected.' }, 400)
      }
      // Gene - Nov, 28, 2026: Admins can only create editor accounts; super_admin can create any role
      if (authCheck.callerRole === 'admin' && role !== 'editor') {
        return jsonResponse(
          { error: 'Admins can only create Editor accounts. Only a Super Admin can create Admins.' },
          403,
        )
      }
      if (password.length < 8) {
        return jsonResponse({ error: 'Password must be at least 8 characters long.' }, 400)
      }

      let targetUserId = ''
      let createdEmail = email
      let emailConfirmed = true

      const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: displayName },
      })

      if (createErr) {
        const { data: listed } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
        const existingAuth = listed?.users.find((u) => (u.email || '').toLowerCase() === email)
        if (!existingAuth) {
          return jsonResponse({ error: createErr.message }, 400)
        }

        const { data: existingAdmin } = await adminClient
          .from('admin_users')
          .select('user_id')
          .eq('user_id', existingAuth.id)
          .maybeSingle()

        if (existingAdmin) {
          return jsonResponse({ error: 'An admin user with this email already exists.' }, 409)
        }

        const { data: updatedAuth, error: updErr } = await adminClient.auth.admin.updateUserById(
          existingAuth.id,
          {
            password,
            email_confirm: true,
            user_metadata: { display_name: displayName },
          },
        )
        if (updErr || !updatedAuth.user) {
          return jsonResponse({ error: updErr?.message || 'Unable to attach existing user.' }, 400)
        }
        targetUserId = updatedAuth.user.id
        createdEmail = updatedAuth.user.email || email
        emailConfirmed = Boolean(updatedAuth.user.email_confirmed_at)
      } else if (created.user) {
        targetUserId = created.user.id
        createdEmail = created.user.email || email
        emailConfirmed = Boolean(created.user.email_confirmed_at)
      }

      const { data: inserted, error: upsertErr } = await adminClient
        .from('admin_users')
        .upsert(
          {
            user_id: targetUserId,
            email: createdEmail,
            display_name: displayName,
            role,
          },
          { onConflict: 'user_id' },
        )
        .select('user_id, email, display_name, role, created_at')
        .single()

      if (upsertErr || !inserted) {
        return jsonResponse({ error: upsertErr?.message || 'Unable to save admin role.' }, 500)
      }

      return jsonResponse(
        {
          user: {
            userId: String(inserted.user_id),
            email: String(inserted.email),
            displayName: inserted.display_name ? String(inserted.display_name) : '',
            role: inserted.role as AdminRole,
            createdAt: String(inserted.created_at),
            emailConfirmed,
          },
        },
        201,
      )
    }

    if (method === 'PATCH') {
      const payload = (await request.json().catch(() => null)) as {
        userId?: string
        displayName?: string
        role?: string
        password?: string
      } | null

      const userId = payload?.userId?.trim() ?? ''
      if (!userId) {
        return jsonResponse({ error: 'userId is required.' }, 400)
      }

      const { data: existing, error: fetchErr } = await adminClient
        .from('admin_users')
        .select('user_id, email, display_name, role, created_at')
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchErr) return jsonResponse({ error: fetchErr.message }, 500)
      if (!existing) return jsonResponse({ error: 'Admin user not found.' }, 404)

      const nextRole = payload?.role ? (payload.role.trim() as AdminRole) : (existing.role as AdminRole)
      if (!VALID_ROLES.has(nextRole)) {
        return jsonResponse({ error: 'Invalid admin role.' }, 400)
      }

      // Gene - Nov, 28, 2026: Prevent admin role from modifying super_admin/admin rows or promoting above editor
      if (authCheck.callerRole === 'admin') {
        if (existing.role !== 'editor') {
          return jsonResponse({ error: 'Admins can only manage Editor accounts.' }, 403)
        }
        if (nextRole !== 'editor') {
          return jsonResponse({ error: 'Admins cannot promote accounts above Editor.' }, 403)
        }
      }

      if (existing.role === 'super_admin' && nextRole !== 'super_admin') {
        const superCount = await countSuperAdmins(adminClient)
        if (superCount <= 1) {
          return jsonResponse({ error: 'Cannot demote the last remaining Super Admin.' }, 400)
        }
      }

      const nextPassword = payload?.password
      if (nextPassword !== undefined && nextPassword !== '' && nextPassword.length < 8) {
        return jsonResponse({ error: 'New password must be at least 8 characters long.' }, 400)
      }

      const nextDisplayName =
        payload?.displayName !== undefined
          ? payload.displayName.trim() || null
          : existing.display_name

      const { data: updatedRow, error: updRowErr } = await adminClient
        .from('admin_users')
        .update({
          display_name: nextDisplayName,
          role: nextRole,
        })
        .eq('user_id', userId)
        .select('user_id, email, display_name, role, created_at')
        .single()

      if (updRowErr || !updatedRow) {
        return jsonResponse({ error: updRowErr?.message || 'Unable to update admin user.' }, 500)
      }

      if ((nextPassword && nextPassword.length >= 8) || payload?.displayName !== undefined) {
        const { error: updAuthErr } = await adminClient.auth.admin.updateUserById(userId, {
          ...(nextPassword && nextPassword.length >= 8 ? { password: nextPassword } : {}),
          ...(payload?.displayName !== undefined
            ? { user_metadata: { display_name: nextDisplayName } }
            : {}),
        })
        if (updAuthErr) {
          return jsonResponse({ error: updAuthErr.message }, 400)
        }
      }

      return jsonResponse(
        {
          user: {
            userId: String(updatedRow.user_id),
            email: String(updatedRow.email),
            displayName: updatedRow.display_name ? String(updatedRow.display_name) : '',
            role: updatedRow.role as AdminRole,
            createdAt: String(updatedRow.created_at),
          },
        },
        200,
      )
    }

    if (method === 'DELETE') {
      const url = new URL(request.url, 'http://localhost')
      let userId = url.searchParams.get('userId')?.trim() ?? ''
      if (!userId) {
        const payload = (await request.json().catch(() => null)) as { userId?: string } | null
        userId = payload?.userId?.trim() ?? ''
      }
      if (!userId) {
        return jsonResponse({ error: 'userId is required.' }, 400)
      }

      if (userId === authCheck.callerId) {
        return jsonResponse({ error: 'You cannot delete your own active account.' }, 400)
      }

      const { data: target, error: fetchErr } = await adminClient
        .from('admin_users')
        .select('user_id, role')
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchErr) return jsonResponse({ error: fetchErr.message }, 500)
      if (!target) return jsonResponse({ error: 'Admin user not found.' }, 404)

      // Gene - Nov, 28, 2026: Admins can only remove editor accounts
      if (authCheck.callerRole === 'admin' && target.role !== 'editor') {
        return jsonResponse({ error: 'Admins can only remove Editor accounts.' }, 403)
      }

      if (target.role === 'super_admin') {
        const superCount = await countSuperAdmins(adminClient)
        if (superCount <= 1) {
          return jsonResponse({ error: 'Cannot delete the last remaining Super Admin.' }, 400)
        }
      }

      const { error: delRowErr } = await adminClient
        .from('admin_users')
        .delete()
        .eq('user_id', userId)

      if (delRowErr) return jsonResponse({ error: delRowErr.message }, 500)

      const { error: delAuthErr } = await adminClient.auth.admin.deleteUser(userId)
      if (delAuthErr && !delAuthErr.message.toLowerCase().includes('not found')) {
        return jsonResponse({ error: delAuthErr.message }, 500)
      }

      return jsonResponse({ deleted: true, userId }, 200)
    }

    return jsonResponse({ error: `Method ${method} not allowed.` }, 405)
  } catch (err) {
    console.error('[api/admin-users] Unexpected error:', err)
    return jsonResponse(
      { error: err instanceof Error ? err.message : 'Unexpected server error.' },
      500,
    )
  }
}

export async function GET(request: Request): Promise<Response> {
  return handleAdminUsersRequest(request)
}

export async function POST(request: Request): Promise<Response> {
  return handleAdminUsersRequest(request)
}

export async function PATCH(request: Request): Promise<Response> {
  return handleAdminUsersRequest(request)
}

export async function DELETE(request: Request): Promise<Response> {
  return handleAdminUsersRequest(request)
}
