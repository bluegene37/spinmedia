import { ref } from 'vue'

// const STORAGE_KEY = 'spin-theme'
//
// const isDark = ref<boolean>(
//   typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true,
// )
// Gene - Nov, 19, 2026: Switch theme storage key and fallback default to Light Editorial Paper
const STORAGE_KEY = 'spin-news-theme'

const isDark = ref<boolean>(
  typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
)

export function useTheme() {
  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', dark)
    }
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    } catch {
      // Ignore storage failures in restricted browsing modes
    }
  }

  const toggleTheme = () => {
    applyTheme(!isDark.value)
  }

  return {
    isDark,
    applyTheme,
    toggleTheme,
  }
}
