import { ref } from 'vue'
import { fetchAllSpinData } from '@/services/dataService'
import type { AboutData, MediaItem, ShowProgram, SiteConfig } from '@/types/spin'

const site = ref<SiteConfig | null>(null)
const shows = ref<ShowProgram[]>([])
const media = ref<MediaItem[]>([])
const about = ref<AboutData | null>(null)
const loading = ref(false)
const loaded = ref(false)
const error = ref<string | null>(null)

export function useSpinData() {
  const loadSpinData = async () => {
    if (loaded.value || loading.value) return
    loading.value = true
    error.value = null
    try {
      const bundle = await fetchAllSpinData()
      site.value = bundle.site
      shows.value = bundle.shows
      media.value = bundle.media
      about.value = bundle.about
      loaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load SPIN Media data.'
    } finally {
      loading.value = false
    }
  }

  return {
    site,
    shows,
    media,
    about,
    loading,
    loaded,
    error,
    loadSpinData,
  }
}
