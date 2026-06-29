import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // On refresh / direct URL visit — always go to top, ignore hash
    if (!from || from.name === to.name) {
      return { top: 0, left: 0, behavior: 'instant' }
    }
    // In-page hash navigation (clicking nav links) — scroll to element
    if (to.hash) {
      return {
        el: to.hash,
        top: 80, // offset for fixed header
        behavior: 'smooth',
      }
    }
    return { top: 0, left: 0, behavior: 'smooth' }
  },
}
