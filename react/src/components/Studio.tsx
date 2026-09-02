import { useEffect, useState } from 'react'
import { DECOS, SPECIES, THEMES, TIERS } from '../data/catalog'
import { useAquarium } from '../hooks/AquariumContext'
import { useReveal } from '../hooks/useReveal'
import { decoSVGString, fishSVGString } from '../lib/svgCreatures'

export function Studio() {
  const aq = useAquarium()
  const [tab, setTab] = useState<'fish' | 'deco'>('fish')
  useReveal([aq.state.collected.length, aq.complete])

  const nf = aq.state.placed.length
  const nd = aq.state.decos.length
  const pct = Math.round(
    Math.min(1, (Math.min(nf, 6) / 6) * 0.65 + (Math.min(nd, 3) / 3) * 0.35) * 100,
  )

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null
      const tf = t?.closest?.('.tfish, .tdeco') as HTMLElement | null
      if (!tf) return
      const uid = Number(tf.dataset.uid)
      const kind = tf.classList.contains('tfish') ? 'fish' : 'deco'
      e.preventDefault()
      const start = { x: e.clientX, y: e.clientY }
      let moved = false
      aq.beginTankDrag(kind, uid)
      const onMove = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) moved = true
        aq.moveTankDrag(ev.clientX, ev.clientY)
      }
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        aq.endTankDrag(ev.clientX, ev.clientY, moved)
      }
      const onCancel = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        aq.endTankDrag(start.x, start.y, false)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onCancel)
    }
    document.addEventListener('pointerdown', onDown, { passive: false })
    return () => document.removeEventListener('pointerdown', onDown)
  }, [aq])

  const bindPalette = (type: 'fish' | 'deco', id: string, unlocked: boolean) => ({
    onPointerDown: (e: React.PointerEvent) => {
      if (!unlocked) {
        aq.showToast('🔒', 'まだ会えません', '再多收集幾種魚就會出現囉')
        return
      }
      e.preventDefault()
      const start = { x: e.clientX, y: e.clientY }
      let moved = false
      aq.startPaletteDrag(type, id, e.clientX, e.clientY)
      const onMove = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) moved = true
        aq.movePaletteDrag(ev.clientX, ev.clientY)
      }
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        aq.endPaletteDrag(ev.clientX, ev.clientY, moved)
      }
      const onCancel = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        aq.cancelPaletteDrag()
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onCancel)
    },
  })

  return (
    <section className="studio" id="studio">
      <div className="sec-head reveal">
        <div className="sec-num">03 — MY TANK</div>
        <h2 className="sec-title">
          じぶんだけの<em>水槽</em>をつくる。
        </h2>
        <p className="sec-desc">
          把右邊（手機為下方）的魚與裝飾拖進水槽，水槽裡的一切都能自由移動。
          <br />
          Desktop 拖曳 ／ Mobile 點一下即可放入。
        </p>
      </div>

      <div className="studio-shell">
        <div className="tank-outer">
          <div
            className={`tank-frame${aq.complete ? ' complete' : ''}`}
            ref={aq.frameRef}
            id="tankFrame"
          >
            <div className="tank-glass" id="tankGlass" ref={aq.glassRef}>
              <svg
                id="tankSvg"
                ref={aq.svgRef}
                viewBox="0 0 1000 700"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
              />
              <div className="tank-caustic" />
              <div className="tank-shine" />
              <div className={`tank-dropzone${aq.dropHot ? ' hot' : ''}`} id="dropzone" />
              <div className={`tank-empty${nf + nd > 0 ? ' hide' : ''}`} id="tankEmpty">
                <b>まだ、だれもいません。</b>
                <span>水槽はまだ空っぽ — 從圖鑑或側邊選單選一隻魚，放進來吧</span>
              </div>
            </div>
          </div>
          <div className="tank-toolbar">
            <div className="tank-stats">
              <span className="chip">
                🐟 おさかな <b>{nf}</b>
              </span>
              <span className="chip">
                🌿 かざり <b>{nd}</b>
              </span>
              <span className="chip">
                ✨ 完成度 <b>{pct}</b>%
              </span>
            </div>
            <div className="tool-btns">
              <button className="tbtn" type="button" onClick={aq.shuffle}>
                🌀 およがせる
              </button>
              <button className="tbtn warn" type="button" onClick={aq.clearTank}>
                🫧 水をぬく
              </button>
            </div>
          </div>
        </div>

        <aside className="palette">
          <div className="pal-tabs">
            <button
              type="button"
              className={tab === 'fish' ? 'on' : undefined}
              onClick={() => setTab('fish')}
            >
              おさかな
            </button>
            <button
              type="button"
              className={tab === 'deco' ? 'on' : undefined}
              onClick={() => setTab('deco')}
            >
              かざり
            </button>
          </div>
          <div className="pal-body">
            <div className="pal-grid" style={{ display: tab === 'fish' ? 'grid' : 'none' }}>
              {SPECIES.map((sp) => {
                const u = aq.isFishUnlocked(sp)
                return (
                  <div
                    key={sp.id}
                    className={`pal-item${u ? '' : ' locked'}`}
                    data-type="fish"
                    data-id={sp.id}
                    title={u ? sp.ja : '？？？'}
                    {...bindPalette('fish', sp.id, u)}
                    dangerouslySetInnerHTML={{
                      __html:
                        fishSVGString(sp, 60) +
                        (u ? '' : `<span class="mini-lock">${TIERS[sp.tier].need}種</span>`),
                    }}
                  />
                )
              })}
            </div>
            <div className="pal-grid" style={{ display: tab === 'deco' ? 'grid' : 'none' }}>
              {DECOS.map((dc) => {
                const u = aq.isDecoUnlocked(dc.tier)
                return (
                  <div
                    key={dc.id}
                    className={`pal-item${u ? '' : ' locked'}`}
                    data-type="deco"
                    data-id={dc.id}
                    title={u ? dc.ja : '？？？'}
                    {...bindPalette('deco', dc.id, u)}
                    dangerouslySetInnerHTML={{
                      __html:
                        decoSVGString(dc, 52) +
                        (u ? '' : `<span class="mini-lock">${TIERS[dc.tier].need}種</span>`),
                    }}
                  />
                )
              })}
            </div>
          </div>
          <p className="pal-section-title" style={{ marginTop: 18 }}>
            WATER TONE ／ 水の色
          </p>
          <div className="theme-row">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`theme-dot${aq.state.theme === t.id ? ' on' : ''}`}
                title={t.ja}
                style={{
                  background: `linear-gradient(160deg,${t.top},${t.mid} 55%,${t.bot})`,
                }}
                onClick={() => aq.setTheme(t.id)}
              />
            ))}
          </div>
          <p className="pal-hint">
            ◍ 拖曳（或點擊）圖示即可放入水槽
            <br />
            ◍ 水槽內的魚可以再次拖曳調整位置
            <br />
            ◍ 把牠拖出水槽外＝放生（會冒出泡泡）
            <br />
            ◍ 放入 6 隻魚 ＋ 3 個裝飾＝水槽完成 ✨
          </p>
        </aside>
      </div>

      <div className="rail" id="rail">
        {TIERS.map((t) => {
          const done = aq.state.collected.length >= t.need
          return (
            <div key={t.n} className={`rail-step reveal${done ? ' done' : ''}`}>
              <span className="tick">✨</span>
              <div className="rs-n">STAGE 0{t.n + 1}</div>
              <h4>{t.label}</h4>
              <p>{t.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
