// Gene - Nov, 19, 2026: Editorial headline normalization, summary cleanup, and deterministic audio briefing durations
import type { MediaItem } from '@/types/spin'

const EMOJI_AND_PICTOGRAPHS_RE =
  /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0E}\u{FE0F}\u{200D}]/gu

const ACRONYMS = new Set([
  'ASEAN',
  'U.S.',
  'US',
  'PH',
  'PHT',
  'BGC',
  'OFW',
  'TV',
  'EP',
  'SPIN',
  'F.O.C.U.S.',
  'MECSERVE',
  'Q&A',
])

const LOWERCASE_CONNECTORS = new Set([
  'in',
  'of',
  'at',
  'to',
  'on',
  'for',
  'as',
  'by',
  'the',
  'a',
  'an',
  'and',
  'or',
  'with',
  'from',
  'into',
  'after',
  'during',
  'sa',
  'ng',
  'na',
  'ang',
])

function stripEmojis(text: string): string {
  return text.replace(EMOJI_AND_PICTOGRAPHS_RE, ' ').replace(/\s+/g, ' ').trim()
}

function toEditorialTitleCase(input: string): string {
  const tokens = input.split(' ')
  let forceCapNext = true

  return tokens
    .map((token, idx) => {
      if (!token) return token

      // Preserve leading punctuation such as opening quotes or parentheses
      const match = token.match(/^([“"'(]*)(.*?)([”"')?!.,:;]*)$/)
      const lead = match?.[1] ?? ''
      const core = match?.[2] ?? token
      const trail = match?.[3] ?? ''

      if (!core) {
        if (/[“"(]/.test(lead)) forceCapNext = true
        return token
      }

      const upperCore = core.toUpperCase()
      let formattedCore = core

      if (ACRONYMS.has(upperCore)) {
        formattedCore = upperCore
      } else if (core.includes('–') || core.includes('-')) {
        const sep = core.includes('–') ? '–' : '-'
        formattedCore = core
          .split(sep)
          .map((part) => {
            const pUpper = part.toUpperCase()
            if (ACRONYMS.has(pUpper)) return pUpper
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          })
          .join(sep)
      } else {
        const lowerCore = core.toLowerCase()
        if (
          idx > 0 &&
          !forceCapNext &&
          LOWERCASE_CONNECTORS.has(lowerCore)
        ) {
          formattedCore = lowerCore
        } else {
          formattedCore = lowerCore.charAt(0).toUpperCase() + lowerCore.slice(1)
        }
      }

      forceCapNext = /[:—–?!]$/.test(trail) || /[—–]$/.test(formattedCore)
      return `${lead}${formattedCore}${trail}`
    })
    .join(' ')
}

export function formatEditorialHeadline(raw: string): string {
  let text = stripEmojis(raw)

  // Remove repetitive broadcast channel prefixes when followed by a substantive title
  const prefixPatterns = [
    /^SPIN\s+MEDIA\s+TV\s+PRESENTS\s*:\s*/i,
    /^SPIN\s+MEDIA\s+DAILY\s+NEWS\s*:\s*/i,
    /^SPIN\s+MEDIA\s+TV\s+(?=USAPANG|SURIIN|F\.O\.C\.U\.S\.|LAMPORNAS)/i,
  ]
  for (const pattern of prefixPatterns) {
    const candidate = text.replace(pattern, '').trim()
    if (candidate.length >= 12) {
      text = candidate
      break
    }
  }

  // Normalize ALL-CAPS wire titles into calm editorial title case
  const letters = text.replace(/[^a-zA-Z]/g, '')
  const uppercaseCount = letters.replace(/[^A-Z]/g, '').length
  if (letters.length > 0 && uppercaseCount / letters.length > 0.65) {
    text = toEditorialTitleCase(text)
  }

  // Clean stray spacing before punctuation
  return text.replace(/\s+([,.;:!?])/g, '$1').trim()
}

export function formatEditorialSummary(raw: string): string {
  let text = stripEmojis(raw)

  const boilerplates = [
    /SPIN\s+MEDIA\s+TV\s*\|\s*INTERNATIONAL\s+BREAKING\s+NEWS/gi,
    /SPIN\s+MEDIA\s+TV\s*\|\s*INTERNATIONAL\s+WEATHER\s+UPDATE/gi,
    /SPIN\s+MEDIA\s+TV\s*\|\s*INTERNATIONAL\s+GEOPOLITICAL\s+ANALYSIS/gi,
    /SPIN\s+MEDIA\s+TV\s*\|\s*HOUSE\s+OF\s+REPRESENTATIVES/gi,
    /SPIN\s+MEDIA\s+TV\s*\|\s*INTERNATIONAL\s+NEWS/gi,
    /SPIN\s+MEDIA\s+TV\s*\|\s*BREAKING\s+NEWS/gi,
    /SPIN\s+MEDIA\s+TV\s*\|\s*NATIONAL\s+NEWS/gi,
    /Powered\s+by\s+SPIN\s+MEDIA\s+TV\s+PHILIPPINES/gi,
  ]
  for (const pattern of boilerplates) {
    text = text.replace(pattern, ' ')
  }

  text = text.replace(/\s+/g, ' ').trim()

  // Trim uppercase wire headline repetition at the very start of the summary
  const splitMatch = text.match(/^([A-Z0-9\s“”"'’.,:;!?\-–—/|]{18,180}?)(?=(?:U\.S\.\s+)?[A-Z][a-z]{2,})/)
  if (splitMatch) {
    const leadChunk = splitMatch[1]
    const alpha = leadChunk.replace(/[^a-zA-Z]/g, '')
    const upper = alpha.replace(/[^A-Z]/g, '')
    if (alpha.length >= 10 && upper.length / alpha.length > 0.85) {
      const remainder = text.slice(leadChunk.length).trim()
      if (remainder.length > 30) {
        text = remainder
      }
    }
  }

  // If the entire summary remains overwhelmingly uppercase, format cleanly
  const alphaAll = text.replace(/[^a-zA-Z]/g, '')
  const upperAll = alphaAll.replace(/[^A-Z]/g, '')
  if (alphaAll.length >= 20 && upperAll.length / alphaAll.length > 0.78) {
    text = toEditorialTitleCase(text)
  }

  return text.replace(/^[|\-:–—\s]+/, '').trim()
}

function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function estimateDurationSeconds(item: MediaItem): number {
  const h = hashId(item.id)
  if (item.format === 'episode') {
    return 2520 + (h % 961) // 42m – 58m
  }
  if (item.format === 'report') {
    return 360 + (h % 481) // 6m – 14m
  }
  if (item.format === 'short') {
    return 85 + (h % 81) // 1m25s – 2m45s
  }
  return 180 + (h % 121) // 3m – 5m
}

export function formatClockTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function estimateDurationLabel(item: MediaItem): string {
  const secs = estimateDurationSeconds(item)
  const mins = Math.max(1, Math.round(secs / 60))
  return `${mins} min`
}
