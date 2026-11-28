export type SocialPlatform = 'youtube' | 'facebook' | 'tiktok' | 'linkedin' | 'instagram'

export interface SocialChannel {
  id: string
  platform: SocialPlatform
  label: string
  handle: string
  url: string
  primaryEmbed?: boolean
}

export interface ContactConfig {
  email: string
  messengerUrl: string
  web3formsKey: string
  formspreeEndpoint: string
  locationLabel: string
  responseNote: string
}

export interface SiteConfig {
  name: string
  shortName: string
  parentOrg: string
  tagline: string
  description: string
  logoUrl: string
  youtubeChannelId: string
  facebookPageUrl: string
  socials: SocialChannel[]
  contact: ContactConfig
}

export interface ShowProgram {
  id: string
  slug: string
  title: string
  subtitle: string
  hosts: string[]
  director?: string
  dayOfWeek: number[]
  dayLabel: string
  timeLabel: string
  startHourPht: number
  endHourPht: number
  summary: string
  accentColor: string
}

export type MediaPlatform = 'youtube' | 'facebook'
export type MediaFormat = 'episode' | 'short' | 'report' | 'post'

export interface MediaItem {
  id: string
  platform: MediaPlatform
  format: MediaFormat
  title: string
  summary: string
  publishedAt: string
  showSlug: string
  showLabel: string
  videoId?: string
  externalUrl: string
  embedUrl?: string
  thumbnailUrl?: string
  views?: number
  featured?: boolean
}

export interface CoreValue {
  title: string
  description: string
}

/*
export interface LeaderMember {
  name: string
  role: string
  show?: string
  bio: string
}
*/
// Gene - Nov, 20, 2026: Added optional photoUrl to LeaderMember for real newsroom/executive portraits
export interface LeaderMember {
  name: string
  role: string
  show?: string
  bio: string
  photoUrl?: string
}

export interface AboutData {
  headline: string
  intro: string
  mission: string
  vision: string
  coreValues: CoreValue[]
  affiliations: string[]
  leadership: LeaderMember[]
}

// Gene - Nov, 19, 2026: Added PositiveNews and PublicInfo domain models for Good News PH and Citizen Essentials
export type PositiveNewsCategory = 'community' | 'ofw' | 'family' | 'progress'

export interface PositiveNewsItem {
  id: string
  category: PositiveNewsCategory
  categoryLabel: string
  title: string
  summary: string
  body: string
  location: string
  publishedAt: string
  readTime: string
  highlightTag: string
  accentColor: 'crimson' | 'ochre' | 'civic'
  relatedShowSlug?: string
}

export interface EmergencyHotline {
  id: string
  name: string
  number: string
  telHref: string
  description: string
  category: string
}

export interface AdvisoryLink {
  id: string
  agency: string
  title: string
  description: string
  url: string
  badge: string
}

export interface PhilippineHoliday {
  id: string
  date: string
  name: string
  type: 'Regular Holiday' | 'Special Non-Working Day'
}

export interface PublicInfoData {
  hotlines: EmergencyHotline[]
  advisories: AdvisoryLink[]
  holidays: PhilippineHoliday[]
}

/*
export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
}
*/
// Gene - Nov, 20, 2026: Added Key Leaders Directory and SPIN Gallery / Gawad Parangal domain models
export type LeaderLevelId = 'national' | 'regional' | 'provincial' | 'district' | 'municipal'
export type LevelAccent = 'crimson' | 'ochre' | 'civic'
export type RegionalIslandGroup = 'mindanao-command' | 'luzon' | 'visayas' | 'mindanao'
export type LeaderRoleTier =
  | 'executive'
  | 'overall'
  | 'director'
  | 'spin-media'
  | 'deputy'
  | 'placeholder'

export interface DirectoryLeader {
  id: string
  name: string
  role: string
  areaLabel: string
  regionCode?: string
  islandGroup?: RegionalIslandGroup
  roleTier: LeaderRoleTier
  photoUrl?: string
  status: 'confirmed' | 'placeholder'
  bio?: string
}

export interface DirectoryLevel {
  id: LeaderLevelId
  levelNumber: string
  name: string
  heading: string
  scope: string
  description: string
  accent: LevelAccent
  leaders: DirectoryLeader[]
}

export type GalleryCategory = 'all' | 'gawad' | 'studio' | 'community' | 'chapters'

export interface GallerySlide {
  id: string
  slideNumber: number
  title: string
  caption: string
  category: Exclude<GalleryCategory, 'all'>
  imageUrl: string
  tag: string
}

export interface GalleryAlbum {
  id: string
  slotNumber: string
  title: string
  category: Exclude<GalleryCategory, 'all'>
  categoryLabel: string
  description: string
  locationLabel: string
  dateLabel: string
  coverImageUrl?: string
  featured?: boolean
  slides: GallerySlide[]
}

export interface GalleryData {
  presentationTitle: string
  presentationSubtitle: string
  eventDate: string
  eventVenue: string
  themeVerse: string
  albums: GalleryAlbum[]
}

/*
export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
  positiveNews: PositiveNewsItem[]
  publicInfo: PublicInfoData
}
*/
// Gene - Nov, 23, 2026: Added Initiatives, PSEPRI Business Concept, and SPIN Jobs domain models
export type InitiativeCategory =
  | 'all'
  | 'research'
  | 'awards'
  | 'careers'
  | 'community'
  | 'partnerships'

export type PsepriSlideSection = 'overview' | 'market' | 'operations' | 'investment'

export interface PsepriMetric {
  label: string
  value: string
  detail: string
}

export interface PsepriVertical {
  number: string
  title: string
  description: string
}

export interface PsepriPackage {
  name: string
  priceRange: string
  sampleSize: string
  highlights: string[]
}

export interface PsepriSlide {
  id: string
  slideNumber: number
  section: PsepriSlideSection
  tag: string
  title: string
  caption: string
  imageUrl: string
}

export interface PsepriProgram {
  title: string
  shortName: string
  tagline: string
  deckTitle: string
  partnershipTitle: string
  partnershipSummary: string
  partnershipPillars: string[]
  heroSlideUrl: string
  coverSlideUrl: string
  keyMetrics: PsepriMetric[]
  revenueVerticals: PsepriVertical[]
  surveyPackages: PsepriPackage[]
  signatureProducts: {
    flagshipName: string
    cadence: string
    flagshipDescription: string
    additionalPublications: string[]
    domains: { name: string; focus: string }[]
  }
  slides: PsepriSlide[]
}

export interface InitiativeItem {
  id: string
  slotNumber: string
  category: Exclude<InitiativeCategory, 'all'>
  categoryLabel: string
  statusLabel: string
  title: string
  summary: string
  ctaLabel: string
  to: string
  highlight?: boolean
}

export interface SpinJobOpening {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  summary: string
  applyUrl?: string
}

export interface SpinJobTrack {
  title: string
  scope: string
  description: string
}

export interface SpinJobsSection {
  heading: string
  statusLabel: string
  summary: string
  futureTracks: SpinJobTrack[]
  openings: SpinJobOpening[]
}

export interface InitiativesData {
  headline: string
  subtitle: string
  tagline: string
  psepri: PsepriProgram
  programs: InitiativeItem[]
  jobs: SpinJobsSection
}

/*
// Gene - Nov, 20, 2026: Extended SpinBundle with leaders directory and gallery data feeds
export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
  positiveNews: PositiveNewsItem[]
  publicInfo: PublicInfoData
  leaders: DirectoryLevel[]
  gallery: GalleryData
}
*/
/*
// Gene - Nov, 23, 2026: Extended SpinBundle with initiatives portfolio, PSEPRI deck, and SPIN Jobs data
export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
  positiveNews: PositiveNewsItem[]
  publicInfo: PublicInfoData
  leaders: DirectoryLevel[]
  gallery: GalleryData
  initiatives: InitiativesData
}
*/
// Gene - Nov, 28, 2026: Live broadcast override, admin profile, and extended SpinBundle for Supabase CMS
export type LiveBroadcastPlatform = 'youtube' | 'facebook' | 'custom'

export interface LiveBroadcastConfig {
  id: string
  isLive: boolean
  platform: LiveBroadcastPlatform
  title: string
  subtitle: string
  streamUrl: string
  embedUrl: string
  showSlug?: string
  showBanner: boolean
  autoEmbedOnHome: boolean
  startedAt?: string
  updatedAt?: string
}

/*
export interface AdminUserProfile {
  userId: string
  email: string
  displayName?: string
  role: 'super_admin' | 'admin' | 'editor'
}
*/
// Gene - Nov, 28, 2026: Shared AdminRole and AdminUserRecord types for /admin/users management
export type AdminRole = 'super_admin' | 'admin' | 'editor'

export interface AdminUserProfile {
  userId: string
  email: string
  displayName?: string
  role: AdminRole
}

export interface AdminUserRecord {
  userId: string
  email: string
  displayName: string
  role: AdminRole
  createdAt: string
  lastSignInAt?: string
  emailConfirmed?: boolean
}

export interface ShowProgram {
  isActive?: boolean
  sortOrder?: number
}

export interface MediaItem {
  isPublished?: boolean
}

export interface PositiveNewsItem {
  isPublished?: boolean
}

export interface DirectoryLeader {
  sortOrder?: number
}

export interface SpinJobOpening {
  isOpen?: boolean
  sortOrder?: number
}

export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
  positiveNews: PositiveNewsItem[]
  publicInfo: PublicInfoData
  leaders: DirectoryLevel[]
  gallery: GalleryData
  initiatives: InitiativesData
  liveBroadcast: LiveBroadcastConfig | null
}
