// Gene - Nov, 19, 2026: Extended types and bundle fetcher for positiveNews and publicInfo JSON feeds
// Gene - Nov, 20, 2026: Added DirectoryLevel and GalleryData imports for leaders and gallery JSON feeds
// Gene - Nov, 23, 2026: Added InitiativesData import for PSEPRI, initiatives, and SPIN Jobs feed
import type {
  AboutData,
  DirectoryLevel,
  GalleryData,
  InitiativesData,
  MediaItem,
  PositiveNewsItem,
  PublicInfoData,
  ShowProgram,
  SiteConfig,
  SpinBundle,
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
