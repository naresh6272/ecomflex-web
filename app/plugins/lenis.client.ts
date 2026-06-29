import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // Intercept all hash anchor clicks and scroll via Lenis (bypasses router conflict)
  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
    if (!anchor) return
    const hash = anchor.getAttribute('href')
    if (!hash || hash === '#') return
    const target = document.querySelector(hash)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 })
  }, { passive: false })

  return {
    provide: {
      lenis,
    },
  }
})
