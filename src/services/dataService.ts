// Gene - Nov, 19, 2026: Extended types and bundle fetcher for positiveNews and publicInfo JSON feeds
// Gene - Nov, 20, 2026: Added DirectoryLevel and GalleryData imports for leaders and gallery JSON feeds
// Gene - Nov, 23, 2026: Added InitiativesData import for PSEPRI, initiatives, and SPIN Jobs feed
// Gene - Nov, 28, 2026: Top-level Supabase client and extended CMS domain types
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type {
  AboutData,
  DirectoryLeader,
  DirectoryLevel,
  GalleryAlbum,
  GalleryData,
  GallerySlide,
  InitiativesData,
  LeaderLevelId,
  LiveBroadcastConfig,
  MediaItem,
  PositiveNewsItem,
  PublicInfoData,
  ShowProgram,
  SiteConfig,
  SpinBundle,
  SpinJobOpening,
} from '@/types/spin'

/**
 * Runtime JSON data-access layer.
 * Reads editable JSON files from `/data/*.json` during the database-free phase.
 * To migrate to a backend API or database later, replace these fetchers without modifying views.
 */
const cache: Partial<SpinBundle> = {}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`Failed to load ${path} (${response.status} ${response.statusText})`)
  }
  return (await response.json()) as T
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  if (!cache.site) {
    cache.site = await fetchJson<SiteConfig>('/data/site.json')
  }
  return cache.site
}

export async function fetchShows(): Promise<ShowProgram[]> {
  if (!cache.shows) {
    cache.shows = await fetchJson<ShowProgram[]>('/data/shows.json')
  }
  return cache.shows
}

// Gene - Nov, 19, 2026: Fetch live YouTube uploads from /api/youtube-feed with safe fallback when offline or static preview
async function fetchLiveYoutubeItems(): Promise<MediaItem[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4500)
  try {
    const response = await fetch('/api/youtube-feed', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok || !contentType.includes('application/json')) {
      return []
    }
    const payload = (await response.json()) as { items?: MediaItem[] }
    return Array.isArray(payload.items) ? payload.items : []
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}

/*
export async function fetchMediaItems(): Promise<MediaItem[]> {
  if (!cache.media) {
    const items = await fetchJson<MediaItem[]>('/data/media.json')
    cache.media = [...items].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  }
  return cache.media
}
*/
/*
// Gene - Nov, 19, 2026: Merge live YouTube RSS items over static media.json archive and sort newest first
export async function fetchMediaItems(): Promise<MediaItem[]> {
  if (!cache.media) {
    const [staticItems, liveItems] = await Promise.all([
      fetchJson<MediaItem[]>('/data/media.json'),
      fetchLiveYoutubeItems(),
    ])

    const byId = new Map<string, MediaItem>(staticItems.map((item) => [item.id, item]))
    for (const liveItem of liveItems) {
      const prev = byId.get(liveItem.id)
      byId.set(liveItem.id, {
        ...prev,
        ...liveItem,
        summary: liveItem.summary || prev?.summary || liveItem.title,
        views: liveItem.views ?? prev?.views,
        ...(prev?.featured ? { featured: true } : {}),
      })
    }

    cache.media = [...byId.values()].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  }
  return cache.media
}
*/
// Gene - Nov, 28, 2026: Shared YouTube RSS merger with Supabase override preservation
function mergeLiveYoutubeItems(
  baseItems: MediaItem[],
  liveItems: MediaItem[],
  preferBaseOverrides: boolean,
): MediaItem[] {
  const byId = new Map<string, MediaItem>(baseItems.map((item) => [item.id, item]))
  for (const liveItem of liveItems) {
    const prev = byId.get(liveItem.id)
    if (prev && preferBaseOverrides) {
      byId.set(liveItem.id, {
        ...liveItem,
        ...prev,
        views: liveItem.views ?? prev.views,
      })
    } else {
      byId.set(liveItem.id, {
        ...prev,
        ...liveItem,
        summary: liveItem.summary || prev?.summary || liveItem.title,
        views: liveItem.views ?? prev?.views,
        ...(prev?.featured ? { featured: true } : {}),
      })
    }
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function fetchMediaItems(): Promise<MediaItem[]> {
  if (!cache.media) {
    const [staticItems, liveItems] = await Promise.all([
      fetchJson<MediaItem[]>('/data/media.json'),
      fetchLiveYoutubeItems(),
    ])
    cache.media = mergeLiveYoutubeItems(staticItems, liveItems, false)
  }
  return cache.media
}

export async function fetchAboutData(): Promise<AboutData> {
  if (!cache.about) {
    cache.about = await fetchJson<AboutData>('/data/about.json')
  }
  return cache.about
}

// Gene - Nov, 19, 2026: Fetch curated positive Good News PH stories sorted newest first
export async function fetchPositiveNews(): Promise<PositiveNewsItem[]> {
  if (!cache.positiveNews) {
    const items = await fetchJson<PositiveNewsItem[]>('/data/positive-news.json')
    cache.positiveNews = [...items].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  }
  return cache.positiveNews
}

// Gene - Nov, 19, 2026: Fetch Philippine emergency hotlines, official advisories, and holidays
export async function fetchPublicInfo(): Promise<PublicInfoData> {
  if (!cache.publicInfo) {
    cache.publicInfo = await fetchJson<PublicInfoData>('/data/public-info.json')
  }
  return cache.publicInfo
}

/*
export async function fetchAllSpinData(): Promise<SpinBundle> {
  const [site, shows, media, about] = await Promise.all([
    fetchSiteConfig(),
    fetchShows(),
    fetchMediaItems(),
    fetchAboutData(),
  ])
  return { site, shows, media, about }
}
*/
// Gene - Nov, 20, 2026: Fetch National/Regional Key Leaders Directory and SPIN Gallery / Gawad Parangal deck data
export async function fetchLeadersDirectory(): Promise<DirectoryLevel[]> {
  if (!cache.leaders) {
    cache.leaders = await fetchJson<DirectoryLevel[]>('/data/leaders.json')
  }
  return cache.leaders
}

export async function fetchGalleryData(): Promise<GalleryData> {
  if (!cache.gallery) {
    cache.gallery = await fetchJson<GalleryData>('/data/gallery.json')
  }
  return cache.gallery
}

// Gene - Nov, 23, 2026: Fetch SPIN Initiatives, PSEPRI Investor Deck, and SPIN Jobs data feed
export async function fetchInitiativesData(): Promise<InitiativesData> {
  if (!cache.initiatives) {
    cache.initiatives = await fetchJson<InitiativesData>('/data/initiatives.json')
  }
  return cache.initiatives
}

/*
// Gene - Nov, 20, 2026: Load all core JSON feeds including leaders directory and gallery presentation data
export async function fetchAllSpinData(): Promise<SpinBundle> {
  const [site, shows, media, about, positiveNews, publicInfo, leaders, gallery] = await Promise.all([
    fetchSiteConfig(),
    fetchShows(),
    fetchMediaItems(),
    fetchAboutData(),
    fetchPositiveNews(),
    fetchPublicInfo(),
    fetchLeadersDirectory(),
    fetchGalleryData(),
  ])
  return { site, shows, media, about, positiveNews, publicInfo, leaders, gallery }
}
*/
/*
// Gene - Nov, 23, 2026: Load all core JSON feeds including initiatives, PSEPRI presentation, and SPIN Jobs data
export async function fetchAllSpinData(): Promise<SpinBundle> {
  const [site, shows, media, about, positiveNews, publicInfo, leaders, gallery, initiatives] =
    await Promise.all([
      fetchSiteConfig(),
      fetchShows(),
      fetchMediaItems(),
      fetchAboutData(),
      fetchPositiveNews(),
      fetchPublicInfo(),
      fetchLeadersDirectory(),
      fetchGalleryData(),
      fetchInitiativesData(),
    ])
  return { site, shows, media, about, positiveNews, publicInfo, leaders, gallery, initiatives }
}
*/
// Gene - Nov, 28, 2026: Load bundle from Supabase first with graceful per-section static JSON fallback

let lastDataSource: 'supabase' | 'static' = 'static'

export function getLastDataSource(): 'supabase' | 'static' {
  return lastDataSource
}

export function clearSpinDataCache(): void {
  delete cache.site
  delete cache.shows
  delete cache.media
  delete cache.about
  delete cache.positiveNews
  delete cache.publicInfo
  delete cache.leaders
  delete cache.gallery
  delete cache.initiatives
  delete cache.liveBroadcast
}

function mapLiveBroadcastRow(row: Record<string, unknown> | null): LiveBroadcastConfig | null {
  if (!row) return null
  return {
    id: String(row.id ?? 'primary'),
    isLive: Boolean(row.is_live),
    platform: (row.platform as LiveBroadcastConfig['platform']) ?? 'youtube',
    title: String(row.title ?? ''),
    subtitle: String(row.subtitle ?? ''),
    streamUrl: String(row.stream_url ?? ''),
    embedUrl: String(row.embed_url ?? ''),
    showSlug: row.show_slug ? String(row.show_slug) : undefined,
    showBanner: row.show_banner !== false,
    autoEmbedOnHome: row.auto_embed_on_home !== false,
    startedAt: row.started_at ? String(row.started_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  }
}

function mapShowRow(row: Record<string, unknown>): ShowProgram {
  return {
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
  }
}

function mapMediaRow(row: Record<string, unknown>): MediaItem {
  return {
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
  }
}

function mapPositiveNewsRow(row: Record<string, unknown>): PositiveNewsItem {
  return {
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
  }
}

function mapLeaderRow(row: Record<string, unknown>): DirectoryLeader & { levelId: LeaderLevelId } {
  return {
    id: String(row.id),
    levelId: (row.level_id as LeaderLevelId) ?? 'regional',
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
  }
}

function mapJobRow(row: Record<string, unknown>): SpinJobOpening {
  return {
    id: String(row.id),
    title: String(row.title),
    department: String(row.department ?? ''),
    location: String(row.location ?? ''),
    employmentType: String(row.employment_type ?? 'Full-Time'),
    summary: String(row.summary ?? ''),
    applyUrl: row.apply_url ? String(row.apply_url) : undefined,
    isOpen: row.is_open !== false,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
  }
}

async function fetchStaticBundle(): Promise<SpinBundle> {
  const [site, shows, media, about, positiveNews, publicInfo, leaders, gallery, initiatives] =
    await Promise.all([
      fetchSiteConfig(),
      fetchShows(),
      fetchMediaItems(),
      fetchAboutData(),
      fetchPositiveNews(),
      fetchPublicInfo(),
      fetchLeadersDirectory(),
      fetchGalleryData(),
      fetchInitiativesData(),
    ])
  lastDataSource = 'static'
  return {
    site,
    shows,
    media,
    about,
    positiveNews,
    publicInfo,
    leaders,
    gallery,
    initiatives,
    liveBroadcast: null,
  }
}

export async function fetchAllSpinData(): Promise<SpinBundle> {
  if (!isSupabaseConfigured || !supabase) {
    return fetchStaticBundle()
  }

  try {
    const [
      liveRes,
      sectionsRes,
      showsRes,
      mediaRes,
      newsRes,
      leadersRes,
      albumsRes,
      slidesRes,
      jobsRes,
      liveYoutubeItems,
    ] = await Promise.all([
      supabase.from('live_broadcasts').select('*').eq('id', 'primary').maybeSingle(),
      supabase.from('site_sections').select('key, data'),
      supabase.from('shows').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase
        .from('media_items')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false }),
      supabase
        .from('positive_news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false }),
      supabase.from('leaders').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery_albums').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery_slides').select('*').order('sort_order', { ascending: true }),
      supabase.from('spin_jobs').select('*').eq('is_open', true).order('sort_order', { ascending: true }),
      fetchLiveYoutubeItems(),
    ])

    const sectionMap = new Map<string, unknown>()
    if (!sectionsRes.error && Array.isArray(sectionsRes.data)) {
      for (const row of sectionsRes.data) {
        sectionMap.set(String(row.key), row.data)
      }
    }

    const hasDbRows =
      sectionMap.size > 0 ||
      Boolean(!liveRes.error && liveRes.data) ||
      Boolean(!showsRes.error && showsRes.data?.length) ||
      Boolean(!mediaRes.error && mediaRes.data?.length)

    if (!hasDbRows) {
      const fallback = await fetchStaticBundle()
      fallback.liveBroadcast = !liveRes.error
        ? mapLiveBroadcastRow((liveRes.data as Record<string, unknown> | null) ?? null)
        : null
      return fallback
    }

    const [
      fallbackSite,
      fallbackShows,
      fallbackMedia,
      fallbackAbout,
      fallbackNews,
      fallbackPublicInfo,
      fallbackLeaders,
      fallbackGallery,
      fallbackInitiatives,
    ] = await Promise.all([
      sectionMap.has('site') ? Promise.resolve(null) : fetchSiteConfig(),
      !showsRes.error && showsRes.data?.length ? Promise.resolve(null) : fetchShows(),
      !mediaRes.error && mediaRes.data?.length ? Promise.resolve(null) : fetchJson<MediaItem[]>('/data/media.json'),
      sectionMap.has('about') ? Promise.resolve(null) : fetchAboutData(),
      !newsRes.error && newsRes.data?.length ? Promise.resolve(null) : fetchPositiveNews(),
      sectionMap.has('public_info') ? Promise.resolve(null) : fetchPublicInfo(),
      !leadersRes.error && leadersRes.data?.length ? Promise.resolve(null) : fetchLeadersDirectory(),
      !albumsRes.error && albumsRes.data?.length ? Promise.resolve(null) : fetchGalleryData(),
      sectionMap.has('initiatives') ? Promise.resolve(null) : fetchInitiativesData(),
    ])

    const site = (sectionMap.get('site') as SiteConfig | undefined) ?? fallbackSite!
    const about = (sectionMap.get('about') as AboutData | undefined) ?? fallbackAbout!
    const publicInfo = (sectionMap.get('public_info') as PublicInfoData | undefined) ?? fallbackPublicInfo!

    const shows =
      !showsRes.error && showsRes.data?.length
        ? (showsRes.data as Record<string, unknown>[]).map(mapShowRow)
        : fallbackShows!

    const dbMedia =
      !mediaRes.error && mediaRes.data?.length
        ? (mediaRes.data as Record<string, unknown>[]).map(mapMediaRow)
        : null

    const media = dbMedia
      ? mergeLiveYoutubeItems(dbMedia, liveYoutubeItems, true)
      : mergeLiveYoutubeItems(fallbackMedia!, liveYoutubeItems, false)

    const positiveNews =
      !newsRes.error && newsRes.data?.length
        ? (newsRes.data as Record<string, unknown>[]).map(mapPositiveNewsRow)
        : fallbackNews!

    let leaders: DirectoryLevel[]
    if (!leadersRes.error && leadersRes.data?.length) {
      const levelHeaders =
        (sectionMap.get('leader_levels') as Omit<DirectoryLevel, 'leaders'>[] | undefined) ??
        (await fetchLeadersDirectory()).map(({ leaders: _omit, ...level }) => level)
      const grouped = new Map<LeaderLevelId, DirectoryLeader[]>()
      for (const row of leadersRes.data as Record<string, unknown>[]) {
        const mapped = mapLeaderRow(row)
        const { levelId, ...leader } = mapped
        const bucket = grouped.get(levelId) ?? []
        bucket.push(leader)
        grouped.set(levelId, bucket)
      }
      leaders = levelHeaders.map((level) => ({
        ...level,
        leaders: grouped.get(level.id) ?? [],
      }))
    } else {
      leaders = fallbackLeaders!
    }

    let gallery: GalleryData
    if (!albumsRes.error && albumsRes.data?.length) {
      const galleryMeta =
        (sectionMap.get('gallery_meta') as Omit<GalleryData, 'albums'> | undefined) ??
        (() => {
          const { albums: _omit, ...meta } = fallbackGallery ?? {
            presentationTitle: 'SPIN Media Annual Awards — “Gawad Parangal at Pagkilala”',
            presentationSubtitle: 'Official Event Deck, Selection Framework & Network Broadcast Showcase',
            eventDate: 'December 14, 2026',
            eventVenue: 'Marriott Hotel, Pasay City',
            themeVerse: '',
            albums: [],
          }
          return meta
        })()

      const slidesByAlbum = new Map<string, GallerySlide[]>()
      if (!slidesRes.error && Array.isArray(slidesRes.data)) {
        for (const row of slidesRes.data as Record<string, unknown>[]) {
          const albumId = String(row.album_id)
          const slide: GallerySlide = {
            id: String(row.id),
            slideNumber: Number(row.slide_number ?? 1),
            title: String(row.title),
            caption: String(row.caption ?? ''),
            category: (row.category as GallerySlide['category']) ?? 'gawad',
            imageUrl: String(row.image_url),
            tag: String(row.tag ?? ''),
          }
          const list = slidesByAlbum.get(albumId) ?? []
          list.push(slide)
          slidesByAlbum.set(albumId, list)
        }
      }

      const albums: GalleryAlbum[] = (albumsRes.data as Record<string, unknown>[]).map((row) => ({
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
      }))

      gallery = {
        ...galleryMeta,
        albums,
      }
    } else {
      gallery = fallbackGallery!
    }

    const baseInitiatives =
      (sectionMap.get('initiatives') as InitiativesData | undefined) ?? fallbackInitiatives!
    const openJobs =
      !jobsRes.error && Array.isArray(jobsRes.data)
        ? (jobsRes.data as Record<string, unknown>[]).map(mapJobRow)
        : baseInitiatives.jobs.openings

    const initiatives: InitiativesData = {
      ...baseInitiatives,
      jobs: {
        ...baseInitiatives.jobs,
        statusLabel:
          openJobs.length > 0 && baseInitiatives.jobs.statusLabel.startsWith('No Active Postings')
            ? `${openJobs.length} Active Opening${openJobs.length === 1 ? '' : 's'}`
            : baseInitiatives.jobs.statusLabel,
        openings: openJobs,
      },
    }

    const liveBroadcast = !liveRes.error
      ? mapLiveBroadcastRow((liveRes.data as Record<string, unknown> | null) ?? null)
      : null

    lastDataSource = 'supabase'
    return {
      site,
      shows,
      media,
      about,
      positiveNews,
      publicInfo,
      leaders,
      gallery,
      initiatives,
      liveBroadcast,
    }
  } catch (err) {
    console.warn('[dataService] Supabase fetch failed, falling back to static JSON:', err)
    return fetchStaticBundle()
  }
}
