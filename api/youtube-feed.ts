// Gene - Nov, 19, 2026: Free Vercel Node.js Function fetching SPIN Media's official YouTube RSS feed with 15m edge caching
import { SPIN_YOUTUBE_CHANNEL_ID, fetchLiveYoutubeRss } from '../src/utils/youtubeRss'

export async function GET(): Promise<Response> {
  try {
    const items = await fetchLiveYoutubeRss(SPIN_YOUTUBE_CHANNEL_ID)
    return Response.json(
      {
        source: 'youtube-rss',
        channelId: SPIN_YOUTUBE_CHANNEL_ID,
        syncedAt: new Date().toISOString(),
        items,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
        },
      },
    )
  } catch (err) {
    console.error('[api/youtube-feed] Failed to sync YouTube RSS:', err)
    return Response.json(
      {
        source: 'youtube-rss',
        channelId: SPIN_YOUTUBE_CHANNEL_ID,
        error: 'YouTube feed temporarily unavailable',
        items: [],
      },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}
