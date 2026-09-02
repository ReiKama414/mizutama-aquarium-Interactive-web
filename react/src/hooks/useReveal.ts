import { useEffect, useRef } from 'react'

export function useReveal(deps: unknown[] = []) {
  const io = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!io.current) {
      io.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.current?.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12 },
      )
    }
    const nodes = document.querySelectorAll('.reveal:not(.in)')
    nodes.forEach((n, i) => {
      ;(n as HTMLElement).style.transitionDelay = `${Math.min((i % 8) * 60, 420)}ms`
      io.current?.observe(n)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
