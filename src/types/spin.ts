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

export interface SpinBundle {
  site: SiteConfig
  shows: ShowProgram[]
  media: MediaItem[]
  about: AboutData
}
