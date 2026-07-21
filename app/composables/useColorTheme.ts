export type ColorTheme = 'dark' | 'light'

const STORAGE_KEY = 'ecomflex-theme'
const theme = ref<ColorTheme>('light')

function apply(t: ColorTheme) {
  theme.value = t
  if (!import.meta.client) return
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem(STORAGE_KEY, t)
  window.dispatchEvent(new CustomEvent('ecomflex-theme-change', { detail: t }))
}

export function useColorTheme() {
  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem(STORAGE_KEY) as ColorTheme | null
    apply(saved === 'dark' ? 'dark' : 'light')
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, init, toggle }
}
