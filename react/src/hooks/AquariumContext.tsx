import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { DECOS, FLOOR, SPECIES, STORAGE_KEY, TIERS, VH } from '../data/catalog'
import type {
  DragType,
  PlacedDeco,
  PlacedFish,
  Species,
  TankState,
  ThemeId,
  ToastPayload,
} from '../data/types'
import { makeCertificate } from '../lib/certificate'
import { decoSVGString, fishSVGString } from '../lib/svgCreatures'
import { TankEngine } from '../lib/tankEngine'
import { clamp, prefersReducedMotion, rnd } from '../lib/utils'

interface AquariumCtx {
  state: TankState
  tier: number
  complete: boolean
  unlocking: string[]
  toast: ToastPayload | null
  certOpen: boolean
  certImg: string
  certNames: string[]
  certReady: boolean
  dropHot: boolean
  ghostHtml: string | null
  ghostPos: { x: number; y: number }
  svgRef: React.RefObject<SVGSVGElement | null>
  glassRef: React.RefObject<HTMLDivElement | null>
  frameRef: React.RefObject<HTMLDivElement | null>
  engineRef: React.MutableRefObject<TankEngine | null>
  isFishUnlocked: (sp: Species) => boolean
  isDecoUnlocked: (tier: number) => boolean
  showToast: (ico: string, txt: string, sub?: string) => void
  confetti: () => void
  setTheme: (id: ThemeId) => void
  shuffle: () => void
  clearTank: () => void
  takeHome: () => Promise<void>
  closeCert: () => void
  downloadCert: () => void
  startPaletteDrag: (type: DragType, id: string, x: number, y: number) => void
  movePaletteDrag: (x: number, y: number) => void
  endPaletteDrag: (x: number, y: number, moved: boolean) => void
  cancelPaletteDrag: () => void
  beginTankDrag: (kind: 'fish' | 'deco', uid: number) => void
  moveTankDrag: (x: number, y: number) => void
  endTankDrag: (x: number, y: number, moved: boolean) => void
  markUnlocking: (ids: string[]) => void
}

const Ctx = createContext<AquariumCtx | null>(null)

function loadState(): TankState {
  const base: TankState = { placed: [], decos: [], collected: [], theme: 'day' }
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (s?.placed) return { ...base, ...s }
  } catch {
    /* ignore */
  }
  return base
}

function saveState(state: TankState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function curTier(collected: string[]) {
  let t = 0
  TIERS.forEach((x) => {
    if (collected.length >= x.need) t = x.n
  })
  return t
}

export function AquariumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TankState>(loadState)
  const [toast, setToast] = useState<ToastPayload | null>(null)
  const [unlocking, setUnlocking] = useState<string[]>([])
  const [complete, setComplete] = useState(false)
  const [certOpen, setCertOpen] = useState(false)
  const [certImg, setCertImg] = useState('')
  const [certNames, setCertNames] = useState<string[]>([])
  const [certReady, setCertReady] = useState(false)
  const [dropHot, setDropHot] = useState(false)
  const [ghostHtml, setGhostHtml] = useState<string | null>(null)
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 })

  const svgRef = useRef<SVGSVGElement | null>(null)
  const glassRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const engineRef = useRef<TankEngine | null>(null)
  const stateRef = useRef(state)
  const dragSrc = useRef<{ type: DragType; id: string } | null>(null)
  const dragObj = useRef<{ kind: 'fish' | 'deco'; uid: number } | null>(null)
  const toastTimer = useRef(0)
  const scrolledOnce = useRef(false)
  const uidSeq = useRef(Date.now() % 100000)
  const completeRef = useRef(false)
  const seeded = useRef(false)

  stateRef.current = state
  const tier = useMemo(() => curTier(state.collected), [state.collected])

  const spOf = useCallback((id: string) => SPECIES.find((s) => s.id === id), [])
  const dcOf = useCallback((id: string) => DECOS.find((d) => d.id === id), [])
  const isFishUnlocked = useCallback((sp: Species) => sp.tier <= tier, [tier])
  const isDecoUnlocked = useCallback((t: number) => t <= tier, [tier])

  const showToast = useCallback((ico: string, txt: string, sub?: string) => {
    setToast({ ico, txt, sub })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3000)
  }, [])

  const confetti = useCallback(() => {
    if (prefersReducedMotion()) return
    const wrap = document.createElement('div')
    wrap.className = 'confetti'
    document.body.appendChild(wrap)
    const cols = ['#9FE0EF', '#FFB3C7', '#FFE4A3', '#BFEFD6', '#CFC1F5', '#FFFFFF']
    for (let i = 0; i < 46; i++) {
      const b = document.createElement('i')
      b.className = 'cf'
      const s = rnd(6, 20)
      b.style.cssText = `width:${s}px;height:${s}px;left:${rnd(0, 100)}vw;bottom:-40px;
        background:radial-gradient(circle at 34% 30%,#fff,${cols[i % cols.length]});
        opacity:.9;animation-duration:${rnd(2.2, 4.2)}s;animation-delay:${rnd(0, 0.9)}s`
      wrap.appendChild(b)
    }
    setTimeout(() => wrap.remove(), 5200)
  }, [])

  const markUnlocking = useCallback((ids: string[]) => {
    setUnlocking((prev) => [...new Set([...prev, ...ids])])
    ids.forEach((id, i) => {
      setTimeout(() => {
        setUnlocking((prev) => prev.filter((x) => x !== id))
      }, 1500 + i * 50)
    })
  }, [])

  const inTank = useCallback((cx: number, cy: number) => {
    const r = glassRef.current?.getBoundingClientRect()
    if (!r) return false
    return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom
  }, [])

  const scrollTankIntoView = useCallback(() => {
    if (scrolledOnce.current) return
    scrolledOnce.current = true
    const r = glassRef.current?.getBoundingClientRect()
    if (!r) return
    if (r.top < 0 || r.bottom > innerHeight) {
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const applyState = useCallback((next: TankState, opts?: { rebuild?: boolean }) => {
    stateRef.current = next
    setState(next)
    saveState(next)
    if (opts?.rebuild) engineRef.current?.rebuild(next.placed, next.decos)
  }, [])

  const onCollect = useCallback(
    (sp: Species, collected: string[]) => {
      const before = curTier(collected.filter((id) => id !== sp.id))
      markUnlocking([sp.id])
      showToast('✨', 'あたらしいおさかな！', `${sp.ja} を図鑑に登録しました`)
      setTimeout(() => {
        const after = curTier(collected)
        if (after > before) {
          const T = TIERS[after]
          showToast('🌊', `${T.label} が解放されました！`, '新的魚與裝飾已經解鎖 — 去圖鑑看看吧')
          confetti()
          const newOnes = SPECIES.filter((s) => s.tier === after).map((s) => s.id)
          setTimeout(() => markUnlocking(newOnes), 300)
        }
      }, 40)
    },
    [confetti, markUnlocking, showToast],
  )

  const checkComplete = useCallback(
    (placed: PlacedFish[], decos: PlacedDeco[]) => {
      const done = placed.length >= 6 && decos.length >= 3
      const eng = engineRef.current
      if (done && !completeRef.current) {
        completeRef.current = true
        setComplete(true)
        eng?.setComplete(true)
        eng?.burstBubbles(26)
        eng?.ripple(500, 350, '#FFFFFF')
        confetti()
        showToast('🏠', '水槽ができました！', 'スクロールして「持ち帰る」へ — 可以帶回家了')
      } else if (!done && completeRef.current) {
        completeRef.current = false
        setComplete(false)
        eng?.setComplete(false)
      }
    },
    [confetti, showToast],
  )

  const addFish = useCallback(
    (spId: string, x: number, y: number, silent = false) => {
      const sp = spOf(spId)
      const eng = engineRef.current
      if (!sp || !eng || sp.tier > curTier(stateRef.current.collected)) return
      if (stateRef.current.placed.length >= 26) {
        showToast('🫧', '水槽がいっぱいです', '再放不下囉，先讓牠們有點空間吧')
        return
      }
      const B = eng.visBounds()
      const rec: PlacedFish = {
        uid: ++uidSeq.current,
        sp: spId,
        x: clamp(x, B.x0 + 90, B.x1 - 90),
        y: clamp(y, Math.max(80, B.y0 + 70), FLOOR - 40),
      }
      const next: TankState = {
        ...stateRef.current,
        placed: [...stateRef.current.placed, rec],
      }
      const isNew = !stateRef.current.collected.includes(spId)
      if (isNew) next.collected = [...stateRef.current.collected, spId]
      eng.addFishNode(rec)
      eng.ripple(rec.x, rec.y)
      applyState(next)
      if (isNew) onCollect(sp, next.collected)
      else if (!silent) showToast('🐟', `${sp.ja} をいれました`, '已放入水槽 — 拖曳可以調整位置')
      checkComplete(next.placed, next.decos)
    },
    [applyState, checkComplete, onCollect, showToast, spOf],
  )

  const addDeco = useCallback(
    (dcId: string, x: number, y: number, silent = false) => {
      const d = dcOf(dcId)
      const eng = engineRef.current
      if (!d || !eng || d.tier > curTier(stateRef.current.collected)) return
      if (stateRef.current.decos.length >= 14) {
        showToast('🌿', 'かざりがいっぱいです', '裝飾已經很豐富囉')
        return
      }
      const B = eng.visBounds()
      const rec: PlacedDeco = {
        uid: ++uidSeq.current,
        dc: dcId,
        x: clamp(x, B.x0 + 70, B.x1 - 70),
        y: clamp(y, FLOOR - 60, VH - 90),
        sc: rnd(1.5, 2.3),
      }
      const next: TankState = {
        ...stateRef.current,
        decos: [...stateRef.current.decos, rec],
      }
      eng.addDecoNode(rec)
      eng.ripple(rec.x, rec.y - 30, '#FFFFFF')
      applyState(next)
      if (!silent) showToast('🌿', `${d.ja} をかざりました`, '裝飾完成 — 也可以拖曳移動')
      checkComplete(next.placed, next.decos)
    },
    [applyState, checkComplete, dcOf, showToast],
  )

  const removeFish = useCallback(
    (uid: number) => {
      engineRef.current?.removeFishNode(uid)
      const next: TankState = {
        ...stateRef.current,
        placed: stateRef.current.placed.filter((p) => p.uid !== uid),
      }
      applyState(next)
      showToast('🫧', 'またね', '已放生 — 圖鑑紀錄仍然保留著')
      checkComplete(next.placed, next.decos)
    },
    [applyState, checkComplete, showToast],
  )

  const removeDeco = useCallback(
    (uid: number) => {
      engineRef.current?.removeDecoNode(uid)
      const next: TankState = {
        ...stateRef.current,
        decos: stateRef.current.decos.filter((p) => p.uid !== uid),
      }
      applyState(next)
      checkComplete(next.placed, next.decos)
    },
    [applyState, checkComplete],
  )

  // Init engine once SVG mounts
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const eng = new TankEngine(svg, spOf, dcOf)
    eng.setTheme(stateRef.current.theme)
    eng.rebuild(stateRef.current.placed, stateRef.current.decos)
    eng.start()
    engineRef.current = eng
    const done = stateRef.current.placed.length >= 6 && stateRef.current.decos.length >= 3
    completeRef.current = done
    setComplete(done)
    eng.setComplete(done)

    if (
      !seeded.current &&
      !stateRef.current.placed.length &&
      !stateRef.current.decos.length &&
      !stateRef.current.collected.length
    ) {
      seeded.current = true
      setTimeout(() => addFish('guppy', rnd(300, 700), rnd(200, 380), true), 2600)
    }

    return () => {
      eng.stop()
      engineRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setTheme = useCallback(
    (id: ThemeId) => {
      const next = { ...stateRef.current, theme: id }
      engineRef.current?.setTheme(id)
      applyState(next, { rebuild: true })
      const t = THEMES_LABEL(id)
      showToast('🎨', t, '水の色を変えました')
    },
    [applyState, showToast],
  )

  const shuffle = useCallback(() => {
    engineRef.current?.shuffleFish()
    saveState(stateRef.current)
    showToast('🌀', 'およいでいます', '讓魚兒重新散開游動')
  }, [showToast])

  const clearTank = useCallback(() => {
    if (!stateRef.current.placed.length && !stateRef.current.decos.length) return
    engineRef.current?.burstBubbles(24, false)
    setTimeout(() => {
      const next: TankState = { ...stateRef.current, placed: [], decos: [] }
      applyState(next, { rebuild: true })
      completeRef.current = false
      setComplete(false)
      engineRef.current?.setComplete(false)
      showToast('🫧', '水をぬきました', '水槽已清空 — 圖鑑收藏依然保留')
    }, 420)
  }, [applyState, showToast])

  const takeHome = useCallback(async () => {
    const svg = svgRef.current
    if (!svg) return
    try {
      setCertReady(false)
      setCertOpen(true)
      confetti()
      const { dataUrl, names } = await makeCertificate(svg, stateRef.current, spOf)
      setCertImg(dataUrl)
      setCertNames(names)
      setCertReady(true)
    } catch {
      showToast('⚠️', 'カードをつくれませんでした', '請改用 Chrome / Edge 開啟')
    }
  }, [confetti, showToast, spOf])

  const closeCert = useCallback(() => setCertOpen(false), [])

  const downloadCert = useCallback(() => {
    if (!certReady || !certImg) {
      showToast('⏳', 'まだ準備中です', '請再等一下下')
      return
    }
    const a = document.createElement('a')
    a.href = certImg
    a.download = 'mizutama-aquarium-my-tank.png'
    a.click()
    showToast('⬇', 'ほぞんしました', '紀念卡片已下載，歡迎分享 ✨')
  }, [certImg, certReady, showToast])

  const startPaletteDrag = useCallback(
    (type: DragType, id: string, x: number, y: number) => {
      dragSrc.current = { type, id }
      const html =
        type === 'fish'
          ? fishSVGString(spOf(id)!, 120)
          : decoSVGString(dcOf(id)!, 80)
      setGhostHtml(html)
      setGhostPos({ x, y })
      setDropHot(true)
    },
    [dcOf, spOf],
  )

  const movePaletteDrag = useCallback(
    (x: number, y: number) => {
      if (!dragSrc.current) return
      setGhostPos({ x, y })
      setDropHot(inTank(x, y))
    },
    [inTank],
  )

  const endPaletteDrag = useCallback(
    (x: number, y: number, moved: boolean) => {
      setDropHot(false)
      setGhostHtml(null)
      const src = dragSrc.current
      dragSrc.current = null
      if (!src) return
      const eng = engineRef.current
      if (!eng) return
      let p: { x: number; y: number } | null = null
      if (inTank(x, y)) p = eng.toSvg(x, y)
      else if (!moved) {
        const B = eng.visBounds()
        p = {
          x: rnd(B.x0 + 120, B.x1 - 120),
          y: rnd(Math.max(140, B.y0 + 110), FLOOR - 120),
        }
      } else return
      if (src.type === 'fish') addFish(src.id, p.x, p.y)
      else addDeco(src.id, p.x, clamp(p.y, FLOOR - 70, VH - 70))
      scrollTankIntoView()
    },
    [addDeco, addFish, inTank, scrollTankIntoView],
  )

  const cancelPaletteDrag = useCallback(() => {
    dragSrc.current = null
    setGhostHtml(null)
    setDropHot(false)
  }, [])

  const beginTankDrag = useCallback((kind: 'fish' | 'deco', uid: number) => {
    const eng = engineRef.current
    if (!eng) return
    const o = kind === 'fish' ? eng.findFish(uid) : eng.findDeco(uid)
    if (!o) return
    o.drag = true
    o.g.style.cursor = 'grabbing'
    o.g.parentNode?.appendChild(o.g)
    dragObj.current = { kind, uid }
  }, [])

  const moveTankDrag = useCallback(
    (x: number, y: number) => {
      const info = dragObj.current
      const eng = engineRef.current
      if (!info || !eng) return
      const p = eng.toSvg(x, y)
      if (info.kind === 'fish') {
        const o = eng.findFish(info.uid)
        if (!o) return
        o.x = p.x
        o.y = p.y
        o.hx = clamp(p.x, 90, 910)
        o.hy = clamp(p.y, 80, FLOOR - 30)
        o.g.style.opacity = inTank(x, y) ? '1' : '0.4'
      } else {
        const o = eng.findDeco(info.uid)
        if (!o) return
        o.x = clamp(p.x, 40, 960)
        o.y = clamp(p.y, FLOOR - 80, VH - 60)
        o.g.style.opacity = inTank(x, y) ? '1' : '0.4'
      }
    },
    [inTank],
  )

  const endTankDrag = useCallback(
    (x: number, y: number, moved: boolean) => {
      const info = dragObj.current
      const eng = engineRef.current
      dragObj.current = null
      if (!info || !eng) return
      const o = info.kind === 'fish' ? eng.findFish(info.uid) : eng.findDeco(info.uid)
      if (!o) return
      o.drag = false
      o.g.style.cursor = 'grab'
      o.g.style.opacity = '1'
      if (!inTank(x, y) && moved) {
        if (info.kind === 'fish') removeFish(info.uid)
        else removeDeco(info.uid)
        return
      }
      if (info.kind === 'fish') {
        const f = o as ReturnType<TankEngine['findFish']>
        if (f) {
          f.rec.x = f.hx
          f.rec.y = f.hy
        }
      } else {
        const d = o as ReturnType<TankEngine['findDeco']>
        if (d) {
          d.rec.x = d.x
          d.rec.y = d.y
        }
      }
      saveState(stateRef.current)
      if (moved) eng.ripple(o.x, o.y)
    },
    [inTank, removeDeco, removeFish],
  )

  const value: AquariumCtx = {
    state,
    tier,
    complete,
    unlocking,
    toast,
    certOpen,
    certImg,
    certNames,
    certReady,
    dropHot,
    ghostHtml,
    ghostPos,
    svgRef,
    glassRef,
    frameRef,
    engineRef,
    isFishUnlocked,
    isDecoUnlocked,
    showToast,
    confetti,
    setTheme,
    shuffle,
    clearTank,
    takeHome,
    closeCert,
    downloadCert,
    startPaletteDrag,
    movePaletteDrag,
    endPaletteDrag,
    cancelPaletteDrag,
    beginTankDrag,
    moveTankDrag,
    endTankDrag,
    markUnlocking,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function THEMES_LABEL(id: ThemeId) {
  return id === 'day' ? 'ひるのうみ' : id === 'dusk' ? 'ゆうぐれ' : 'よるのうみ'
}

export function useAquarium() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAquarium must be used within AquariumProvider')
  return ctx
}
