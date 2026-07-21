const SELECTOR = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'

let intersectionObserver: IntersectionObserver | null = null
let mutationObserver: MutationObserver | null = null
const observed = new WeakSet<Element>()

function ensureObservers() {
  if (intersectionObserver) return

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('revealed', entry.isIntersecting)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  )

  const observeAll = () => {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (!observed.has(el)) {
        observed.add(el)
        intersectionObserver!.observe(el)
      }
    })
  }

  observeAll()

  // Catch late-mounted content for a few seconds, then stop —
  // re-scanning the whole document on every DOM change (carousels,
  // accordions, form transitions) is expensive and unnecessary once
  // the page has settled.
  mutationObserver = new MutationObserver(() => observeAll())
  mutationObserver.observe(document.body, { childList: true, subtree: true })
  setTimeout(() => {
    mutationObserver?.disconnect()
    mutationObserver = null
  }, 4000)
}

export function useScrollReveal() {
  if (!import.meta.client) return
  onMounted(() => ensureObservers())
}
