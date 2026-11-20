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
