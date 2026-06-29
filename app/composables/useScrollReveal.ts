export function useScrollReveal() {
  if (!import.meta.client) return

  const init = () => {
    const elements = document.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
    )
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          } else {
            entry.target.classList.remove('revealed')
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -50px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return observer
  }

  onMounted(() => {
    const timer = setTimeout(init, 60)
    onUnmounted(() => clearTimeout(timer))
  })
}
