import { fileURLToPath, URL } from 'node:url'
// Gene - Nov, 19, 2026: Added dev-only /api/youtube-feed middleware so local npm run dev mirrors Vercel Function output
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { SPIN_YOUTUBE_CHANNEL_ID, fetchLiveYoutubeRss } from './src/utils/youtubeRss'
import type { MediaItem } from './src/types/spin'

let devFeedCache: { expiresAt: number; payload: string } | null = null

function liveYoutubeDevApiPlugin(): Plugin {
  return {
    name: 'spin-live-youtube-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/youtube-feed', async (req, res, next) => {
        if (req.method !== 'GET') {
          next()
          return
        }
        try {
          const now = Date.now()
          if (devFeedCache && devFeedCache.expiresAt > now) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(devFeedCache.payload)
            return
          }

          const items: MediaItem[] = await fetchLiveYoutubeRss(SPIN_YOUTUBE_CHANNEL_ID)
          const payload = JSON.stringify({
            source: 'youtube-rss',
            channelId: SPIN_YOUTUBE_CHANNEL_ID,
            syncedAt: new Date().toISOString(),
            items,
          })
          devFeedCache = { expiresAt: now + 300_000, payload }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(payload)
        } catch (err) {
          console.error('[vite-dev /api/youtube-feed] Failed to sync YouTube RSS:', err)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              source: 'youtube-rss',
              channelId: SPIN_YOUTUBE_CHANNEL_ID,
              error: 'YouTube feed temporarily unavailable',
              items: [],
            }),
          )
        }
      })
    },
  }
}

/*
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
*/
export default defineConfig({
  plugins: [vue(), tailwindcss(), liveYoutubeDevApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
