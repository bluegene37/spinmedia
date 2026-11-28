import { ref } from 'vue'
// Gene - Nov, 28, 2026: Support live broadcast override, Supabase data source tracking, and cache reload
import { clearSpinDataCache, fetchAllSpinData, getLastDataSource } from '@/services/dataService'
// Gene - Nov, 19, 2026: Import PositiveNewsItem and PublicInfoData for global reactive store
// Gene - Nov, 20, 2026: Import DirectoryLevel and GalleryData for Key Leaders Directory and SPIN Gallery
// Gene - Nov, 23, 2026: Import InitiativesData for SPIN Initiatives, PSEPRI, and SPIN Jobs
import type {
  AboutData,
  DirectoryLevel,
  GalleryData,
  InitiativesData,
  LiveBroadcastConfig,
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
// Gene - Nov, 20, 2026: Reactive refs for Key Leaders Directory and SPIN Gallery
const leaders = ref<DirectoryLevel[]>([])
const gallery = ref<GalleryData | null>(null)
// Gene - Nov, 23, 2026: Reactive ref for SPIN Initiatives, PSEPRI, and SPIN Jobs
const initiatives = ref<InitiativesData | null>(null)
// Gene - Nov, 28, 2026: Reactive refs for admin-controlled Live Broadcast and active data source
const liveBroadcast = ref<LiveBroadcastConfig | null>(null)
const dataSource = ref<'supabase' | 'static'>('static')
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
      // Gene - Nov, 20, 2026: Populate leaders directory and gallery data on initial bundle load
      leaders.value = bundle.leaders
      gallery.value = bundle.gallery
      // Gene - Nov, 23, 2026: Populate initiatives, PSEPRI deck, and SPIN Jobs data
      initiatives.value = bundle.initiatives
      // Gene - Nov, 28, 2026: Populate liveBroadcast override and data source flag
      liveBroadcast.value = bundle.liveBroadcast
      dataSource.value = getLastDataSource()
      loaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load SPIN Media data.'
    } finally {
      loading.value = false
    }
  }

  const reloadSpinData = async () => {
    clearSpinDataCache()
    loaded.value = false
    await loadSpinData()
  }

  /*
  // Gene - Nov, 20, 2026: Expose leaders and gallery reactive refs
  return {
    site,
    shows,
    media,
    about,
    positiveNews,
    publicInfo,
    leaders,
    gallery,
    loading,
    loaded,
    error,
    loadSpinData,
  }
  */
  /*
  // Gene - Nov, 23, 2026: Expose initiatives reactive ref alongside existing SPIN feeds
  return {
    site,
    shows,
    media,
    about,
    positiveNews,
    publicInfo,
    leaders,
    gallery,
    initiatives,
    loading,
    loaded,
    error,
    loadSpinData,
  }
  */
  // Gene - Nov, 28, 2026: Expose liveBroadcast, dataSource, and reloadSpinData
  return {
    site,
    shows,
    media,
    about,
    positiveNews,
    publicInfo,
    leaders,
    gallery,
    initiatives,
    liveBroadcast,
    dataSource,
    loading,
    loaded,
    error,
    loadSpinData,
    reloadSpinData,
  }
}
