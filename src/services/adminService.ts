// Gene - Nov, 28, 2026: Authenticated Supabase CRUD and Storage upload helpers for /admin
import { SPIN_STORAGE_BUCKET, supabase } from '@/lib/supabase'
import {
  fetchGalleryData,
  fetchLeadersDirectory,
  fetchMediaItems,
  fetchPositiveNews,
  fetchShows,
} from '@/services/dataService'
import type {
  AdminRole,
  AdminUserRecord,
  DirectoryLeader,
  DirectoryLevel,
  GalleryAlbum,
  GalleryData,
  GallerySlide,
  LeaderLevelId,
  LiveBroadcastConfig,
  MediaItem,
  PositiveNewsItem,
  ShowProgram,
  SpinJobOpening,
} from '@/types/spin'

export type SiteSectionKey =
  | 'site'
  | 'about'
  | 'public_info'
  | 'initiatives'
  | 'gallery_meta'
  | 'leader_levels'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY first.',
    )
  }
  return supabase
}

function mapLiveBroadcastRow(row: Record<string, unknown> | null): LiveBroadcastConfig {
  return {
    id: String(row?.id ?? 'primary'),
    isLive: Boolean(row?.is_live),
    platform: (row?.platform as LiveBroadcastConfig['platform']) ?? 'youtube',
    title: String(row?.title ?? ''),
    subtitle: String(row?.subtitle ?? ''),
    streamUrl: String(row?.stream_url ?? ''),
    embedUrl: String(row?.embed_url ?? ''),
    showSlug: row?.show_slug ? String(row.show_slug) : undefined,
    showBanner: row?.show_banner !== false,
    autoEmbedOnHome: row?.auto_embed_on_home !== false,
    startedAt: row?.started_at ? String(row.started_at) : undefined,
    updatedAt: row?.updated_at ? String(row.updated_at) : undefined,
  }
}

export async function fetchAdminLiveBroadcast(): Promise<LiveBroadcastConfig> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('live_broadcasts')
    .select('*')
    .eq('id', 'primary')
    .maybeSingle()

  if (error) throw new Error(error.message)
  return mapLiveBroadcastRow((data as Record<string, unknown> | null) ?? null)
}

export async function saveLiveBroadcast(
  payload: Omit<LiveBroadcastConfig, 'id' | 'updatedAt'>,
): Promise<LiveBroadcastConfig> {
  const client = requireSupabase()
  const { data: userRes } = await client.auth.getUser()
  const nowIso = new Date().toISOString()

  const row = {
    id: 'primary',
    is_live: payload.isLive,
    platform: payload.platform,
    title: payload.title.trim(),
    subtitle: payload.subtitle.trim(),
    stream_url: payload.streamUrl.trim(),
    embed_url: payload.embedUrl.trim(),
    show_slug: payload.showSlug || null,
    show_banner: payload.showBanner,
    auto_embed_on_home: payload.autoEmbedOnHome,
    started_at: payload.isLive ? payload.startedAt || nowIso : null,
    updated_at: nowIso,
    updated_by: userRes.user?.id ?? null,
  }

  const { data, error } = await client
    .from('live_broadcasts')
    .upsert(row, { onConflict: 'id' })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return mapLiveBroadcastRow(data as Record<string, unknown>)
}

export async function saveSiteSection<T>(key: SiteSectionKey, data: T): Promise<void> {
  const client = requireSupabase()
  const { data: userRes } = await client.auth.getUser()

  const { error } = await client.from('site_sections').upsert(
    {
      key,
      data,
      updated_at: new Date().toISOString(),
      updated_by: userRes.user?.id ?? null,
    },
    { onConflict: 'key' },
  )

  if (error) throw new Error(error.message)
}

export async function fetchAdminMediaItems(): Promise<MediaItem[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('media_items')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) return fetchMediaItems()

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    platform: (row.platform as MediaItem['platform']) ?? 'youtube',
    format: (row.format as MediaItem['format']) ?? 'episode',
    title: String(row.title),
    summary: String(row.summary ?? ''),
    publishedAt: String(row.published_at ?? new Date().toISOString()),
    showSlug: String(row.show_slug ?? 'breaking-news'),
    showLabel: String(row.show_label ?? 'Daily & Global Dispatches'),
    videoId: row.video_id ? String(row.video_id) : undefined,
    externalUrl: String(row.external_url),
    embedUrl: row.embed_url ? String(row.embed_url) : undefined,
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    views: typeof row.views === 'number' ? row.views : undefined,
    featured: Boolean(row.featured),
    isPublished: row.is_published !== false,
  }))
}

export async function upsertMediaItem(item: MediaItem): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('media_items').upsert(
    {
      id: item.id,
      platform: item.platform,
      format: item.format,
      title: item.title.trim(),
      summary: item.summary.trim(),
      published_at: item.publishedAt || new Date().toISOString(),
      show_slug: item.showSlug || 'breaking-news',
      show_label: item.showLabel || 'Daily & Global Dispatches',
      video_id: item.videoId?.trim() || null,
      external_url: item.externalUrl.trim(),
      embed_url: item.embedUrl?.trim() || null,
      thumbnail_url: item.thumbnailUrl?.trim() || null,
      views: typeof item.views === 'number' && !Number.isNaN(item.views) ? item.views : null,
      featured: Boolean(item.featured),
      is_published: item.isPublished !== false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function deleteMediaItem(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('media_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminShows(): Promise<ShowProgram[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('shows')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) return fetchShows()

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: String(row.subtitle ?? ''),
    hosts: Array.isArray(row.hosts) ? (row.hosts as string[]) : [],
    director: row.director ? String(row.director) : undefined,
    dayOfWeek: Array.isArray(row.day_of_week) ? (row.day_of_week as number[]) : [],
    dayLabel: String(row.day_label ?? ''),
    timeLabel: String(row.time_label ?? ''),
    startHourPht: Number(row.start_hour_pht ?? 19),
    endHourPht: Number(row.end_hour_pht ?? 20),
    summary: String(row.summary ?? ''),
    accentColor: String(row.accent_color ?? 'crimson'),
    isActive: row.is_active !== false,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
  }))
}

export async function upsertShow(show: ShowProgram): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('shows').upsert(
    {
      id: show.id,
      slug: show.slug.trim(),
      title: show.title.trim(),
      subtitle: show.subtitle.trim(),
      hosts: show.hosts,
      director: show.director?.trim() || null,
      day_of_week: show.dayOfWeek,
      day_label: show.dayLabel.trim(),
      time_label: show.timeLabel.trim(),
      start_hour_pht: show.startHourPht,
      end_hour_pht: show.endHourPht,
      summary: show.summary.trim(),
      accent_color: show.accentColor || 'crimson',
      sort_order: show.sortOrder ?? 0,
      is_active: show.isActive !== false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function deleteShow(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('shows').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminPositiveNews(): Promise<PositiveNewsItem[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('positive_news')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) return fetchPositiveNews()

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    category: (row.category as PositiveNewsItem['category']) ?? 'community',
    categoryLabel: String(row.category_label ?? ''),
    title: String(row.title),
    summary: String(row.summary ?? ''),
    body: String(row.body ?? ''),
    location: String(row.location ?? ''),
    publishedAt: String(row.published_at ?? new Date().toISOString()),
    readTime: String(row.read_time ?? '3 min read'),
    highlightTag: String(row.highlight_tag ?? ''),
    accentColor: (row.accent_color as PositiveNewsItem['accentColor']) ?? 'crimson',
    relatedShowSlug: row.related_show_slug ? String(row.related_show_slug) : undefined,
    isPublished: row.is_published !== false,
  }))
}

export async function upsertPositiveNews(item: PositiveNewsItem): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('positive_news').upsert(
    {
      id: item.id,
      category: item.category,
      category_label: item.categoryLabel.trim(),
      title: item.title.trim(),
      summary: item.summary.trim(),
      body: item.body.trim(),
      location: item.location.trim(),
      published_at: item.publishedAt || new Date().toISOString(),
      read_time: item.readTime.trim() || '3 min read',
      highlight_tag: item.highlightTag.trim(),
      accent_color: item.accentColor,
      related_show_slug: item.relatedShowSlug || null,
      is_published: item.isPublished !== false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function deletePositiveNews(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('positive_news').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminLeaders(): Promise<DirectoryLevel[]> {
  const client = requireSupabase()
  const [sectionsRes, leadersRes] = await Promise.all([
    client.from('site_sections').select('data').eq('key', 'leader_levels').maybeSingle(),
    client.from('leaders').select('*').order('sort_order', { ascending: true }),
  ])

  if (leadersRes.error) throw new Error(leadersRes.error.message)
  if (!leadersRes.data || leadersRes.data.length === 0) return fetchLeadersDirectory()

  const levelHeaders =
    (sectionsRes.data?.data as Omit<DirectoryLevel, 'leaders'>[] | undefined) ??
    (await fetchLeadersDirectory()).map(({ leaders: _omit, ...level }) => level)

  const grouped = new Map<LeaderLevelId, DirectoryLeader[]>()
  for (const row of leadersRes.data as Record<string, unknown>[]) {
    const levelId = (row.level_id as LeaderLevelId) ?? 'regional'
    const bucket = grouped.get(levelId) ?? []
    bucket.push({
      id: String(row.id),
      name: String(row.name),
      role: String(row.role),
      areaLabel: String(row.area_label ?? ''),
      regionCode: row.region_code ? String(row.region_code) : undefined,
      islandGroup: (row.island_group as DirectoryLeader['islandGroup']) ?? undefined,
      roleTier: (row.role_tier as DirectoryLeader['roleTier']) ?? 'director',
      photoUrl: row.photo_url ? String(row.photo_url) : undefined,
      status: (row.status as DirectoryLeader['status']) ?? 'confirmed',
      bio: row.bio ? String(row.bio) : undefined,
      sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
    })
    grouped.set(levelId, bucket)
  }

  return levelHeaders.map((level) => ({
    ...level,
    leaders: grouped.get(level.id) ?? [],
  }))
}

export async function upsertLeader(
  levelId: LeaderLevelId,
  leader: DirectoryLeader,
  sortOrder = 0,
): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('leaders').upsert(
    {
      id: leader.id,
      level_id: levelId,
      name: leader.name.trim(),
      role: leader.role.trim(),
      area_label: leader.areaLabel.trim(),
      region_code: leader.regionCode?.trim() || null,
      island_group: leader.islandGroup || null,
      role_tier: leader.roleTier,
      photo_url: leader.photoUrl?.trim() || null,
      status: leader.status,
      bio: leader.bio?.trim() || null,
      sort_order: leader.sortOrder ?? sortOrder,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function deleteLeader(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('leaders').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminGallery(): Promise<GalleryData> {
  const client = requireSupabase()
  const [metaRes, albumsRes, slidesRes] = await Promise.all([
    client.from('site_sections').select('data').eq('key', 'gallery_meta').maybeSingle(),
    client.from('gallery_albums').select('*').order('sort_order', { ascending: true }),
    client.from('gallery_slides').select('*').order('sort_order', { ascending: true }),
  ])

  if (albumsRes.error) throw new Error(albumsRes.error.message)
  if (!albumsRes.data || albumsRes.data.length === 0) return fetchGalleryData()

  const fallbackMeta = await fetchGalleryData()
  const meta =
    (metaRes.data?.data as Omit<GalleryData, 'albums'> | undefined) ?? {
      presentationTitle: fallbackMeta.presentationTitle,
      presentationSubtitle: fallbackMeta.presentationSubtitle,
      eventDate: fallbackMeta.eventDate,
      eventVenue: fallbackMeta.eventVenue,
      themeVerse: fallbackMeta.themeVerse,
    }

  const slidesByAlbum = new Map<string, GallerySlide[]>()
  for (const row of (slidesRes.data ?? []) as Record<string, unknown>[]) {
    const albumId = String(row.album_id)
    const list = slidesByAlbum.get(albumId) ?? []
    list.push({
      id: String(row.id),
      slideNumber: Number(row.slide_number ?? 1),
      title: String(row.title),
      caption: String(row.caption ?? ''),
      category: (row.category as GallerySlide['category']) ?? 'gawad',
      imageUrl: String(row.image_url),
      tag: String(row.tag ?? ''),
    })
    slidesByAlbum.set(albumId, list)
  }

  return {
    ...meta,
    albums: (albumsRes.data as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      slotNumber: String(row.slot_number ?? '01'),
      title: String(row.title),
      category: (row.category as GalleryAlbum['category']) ?? 'gawad',
      categoryLabel: String(row.category_label ?? ''),
      description: String(row.description ?? ''),
      locationLabel: String(row.location_label ?? ''),
      dateLabel: String(row.date_label ?? ''),
      coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : undefined,
      featured: Boolean(row.featured),
      slides: slidesByAlbum.get(String(row.id)) ?? [],
    })),
  }
}

export async function upsertGalleryAlbum(
  album: Omit<GalleryAlbum, 'slides'>,
  sortOrder = 0,
): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('gallery_albums').upsert(
    {
      id: album.id,
      slot_number: album.slotNumber,
      title: album.title.trim(),
      category: album.category,
      category_label: album.categoryLabel.trim(),
      description: album.description.trim(),
      location_label: album.locationLabel.trim(),
      date_label: album.dateLabel.trim(),
      cover_image_url: album.coverImageUrl?.trim() || null,
      featured: Boolean(album.featured),
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function upsertGallerySlide(
  albumId: string,
  slide: GallerySlide,
  sortOrder = 0,
): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('gallery_slides').upsert(
    {
      id: slide.id,
      album_id: albumId,
      slide_number: slide.slideNumber,
      title: slide.title.trim(),
      caption: slide.caption.trim(),
      category: slide.category,
      image_url: slide.imageUrl.trim(),
      tag: slide.tag.trim(),
      sort_order: sortOrder || slide.slideNumber,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function deleteGallerySlide(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('gallery_slides').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminJobs(): Promise<SpinJobOpening[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('spin_jobs')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    department: String(row.department ?? ''),
    location: String(row.location ?? ''),
    employmentType: String(row.employment_type ?? 'Full-Time'),
    summary: String(row.summary ?? ''),
    applyUrl: row.apply_url ? String(row.apply_url) : undefined,
    isOpen: row.is_open !== false,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
  }))
}

export async function upsertJob(job: SpinJobOpening): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('spin_jobs').upsert(
    {
      id: job.id,
      title: job.title.trim(),
      department: job.department.trim(),
      location: job.location.trim(),
      employment_type: job.employmentType.trim() || 'Full-Time',
      summary: job.summary.trim(),
      apply_url: job.applyUrl?.trim() || null,
      is_open: job.isOpen !== false,
      sort_order: job.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error(error.message)
}

export async function deleteJob(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('spin_jobs').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function uploadSpinImage(
  file: File,
  folder: 'branding' | 'leaders' | 'gallery' | 'media',
): Promise<string> {
  const client = requireSupabase()
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files (PNG, JPG, WebP, SVG) can be uploaded.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
  const storagePath = `${folder}/${Date.now()}-${sanitizedName}`

  const { error } = await client.storage
    .from(SPIN_STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw new Error(error.message)

  const { data } = client.storage.from(SPIN_STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

// Gene - Nov, 28, 2026: Authenticated /api/admin-users client helpers for Super Admin Users & Roles panel
async function callAdminUsersApi<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: Record<string, unknown>,
): Promise<T> {
  const client = requireSupabase()
  const { data: sessionData, error: sessionErr } = await client.auth.getSession()
  const accessToken = sessionData.session?.access_token
  if (sessionErr || !accessToken) {
    throw new Error('Your admin session expired. Please sign in again.')
  }

  const response = await fetch('/api/admin-users', {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const payload = (await response.json().catch(() => null)) as { error?: string } | null
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status}).`)
  }
  return payload as T
}

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  const res = await callAdminUsersApi<{ users: AdminUserRecord[] }>('GET')
  return res.users ?? []
}

export async function createAdminUser(payload: {
  email: string
  displayName: string
  role: AdminRole
  password: string
}): Promise<AdminUserRecord> {
  const res = await callAdminUsersApi<{ user: AdminUserRecord }>('POST', payload)
  return res.user
}

export async function updateAdminUser(payload: {
  userId: string
  displayName?: string
  role?: AdminRole
  password?: string
}): Promise<AdminUserRecord> {
  const res = await callAdminUsersApi<{ user: AdminUserRecord }>('PATCH', payload)
  return res.user
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await callAdminUsersApi<{ deleted: boolean }>('DELETE', { userId })
}
