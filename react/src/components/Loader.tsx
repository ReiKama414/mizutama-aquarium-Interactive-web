import { useEffect, useState } from 'react'
import { rnd } from '../lib/utils'

export function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const [bubbles] = useState(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      size: rnd(6, 42),
      dur: rnd(4.5, 11),
      delay: rnd(0, 5),
    })),
  )

  useEffect(() => {
    let p = 0
    const iv = window.setInterval(() => {
      p += rnd(4, 13)
      if (p > 100) p = 100
      setPct(Math.round(p))
      if (p >= 100) {
        clearInterval(iv)
        setTimeout(() => {
          setDone(true)
          setTimeout(onDone, 1000)
        }, 420)
      }
    }, 170)
    return () => clearInterval(iv)
  }, [onDone])

  return (
    <div id="loader" className={done ? 'done' : undefined}>
      <div className="loader-bubbles">
        {bubbles.map((b) => (
          <i
            key={b.id}
            className="lb"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="loader-mark">
        <svg className="loader-drop" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <radialGradient id="ldg" cx="35%" cy="28%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#C2ECF6" />
              <stop offset="100%" stopColor="#6EC9E0" />
            </radialGradient>
          </defs>
          <path
            d="M50 8 C68 34 84 48 84 63 A34 34 0 0 1 16 63 C16 48 32 34 50 8 Z"
            fill="url(#ldg)"
          />
          <ellipse cx="36" cy="52" rx="10" ry="13" fill="#fff" opacity={0.75} />
          <circle cx="62" cy="72" r="5" fill="#fff" opacity={0.45} />
        </svg>
        <div className="loader-title">みずたま水族館</div>
        <div className="loader-sub">MIZUTAMA AQUARIUM</div>
      </div>
      <div className="loader-bar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="loader-pct">
        <span>{pct}</span>％ 水をそそいでいます…
      </div>
    </div>
  )
}
