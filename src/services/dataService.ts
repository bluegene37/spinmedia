// Gene - Nov, 19, 2026: Extended types and bundle fetcher for positiveNews and publicInfo JSON feeds
import type {
  AboutData,
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

export async function fetchMediaItems(): Promise<MediaItem[]> {
  if (!cache.media) {
    const items = await fetchJson<MediaItem[]>('/data/media.json')
    cache.media = [...items].sort(
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
// Gene - Nov, 19, 2026: Load all core JSON feeds including positiveNews and publicInfo in parallel
export async function fetchAllSpinData(): Promise<SpinBundle> {
  const [site, shows, media, about, positiveNews, publicInfo] = await Promise.all([
    fetchSiteConfig(),
    fetchShows(),
    fetchMediaItems(),
    fetchAboutData(),
    fetchPositiveNews(),
    fetchPublicInfo(),
  ])
  return { site, shows, media, about, positiveNews, publicInfo }
}
