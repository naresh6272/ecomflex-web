import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Hash navigation always takes priority (clicking nav/CTA links)
    if (to.hash) {
      return {
        el: to.hash,
        top: 80, // offset for fixed header
        behavior: 'smooth',
      }
    }
    // On refresh / direct URL visit with no hash — go to top
    if (!from || from.name === to.name) {
      return { top: 0, left: 0, behavior: 'instant' }
    }
    return { top: 0, left: 0, behavior: 'smooth' }
  },
}
