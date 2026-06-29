export function useTilt(intensity = 8) {
  if (!import.meta.client) return

  onMounted(() => {
    // Skip tilt on touch devices — no benefit, wastes event listeners
    if (window.matchMedia('(hover: none)').matches) return
    const cards = document.querySelectorAll<HTMLElement>('.tilt-card')
    const handlers = new Map<HTMLElement, { move: (e: MouseEvent) => void; leave: () => void }>()
    const rafIds = new Map<HTMLElement, number>()

    cards.forEach((card) => {
      // Cache rect once on mouseenter — not on every move
      let rect = card.getBoundingClientRect()
      card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect() }, { passive: true })

      const move = (e: MouseEvent) => {
        // rAF throttle — skip if a frame is already queued
        if (rafIds.get(card)) return
        rafIds.set(card, requestAnimationFrame(() => {
          rafIds.delete(card)
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const tiltX = ((y - rect.height / 2) / (rect.height / 2)) * -intensity
          const tiltY = ((x - rect.width  / 2) / (rect.width  / 2)) *  intensity
          card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`
        }))
      }

      const leave = () => {
        const id = rafIds.get(card)
        if (id) { cancelAnimationFrame(id); rafIds.delete(card) }
        card.style.transform = ''
      }

      card.addEventListener('mousemove', move, { passive: true })
      card.addEventListener('mouseleave', leave)
      handlers.set(card, { move, leave })
    })

    onUnmounted(() => {
      rafIds.forEach(id => cancelAnimationFrame(id))
      handlers.forEach(({ move, leave }, card) => {
        card.removeEventListener('mousemove', move)
        card.removeEventListener('mouseleave', leave)
      })
    })
  })
}
