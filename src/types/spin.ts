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

export interface LeaderMember {
  name: string
  role: string
  show?: string
  bio: string
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
export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
  positiveNews: PositiveNewsItem[]
  publicInfo: PublicInfoData
}
