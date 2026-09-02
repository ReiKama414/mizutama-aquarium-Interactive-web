import { useEffect } from 'react'
import { prefersReducedMotion, rnd } from '../lib/utils'

export function ClickFx() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (prefersReducedMotion()) return
      const r = document.createElement('div')
      r.className = 'ripple'
      r.style.left = `${e.clientX}px`
      r.style.top = `${e.clientY}px`
      document.body.appendChild(r)
      setTimeout(() => r.remove(), 900)
      for (let i = 0; i < 3; i++) {
        const b = document.createElement('div')
        b.className = 'click-bubble'
        const s = rnd(6, 16)
        b.style.cssText = `left:${e.clientX + rnd(-24, 24)}px;top:${e.clientY + rnd(-8, 8)}px;width:${s}px;height:${s}px;animation-delay:${i * 90}ms`
        document.body.appendChild(b)
        setTimeout(() => b.remove(), 1300)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
