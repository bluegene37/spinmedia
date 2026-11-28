#!/usr/bin/env node
/**
 * One-time idempotent seed script that imports public/data/*.json into Supabase.
 * Requires SUPABASE_URL (or VITE_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL) and
 * SUPABASE_SERVICE_ROLE_KEY in environment or .env.local.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(rootDir, 'public', 'data')

function loadEnvFile(filename) {
  const fullPath = path.join(rootDir, filename)
  if (!fs.existsSync(fullPath)) return
  const raw = fs.readFileSync(fullPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex <= 0) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing SUPABASE_URL (or VITE_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Add them to .env.local (never commit .env.local) and re-run `npm run seed:supabase`.',
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'))
}

async function upsertRows(table, rows, conflictTarget = 'id') {
  if (!rows.length) return
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflictTarget })
  if (error) {
    throw new Error(`Failed upserting ${table}: ${error.message}`)
  }
}

async function main() {
  const site = readJson('site.json')
  const about = readJson('about.json')
  const publicInfo = readJson('public-info.json')
  const initiatives = readJson('initiatives.json')
  const shows = readJson('shows.json')
  const media = readJson('media.json')
  const positiveNews = readJson('positive-news.json')
  const leadersLevels = readJson('leaders.json')
  const gallery = readJson('gallery.json')

  console.log('Seeding live_broadcasts default row...')
  await upsertRows('live_broadcasts', [
    {
      id: 'primary',
      is_live: false,
      platform: 'youtube',
      title: '',
      subtitle: '',
      stream_url: site.youtubeChannelId
        ? `https://www.youtube.com/channel/${site.youtubeChannelId}/live`
        : '',
      embed_url: '',
      show_slug: null,
      show_banner: true,
      auto_embed_on_home: true,
    },
  ])

  console.log('Seeding site_sections...')
  const leaderLevelsMeta = leadersLevels.map(({ leaders: _omit, ...level }) => level)
  const { albums: _albumsOmit, ...galleryMeta } = gallery
  await upsertRows(
    'site_sections',
    [
      { key: 'site', data: site },
      { key: 'about', data: about },
      { key: 'public_info', data: publicInfo },
      { key: 'initiatives', data: initiatives },
      { key: 'gallery_meta', data: galleryMeta },
      { key: 'leader_levels', data: leaderLevelsMeta },
    ],
    'key',
  )

  console.log(`Seeding ${shows.length} shows...`)
  await upsertRows(
    'shows',
    shows.map((s, idx) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle ?? '',
      hosts: Array.isArray(s.hosts) ? s.hosts : [],
      director: s.director ?? null,
      day_of_week: Array.isArray(s.dayOfWeek) ? s.dayOfWeek : [],
      day_label: s.dayLabel ?? '',
      time_label: s.timeLabel ?? '',
      start_hour_pht: s.startHourPht ?? 19,
      end_hour_pht: s.endHourPht ?? 20,
      summary: s.summary ?? '',
      accent_color: s.accentColor ?? 'crimson',
      sort_order: idx + 1,
      is_active: true,
    })),
  )

  console.log(`Seeding ${media.length} media_items...`)
  await upsertRows(
    'media_items',
    media.map((m) => ({
      id: m.id,
      platform: m.platform,
      format: m.format,
      title: m.title,
      summary: m.summary ?? '',
      published_at: m.publishedAt,
      show_slug: m.showSlug ?? 'breaking-news',
      show_label: m.showLabel ?? 'Daily & Global Dispatches',
      video_id: m.videoId ?? null,
      external_url: m.externalUrl,
      embed_url: m.embedUrl ?? null,
      thumbnail_url: m.thumbnailUrl ?? null,
      views: m.views ?? null,
      featured: Boolean(m.featured),
      is_published: true,
    })),
  )

  console.log(`Seeding ${positiveNews.length} positive_news items...`)
  await upsertRows(
    'positive_news',
    positiveNews.map((n) => ({
      id: n.id,
      category: n.category,
      category_label: n.categoryLabel,
      title: n.title,
      summary: n.summary ?? '',
      body: n.body ?? '',
      location: n.location ?? '',
      published_at: n.publishedAt,
      read_time: n.readTime ?? '3 min read',
      highlight_tag: n.highlightTag ?? '',
      accent_color: n.accentColor ?? 'crimson',
      related_show_slug: n.relatedShowSlug ?? null,
      is_published: true,
    })),
  )

  const leaderRows = []
  for (const level of leadersLevels) {
    const members = Array.isArray(level.leaders) ? level.leaders : []
    members.forEach((leader, idx) => {
      leaderRows.push({
        id: leader.id,
        level_id: level.id,
        name: leader.name,
        role: leader.role,
        area_label: leader.areaLabel ?? '',
        region_code: leader.regionCode ?? null,
        island_group: leader.islandGroup ?? null,
        role_tier: leader.roleTier ?? 'director',
        photo_url: leader.photoUrl ?? null,
        status: leader.status ?? 'confirmed',
        bio: leader.bio ?? null,
        sort_order: idx + 1,
      })
    })
  }
  console.log(`Seeding ${leaderRows.length} leaders...`)
  await upsertRows('leaders', leaderRows)

  const albums = Array.isArray(gallery.albums) ? gallery.albums : []
  const albumRows = albums.map((album, idx) => ({
    id: album.id,
    slot_number: album.slotNumber ?? String(idx + 1).padStart(2, '0'),
    title: album.title,
    category: album.category,
    category_label: album.categoryLabel,
    description: album.description ?? '',
    location_label: album.locationLabel ?? '',
    date_label: album.dateLabel ?? '',
    cover_image_url: album.coverImageUrl ?? null,
    featured: Boolean(album.featured),
    sort_order: idx + 1,
  }))
  console.log(`Seeding ${albumRows.length} gallery_albums...`)
  await upsertRows('gallery_albums', albumRows)

  const slideRows = []
  for (const album of albums) {
    const slides = Array.isArray(album.slides) ? album.slides : []
    slides.forEach((slide, idx) => {
      slideRows.push({
        id: slide.id,
        album_id: album.id,
        slide_number: slide.slideNumber ?? idx + 1,
        title: slide.title,
        caption: slide.caption ?? '',
        category: slide.category ?? album.category,
        image_url: slide.imageUrl,
        tag: slide.tag ?? '',
        sort_order: idx + 1,
      })
    })
  }
  console.log(`Seeding ${slideRows.length} gallery_slides...`)
  await upsertRows('gallery_slides', slideRows)

  const jobOpenings = Array.isArray(initiatives.jobs?.openings) ? initiatives.jobs.openings : []
  if (jobOpenings.length > 0) {
    console.log(`Seeding ${jobOpenings.length} spin_jobs...`)
    await upsertRows(
      'spin_jobs',
      jobOpenings.map((job, idx) => ({
        id: job.id,
        title: job.title,
        department: job.department ?? '',
        location: job.location ?? '',
        employment_type: job.employmentType ?? 'Full-Time',
        summary: job.summary ?? '',
        apply_url: job.applyUrl ?? null,
        is_open: true,
        sort_order: idx + 1,
      })),
    )
  } else {
    console.log('No initial spin_jobs openings to seed (0 rows).')
  }

  console.log('Supabase seed complete!')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
