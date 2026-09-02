import { useEffect, useRef } from 'react'
import { SPECIES } from '../data/catalog'
import { fishSVGString } from '../lib/svgCreatures'

const PICKS = ['guppy', 'neon', 'kusa', 'kingyo', 'kurage', 'angel'] as const
const POS: [number, number, number, number][] = [
  [8, 22, 0.9, 0.35],
  [78, 16, 0.7, 0.5],
  [16, 70, 1.1, 0.22],
  [86, 66, 0.85, 0.42],
  [46, 12, 0.75, 0.6],
  [64, 80, 1, 0.3],
]

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const syRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      syRef.current = window.scrollY || 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    let raf = 0
    const loop = (t: number) => {
      const time = t / 1000
      const sy = syRef.current
      layerRef.current?.querySelectorAll<HTMLElement>('.float-fish').forEach((d) => {
        const dep = Number(d.dataset.dep)
        const amp = Number(d.dataset.amp)
        const ph = Number(d.dataset.ph)
        const x = Math.sin(time * 0.28 + ph) * amp
        const y = Math.cos(time * 0.36 + ph) * amp * 0.55 - sy * dep * 0.35
        const rot = Math.sin(time * 0.3 + ph) * 6
        d.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg)`
      })
      if (sunRef.current) {
        sunRef.current.style.transform = `translateX(-50%) translateY(${sy * 0.22}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="hero" id="top">
      <div className="hero-bg">
        <div className="hero-sun" ref={sunRef} />
        <div className="caustics" />
        <div className="hero-layer" ref={layerRef} id="heroFish">
          {PICKS.map((id, i) => {
            const sp = SPECIES.find((s) => s.id === id)!
            const [l, t, s, dep] = POS[i]
            return (
              <div
                key={id}
                className="float-fish"
                style={{ left: `${l}%`, top: `${t}%`, opacity: 0.55 + dep * 0.5 }}
                data-dep={dep}
                data-amp={20 + i * 8}
                data-ph={i * 1.1}
                dangerouslySetInnerHTML={{
                  __html: fishSVGString(sp, 110 * s).replace(
                    '<svg',
                    i % 2 ? '<svg style="transform:scaleX(-1)"' : '<svg',
                  ),
                }}
              />
            )
          })}
        </div>
      </div>
      <div className="hero-inner">
        <div className="eyebrow">
          <b>◍</b> 架空のブランド ／ 虛構品牌企劃 <b>◍</b>
        </div>
        <h1 className="concept">
          <span className="jp">
            そこから生まれたのは、
            <br />
            水槽を持ち帰れる架空の水族館、
          </span>
          <span className="big">「みずたま水族館」🐟</span>
        </h1>
        <p className="hero-lead">
          由此誕生的是——一座可以把水槽帶回家的虛構水族館。
          <br />
          在這裡，你不只是看魚。你可以挑選、收集、放進水槽，
          <br />
          然後把屬於自己的那一小片海洋，帶回家。
        </p>
        <div className="hero-cta">
          <a href="#studio" className="btn btn-primary">
            水槽をつくる ／ 開始佈置水槽
          </a>
          <a href="#zukan" className="btn btn-ghost">
            おさかな図鑑をみる
          </a>
        </div>
      </div>
      <div className="scroll-hint">
        SCROLL<span />
      </div>
    </div>
  )
}
