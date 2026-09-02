import { DECOS, FLOOR, SVGNS, THEMES, VH, VW } from '../data/catalog'
import type { Deco, PlacedDeco, PlacedFish, Species, ThemeId, VisBounds } from '../data/types'
import { decoInner, fishInner, nextSvgId } from './svgCreatures'
import { clamp, rnd } from './utils'

interface Layers {
  far: SVGGElement
  deco: SVGGElement
  bub: SVGGElement
  fish: SVGGElement
  fx: SVGGElement
  sand: SVGGElement
}

interface FishObj {
  rec: PlacedFish
  sp: Species
  g: SVGGElement
  inner: SVGGElement
  x: number
  y: number
  hx: number
  hy: number
  ph: number
  ph2: number
  dir: number
  sc: number
  spd: number
  drag: boolean
  r: number
}

interface DecoObj {
  rec: PlacedDeco
  d: Deco
  g: SVGGElement
  x: number
  y: number
  ph: number
  sc: number
  drag: boolean
}

interface Bubble {
  el: SVGCircleElement
  x: number
  y: number
  r: number
  vy: number
  ph: number
}

function el<K extends keyof SVGElementTagNameMap>(n: K) {
  return document.createElementNS(SVGNS, n)
}

export class TankEngine {
  svg: SVGSVGElement
  layers!: Layers
  fishObjs: FishObj[] = []
  decoObjs: DecoObj[] = []
  bubbles: Bubble[] = []
  complete = false
  private last = performance.now()
  private bubTimer = 0
  private waveT = 0
  private visTimer = 0
  private VIS: VisBounds = { x0: 0, x1: VW, y0: 0, y1: VH }
  private raf = 0
  private running = false
  private theme: ThemeId = 'day'
  private spOf: (id: string) => Species | undefined
  private dcOf: (id: string) => Deco | undefined

  constructor(
    svg: SVGSVGElement,
    spOf: (id: string) => Species | undefined,
    dcOf: (id: string) => Deco | undefined,
  ) {
    this.svg = svg
    this.spOf = spOf
    this.dcOf = dcOf
  }

  start() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    const tick = (t: number) => {
      this.loop(t)
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  setTheme(theme: ThemeId) {
    this.theme = theme
  }

  setComplete(v: boolean) {
    this.complete = v
    if (!v) this.svg.style.transform = ''
  }

  visBounds(): VisBounds {
    const r = this.svg.getBoundingClientRect()
    if (!r.width || !r.height) return { x0: 0, x1: VW, y0: 0, y1: VH }
    const scale = Math.max(r.width / VW, r.height / VH)
    const w = Math.min(VW, r.width / scale)
    const h = Math.min(VH, r.height / scale)
    return { x0: (VW - w) / 2, x1: (VW + w) / 2, y0: (VH - h) / 2, y1: (VH + h) / 2 }
  }

  toSvg(clientX: number, clientY: number) {
    const r = this.svg.getBoundingClientRect()
    const scale = Math.max(r.width / VW, r.height / VH)
    const ox = (r.width - VW * scale) / 2
    const oy = (r.height - VH * scale) / 2
    return { x: (clientX - r.left - ox) / scale, y: (clientY - r.top - oy) / scale }
  }

  buildScene() {
    const th = THEMES.find((t) => t.id === this.theme) || THEMES[0]
    this.svg.innerHTML = `
  <defs>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${th.top}"/>
      <stop offset="52%" stop-color="${th.mid}"/>
      <stop offset="100%" stop-color="${th.bot}"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sandg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${th.sand}"/><stop offset="100%" stop-color="#E6CFAE"/>
    </linearGradient>
    <radialGradient id="bub" cx="34%" cy="28%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity=".05"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${VW}" height="${VH}" fill="url(#water)"/>
  <g id="beams" opacity=".55">
    <path d="M 120 -40 L 330 -40 L 210 ${VH} L 40 ${VH} Z" fill="url(#beam)"/>
    <path d="M 520 -40 L 640 -40 L 560 ${VH} L 420 ${VH} Z" fill="url(#beam)" opacity=".7"/>
    <path d="M 830 -40 L 930 -40 L 900 ${VH} L 760 ${VH} Z" fill="url(#beam)" opacity=".5"/>
  </g>
  <g id="farDeco" opacity=".38"></g>
  <path d="M 0 ${FLOOR + 34} C 160 ${FLOOR - 22} 320 ${FLOOR + 22} 500 ${FLOOR - 8} C 690 ${FLOOR - 38} 860 ${FLOOR + 16} ${VW} ${FLOOR - 12} L ${VW} ${VH} L 0 ${VH} Z" fill="url(#sandg)"/>
  <g id="sandDots" opacity=".5"></g>
  <g id="decoLayer"></g>
  <g id="bubbleLayer"></g>
  <g id="fishLayer"></g>
  <g id="fxLayer"></g>`
    this.layers = {
      far: this.svg.querySelector('#farDeco')!,
      deco: this.svg.querySelector('#decoLayer')!,
      bub: this.svg.querySelector('#bubbleLayer')!,
      fish: this.svg.querySelector('#fishLayer')!,
      fx: this.svg.querySelector('#fxLayer')!,
      sand: this.svg.querySelector('#sandDots')!,
    }
    for (let i = 0; i < 7; i++) {
      const d = DECOS[i % 3]
      const g = el('g')
      g.setAttribute(
        'transform',
        `translate(${rnd(40, 960)},${FLOOR + rnd(-6, 26)}) scale(${rnd(1.6, 2.6)})`,
      )
      g.innerHTML = decoInner(d, nextSvgId())
      this.layers.far.appendChild(g)
    }
    for (let i = 0; i < 50; i++) {
      const c = el('circle')
      c.setAttribute('cx', String(rnd(0, VW)))
      c.setAttribute('cy', String(rnd(FLOOR + 16, VH - 6)))
      c.setAttribute('r', String(rnd(1.5, 5)))
      c.setAttribute('fill', '#ffffff')
      c.setAttribute('opacity', rnd(0.2, 0.65).toFixed(2))
      this.layers.sand.appendChild(c)
    }
  }

  rebuild(placed: PlacedFish[], decos: PlacedDeco[]) {
    this.fishObjs = []
    this.decoObjs = []
    this.bubbles = []
    this.buildScene()
    decos.forEach((r) => this.addDecoNode(r))
    placed.forEach((r) => this.addFishNode(r))
  }

  addFishNode(rec: PlacedFish) {
    const sp = this.spOf(rec.sp)
    if (!sp || !this.layers) return
    const g = el('g')
    g.setAttribute('class', 'tfish')
    g.dataset.uid = String(rec.uid)
    g.style.cursor = 'grab'
    const inner = el('g')
    inner.innerHTML = fishInner(sp, nextSvgId())
    g.appendChild(inner)
    this.layers.fish.appendChild(g)
    const o: FishObj = {
      rec,
      sp,
      g,
      inner,
      x: rec.x,
      y: rec.y,
      hx: rec.x,
      hy: rec.y,
      ph: rnd(0, 6.28),
      ph2: rnd(0, 6.28),
      dir: Math.random() < 0.5 ? -1 : 1,
      sc: sp.size * rnd(0.9, 1.1),
      spd: sp.spd * rnd(0.85, 1.15),
      drag: false,
      r: rnd(60, 140),
    }
    g.setAttribute('transform', `translate(${o.x},${o.y}) scale(${o.dir * o.sc},${o.sc})`)
    this.fishObjs.push(o)
    return o
  }

  addDecoNode(rec: PlacedDeco) {
    const d = this.dcOf(rec.dc)
    if (!d || !this.layers) return
    const g = el('g')
    g.setAttribute('class', 'tdeco')
    g.dataset.uid = String(rec.uid)
    g.style.cursor = 'grab'
    g.innerHTML = decoInner(d, nextSvgId())
    this.layers.deco.appendChild(g)
    const o: DecoObj = {
      rec,
      d,
      g,
      x: rec.x,
      y: rec.y,
      ph: rnd(0, 6.28),
      sc: rec.sc || rnd(1.5, 2.2),
      drag: false,
    }
    g.setAttribute('transform', `translate(${o.x},${o.y}) scale(${o.sc})`)
    this.decoObjs.push(o)
    return o
  }

  removeFishNode(uid: number) {
    const o = this.fishObjs.find((f) => f.rec.uid === uid)
    if (o) {
      for (let k = 0; k < 10; k++) this.spawnBubble(o.x + rnd(-30, 30), o.y, rnd(4, 12), true)
      o.g.remove()
      this.fishObjs = this.fishObjs.filter((f) => f !== o)
    }
  }

  removeDecoNode(uid: number) {
    const o = this.decoObjs.find((f) => f.rec.uid === uid)
    if (o) {
      for (let k = 0; k < 8; k++) this.spawnBubble(o.x + rnd(-20, 20), o.y, rnd(4, 10), true)
      o.g.remove()
      this.decoObjs = this.decoObjs.filter((f) => f !== o)
    }
  }

  findFish(uid: number) {
    return this.fishObjs.find((f) => f.rec.uid === uid)
  }

  findDeco(uid: number) {
    return this.decoObjs.find((f) => f.rec.uid === uid)
  }

  spawnBubble(x: number, y: number, r: number, fast?: boolean) {
    if (!this.layers) return
    const c = el('circle')
    c.setAttribute('r', String(r))
    c.setAttribute('fill', 'url(#bub)')
    c.setAttribute('stroke', '#ffffff')
    c.setAttribute('stroke-opacity', '.45')
    c.setAttribute('stroke-width', '1')
    this.layers.bub.appendChild(c)
    this.bubbles.push({
      el: c,
      x,
      y,
      r,
      vy: -(fast ? rnd(1.6, 3.2) : rnd(0.5, 1.4)),
      ph: rnd(0, 6.28),
    })
  }

  ripple(x: number, y: number, color = '#ffffff') {
    if (!this.layers) return
    const c = el('circle')
    c.setAttribute('cx', String(x))
    c.setAttribute('cy', String(y))
    c.setAttribute('r', '4')
    c.setAttribute('fill', 'none')
    c.setAttribute('stroke', color)
    c.setAttribute('stroke-width', '4')
    c.setAttribute('opacity', '.95')
    this.layers.fx.appendChild(c)
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 900)
      c.setAttribute('r', String(4 + p * 180))
      c.setAttribute('opacity', String((1 - p) * 0.9))
      c.setAttribute('stroke-width', String(4 * (1 - p) + 0.6))
      if (p < 1) requestAnimationFrame(step)
      else c.remove()
    }
    requestAnimationFrame(step)
    for (let i = 0; i < 7; i++) this.spawnBubble(x + rnd(-40, 40), y + rnd(-10, 20), rnd(4, 11), true)
  }

  burstBubbles(n: number, fromBottom = true) {
    for (let i = 0; i < n; i++) {
      setTimeout(
        () =>
          this.spawnBubble(
            rnd(20, VW - 20),
            fromBottom ? VH + 10 : rnd(200, VH),
            rnd(4, 14),
            true,
          ),
        i * (fromBottom ? 60 : 30),
      )
    }
  }

  shuffleFish() {
    const B = this.visBounds()
    this.fishObjs.forEach((o) => {
      o.hx = rnd(B.x0 + 110, B.x1 - 110)
      o.hy = rnd(Math.max(100, B.y0 + 90), FLOOR - 80)
      o.r = rnd(50, Math.min(150, (B.x1 - B.x0) / 6))
      o.rec.x = o.hx
      o.rec.y = o.hy
    })
    this.burstBubbles(12)
    this.ripple(VW / 2, VH / 2)
  }

  private loop(t: number) {
    const dt = Math.min(50, t - this.last) / 16.67
    this.last = t
    const time = t / 1000
    this.visTimer -= dt
    if (this.visTimer <= 0) {
      this.visTimer = 40
      this.VIS = this.visBounds()
    }
    this.bubTimer -= dt
    if (this.bubTimer <= 0) {
      this.bubTimer = rnd(14, 40)
      if (this.bubbles.length < 40) this.spawnBubble(rnd(20, VW - 20), VH + 10, rnd(3, 10))
    }
    this.bubbles = this.bubbles.filter((b) => {
      b.y += b.vy * dt * 1.6
      b.ph += 0.04 * dt
      const x = b.x + Math.sin(b.ph) * 10
      b.el.setAttribute('cx', String(x))
      b.el.setAttribute('cy', String(b.y))
      if (b.y < -20) {
        b.el.remove()
        return false
      }
      return true
    })
    this.fishObjs.forEach((o) => {
      if (!o.drag) {
        o.ph += 0.012 * o.spd * dt
        o.ph2 += 0.021 * dt
        const tx = o.hx + Math.cos(o.ph) * o.r
        const ty = o.hy + Math.sin(o.ph * 1.7) * o.r * 0.35 + Math.sin(o.ph2) * 7
        const dx = tx - o.x
        const dy = ty - o.y
        o.x += dx * 0.045 * dt
        o.y += dy * 0.045 * dt
        if (Math.abs(dx) > 1) o.dir = dx > 0 ? 1 : -1
        const B = this.VIS
        o.x = clamp(o.x, B.x0 + 70, B.x1 - 70)
        o.y = clamp(o.y, Math.max(60, B.y0 + 50), FLOOR - 10)
        o.hx = clamp(o.hx, B.x0 + 80, B.x1 - 80)
        o.hy = clamp(o.hy, Math.max(70, B.y0 + 60), FLOOR - 40)
      }
      const tilt = Math.sin(o.ph2) * 5
      o.g.setAttribute(
        'transform',
        `translate(${o.x.toFixed(2)},${o.y.toFixed(2)}) scale(${(o.dir * o.sc).toFixed(3)},${o.sc.toFixed(3)}) rotate(${(tilt * o.dir).toFixed(2)})`,
      )
      const wig = 1 + Math.sin(time * 4 * o.spd + o.ph) * 0.035
      o.inner.setAttribute('transform', `scale(${wig.toFixed(3)},${(2 - wig).toFixed(3)})`)
    })
    this.decoObjs.forEach((o) => {
      const sway = Math.sin(time * 1.1 + o.ph) * (this.complete ? 4.2 : 2.6)
      o.g.setAttribute(
        'transform',
        `translate(${o.x.toFixed(1)},${o.y.toFixed(1)}) rotate(${sway.toFixed(2)}) scale(${o.sc.toFixed(2)})`,
      )
    })
    if (this.complete) {
      this.waveT += dt * 0.02
      const s = 1 + Math.sin(this.waveT) * 0.006
      this.svg.style.transform = `scale(${s})`
    } else {
      this.svg.style.transform = ''
    }
  }
}
