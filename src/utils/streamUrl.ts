// Gene - Nov, 28, 2026: URL parsers for YouTube / Facebook Live streams and Media Hub items
import type { LiveBroadcastPlatform, MediaFormat, MediaPlatform } from '@/types/spin'

const YT_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

export function extractYoutubeVideoId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) return null
  if (YT_ID_REGEX.test(trimmed)) return trimmed

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()

    if (host === 'youtu.be') {
      const candidate = parsed.pathname.split('/').filter(Boolean)[0] ?? ''
      return YT_ID_REGEX.test(candidate) ? candidate : null
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const vParam = parsed.searchParams.get('v') ?? ''
      if (YT_ID_REGEX.test(vParam)) return vParam

      const segments = parsed.pathname.split('/').filter(Boolean)
      // Handles /live/<id>, /shorts/<id>, /embed/<id>, /v/<id>
      if (
        segments.length >= 2 &&
        ['live', 'shorts', 'embed', 'v'].includes(segments[0] ?? '') &&
        YT_ID_REGEX.test(segments[1] ?? '')
      ) {
        return segments[1] ?? null
      }
    }
  } catch {
    return null
  }

  return null
}

export function sanitizeExternalUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString()
    }
  } catch {
    return ''
  }
  return ''
}

export function resolveLiveEmbedUrl(
  platform: LiveBroadcastPlatform,
  rawUrl: string,
  youtubeChannelId?: string,
): string {
  const trimmed = rawUrl.trim()
  if (!trimmed) return ''

  if (platform === 'youtube') {
    const videoId = extractYoutubeVideoId(trimmed)
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`
    }
    if (youtubeChannelId && trimmed.includes('/live')) {
      return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(youtubeChannelId)}`
    }
    return ''
  }

  if (platform === 'facebook') {
    const safeUrl = sanitizeExternalUrl(trimmed)
    if (!safeUrl) return ''
    if (safeUrl.includes('facebook.com/plugins/')) return safeUrl
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(safeUrl)}&show_text=false&width=1280`
  }

  return sanitizeExternalUrl(trimmed)
}

export interface ParsedMediaUrlResult {
  platform: MediaPlatform
  format: MediaFormat
  videoId?: string
  externalUrl: string
  embedUrl?: string
  thumbnailUrl?: string
}

export function parseMediaInputUrl(rawUrl: string): ParsedMediaUrlResult | null {
  const safeUrl = sanitizeExternalUrl(rawUrl)
  if (!safeUrl) return null

  const videoId = extractYoutubeVideoId(safeUrl)
  if (videoId) {
    const isShort = safeUrl.toLowerCase().includes('/shorts/')
    return {
      platform: 'youtube',
      format: isShort ? 'short' : 'episode',
      videoId,
      externalUrl: safeUrl,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    }
  }

  try {
    const parsed = new URL(safeUrl)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    if (host.includes('facebook.com') || host === 'fb.watch') {
      const isVideo =
        safeUrl.includes('/videos/') ||
        safeUrl.includes('/watch') ||
        safeUrl.includes('/reel/') ||
        host === 'fb.watch'
      const embedUrl = isVideo
        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(safeUrl)}&show_text=false&width=500`
        : `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(safeUrl)}&show_text=true&width=500`

      return {
        platform: 'facebook',
        format: 'post',
        externalUrl: safeUrl,
        embedUrl,
      }
    }
  } catch {
    return null
  }

  return null
}
