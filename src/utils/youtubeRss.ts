// Gene - Nov, 19, 2026: Shared YouTube RSS parser & live feed fetcher for Vercel Function, Vite dev middleware, and CLI sync
import type { MediaFormat, MediaItem } from '../types/spin'

export const SPIN_YOUTUBE_CHANNEL_ID = 'UCyZfcpNIrLMU5TPD_mA7dsg'

function decodeEntities(str = ''): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function cleanTitle(raw = ''): string {
  return (
    decodeEntities(raw)
      .replace(/^\*+|\*+$/g, '')
      .replace(/^[🔴📺🚨❤️💍🔥🇵🇭🇺🇸🇨🇳\s]+/u, '')
      .replace(/[🚨❤️💍🔥🇵🇭🇺🇸🇨🇳]+$/u, '')
      .replace(/\s+/g, ' ')
      .trim() || decodeEntities(raw)
  )
}

function summarizeDescription(desc = ''): string {
  const cleaned = decodeEntities(desc)
    .split('\n')
    .map((line) => line.replace(/\*\*/g, '').replace(/^\*+|\*+$/g, '').trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !/^WATCH HERE:/i.test(line) &&
        !line.startsWith('#') &&
        !line.startsWith('📢') &&
        !line.startsWith('🔗') &&
        !line.startsWith('📸') &&
        !line.startsWith('📘') &&
        !line.startsWith('🎵') &&
        !line.startsWith('▶️') &&
        !line.startsWith('👉'),
    )
    .slice(0, 4)
    .join(' ')
  return cleaned.length > 220 ? `${cleaned.slice(0, 217).trim()}...` : cleaned
}

function detectShow(title = '', desc = ''): { showSlug: string; showLabel: string } {
  const haystack = `${title} ${desc}`.toLowerCase()
  if (haystack.includes('usapang pilipino')) {
    return { showSlug: 'usapang-pilipino', showLabel: 'Usapang Pilipino' }
  }
  if (haystack.includes('usapang mag-asawa') || haystack.includes('usapang mag asawa')) {
    return { showSlug: 'usapang-mag-asawa', showLabel: 'Usapang Mag-Asawa' }
  }
  if (haystack.includes('suriin at timbangin') || haystack.includes('suriin at timabangin')) {
    return { showSlug: 'suriin-at-timbangin', showLabel: 'Suriin at Timbangin' }
  }
  if (haystack.includes('lampornas')) {
    return { showSlug: 'lampornas', showLabel: 'Lampornas!' }
  }
  if (haystack.includes('f.o.c.u.s') || haystack.includes('forum on current updates')) {
    return { showSlug: 'focus', showLabel: 'F.O.C.U.S.' }
  }
  return { showSlug: 'breaking-news', showLabel: 'Daily & Global Dispatches' }
}

export function parseYoutubeRssXml(xml: string): MediaItem[] {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1] ?? '')
  const items: MediaItem[] = []

  for (const entry of entries) {
    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]?.trim()
    if (!videoId) continue

    const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''
    const link = entry.match(/<link rel="alternate" href="(.*?)"/)?.[1]?.trim() ?? ''
    const publishedAt =
      entry.match(/<published>(.*?)<\/published>/)?.[1]?.trim() ?? new Date().toISOString()
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? ''
    const viewsMatch = entry.match(/<media:statistics views="(\d+)"/)
    const views = viewsMatch ? Number(viewsMatch[1]) : undefined

    const isShort = link.includes('/shorts/')
    const title = cleanTitle(rawTitle)
    const { showSlug, showLabel } = detectShow(rawTitle, description)
    const format: MediaFormat = isShort
      ? 'short'
      : showSlug === 'breaking-news'
        ? 'report'
        : 'episode'

    const summary = summarizeDescription(description) || title

    items.push({
      id: `yt-${videoId}`,
      platform: 'youtube',
      format,
      title,
      summary,
      publishedAt,
      showSlug,
      showLabel,
      videoId,
      externalUrl: link || `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      ...(views !== undefined ? { views } : {}),
    })
  }

  return items
}

export async function fetchLiveYoutubeRss(
  channelId: string = SPIN_YOUTUBE_CHANNEL_ID,
): Promise<MediaItem[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`
  const response = await fetch(feedUrl, {
    headers: { 'User-Agent': 'SPINMediaTV/1.0' },
    signal: AbortSignal.timeout(6000),
  })
  if (!response.ok) {
    throw new Error(`YouTube RSS fetch failed: ${response.status} ${response.statusText}`)
  }
  const xml = await response.text()
  const items = parseYoutubeRssXml(xml)
  if (items.length === 0) {
    throw new Error('No entries parsed from YouTube RSS feed.')
  }
  return items
}
