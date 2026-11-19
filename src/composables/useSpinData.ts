import { ref } from 'vue'
import { fetchAllSpinData } from '@/services/dataService'
// Gene - Nov, 19, 2026: Import PositiveNewsItem and PublicInfoData for global reactive store
import type {
  AboutData,
  MediaItem,
  PositiveNewsItem,
  PublicInfoData,
  ShowProgram,
  SiteConfig,
} from '@/types/spin'

const site = ref<SiteConfig | null>(null)
const shows = ref<ShowProgram[]>([])
const media = ref<MediaItem[]>([])
const about = ref<AboutData | null>(null)
// Gene - Nov, 19, 2026: Reactive refs for Good News PH stories and Citizen Public Info
const positiveNews = ref<PositiveNewsItem[]>([])
const publicInfo = ref<PublicInfoData | null>(null)
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
      // Gene - Nov, 19, 2026: Populate positiveNews and publicInfo on initial bundle load
      positiveNews.value = bundle.positiveNews
      publicInfo.value = bundle.publicInfo
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
    positiveNews,
    publicInfo,
    loading,
    loaded,
    error,
    loadSpinData,
  }
}
