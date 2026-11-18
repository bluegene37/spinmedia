#!/usr/bin/env node
/**
 * Syncs latest public videos/Shorts from SPIN Media TV Philippines YouTube RSS feed
 * into `public/data/media.json`, while preserving curated Facebook posts and older archives.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const SITE_PATH = resolve(ROOT, 'public/data/site.json')
const MEDIA_PATH = resolve(ROOT, 'public/data/media.json')

const decodeEntities = (str = '') =>
  str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

const cleanTitle = (raw = '') =>
  decodeEntities(raw)
    .replace(/^\*+|\*+$/g, '')
    .replace(/^[🔴📺🚨❤️💍🔥🇵🇭🇺🇸\s]+/u, '')
    .replace(/[🚨❤️💍🔥]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim() || decodeEntities(raw)

// Gene - Nov, 18, 2026: Improved summary cleanup to remove markdown bold markers and WATCH HERE lines from YouTube RSS descriptions
/*
const summarizeDescription = (desc = '') => {
  const cleaned = decodeEntities(desc)
    .split('\n')
    .map((line) => line.replace(/^\*+|\*+$/g, '').trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith('#') &&
        !line.startsWith('📢') &&
        !line.startsWith('🔗') &&
        !line.startsWith('📸') &&
        !line.startsWith('📘') &&
        !line.startsWith('🎵') &&
        !line.startsWith('▶️') &&
        !line.startsWith('👉'),
    )
    .slice(0, 3)
    .join(' ')
  return cleaned.length > 220 ? `${cleaned.slice(0, 217).trim()}...` : cleaned
}
*/
const summarizeDescription = (desc = '') => {
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

const detectShow = (title = '', desc = '') => {
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

async function run() {
  const site = JSON.parse(await readFile(SITE_PATH, 'utf8'))
  const existing = JSON.parse(await readFile(MEDIA_PATH, 'utf8'))

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtubeChannelId}`
  const response = await fetch(feedUrl)
  if (!response.ok) {
    throw new Error(`YouTube RSS fetch failed: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1])

  if (entries.length === 0) {
    throw new Error('No <entry> elements found in YouTube RSS feed.')
  }

  const byId = new Map(existing.map((item) => [item.id, item]))
  let added = 0
  let updated = 0

  for (const entry of entries) {
    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]?.trim()
    if (!videoId) continue

    const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''
    const link = entry.match(/<link rel="alternate" href="(.*?)"/)?.[1]?.trim() ?? ''
    const publishedAt = entry.match(/<published>(.*?)<\/published>/)?.[1]?.trim() ?? new Date().toISOString()
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? ''
    const viewsMatch = entry.match(/<media:statistics views="(\d+)"/)
    const views = viewsMatch ? Number(viewsMatch[1]) : undefined

    const isShort = link.includes('/shorts/')
    const title = cleanTitle(rawTitle)
    const { showSlug, showLabel } = detectShow(rawTitle, description)
    const format = isShort
      ? 'short'
      : showSlug === 'breaking-news'
        ? 'report'
        : 'episode'

    const id = `yt-${videoId}`
    const prev = byId.get(id)

    const nextItem = {
      id,
      platform: 'youtube',
      format,
      title,
      summary: summarizeDescription(description) || prev?.summary || title,
      publishedAt,
      showSlug,
      showLabel,
      videoId,
      externalUrl: link || `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      ...(views !== undefined ? { views } : {}),
      ...(prev?.featured ? { featured: true } : {}),
    }

    if (prev) updated++
    else added++

    byId.set(id, nextItem)
  }

  const merged = [...byId.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  if (!merged.some((item) => item.featured) && merged.length > 0) {
    merged[0].featured = true
  }

  await writeFile(MEDIA_PATH, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
  console.log(
    `Synced ${entries.length} YouTube RSS items into public/data/media.json (${added} added, ${updated} updated, ${merged.length} total items).`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
