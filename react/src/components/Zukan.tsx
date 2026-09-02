import { SPECIES, TIERS } from '../data/catalog'
import { useAquarium } from '../hooks/AquariumContext'
import { useReveal } from '../hooks/useReveal'
import { fishSVGString } from '../lib/svgCreatures'
import type { Rare } from '../data/types'

const RARE_CLASS: Record<Rare, string> = {
  N: 'r-n',
  R: 'r-r',
  SR: 'r-s',
  SSR: 'r-l',
}

export function Zukan() {
  const { state, isFishUnlocked, unlocking, showToast, startPaletteDrag, movePaletteDrag, endPaletteDrag, cancelPaletteDrag } =
    useAquarium()
  useReveal([state.collected.length, unlocking.join(',')])

  const next = TIERS.find((t) => t.need > state.collected.length)
  const nextNeed = next ? next.need - state.collected.length : null

  return (
    <section id="zukan">
      <div className="sec-head reveal">
        <div className="sec-num">02 — COLLECTION</div>
        <h2 className="sec-title">
          おさかな図鑑 ／ <em>魚類圖鑑</em>
        </h2>
        <p className="sec-desc">
          收集愈多種類，愈深的水域就會被打開。把牠們拖進下方的水槽，即可登錄到圖鑑裡。
        </p>
      </div>
      <div className="zukan-wrap">
        <div className="zukan-bar reveal">
          <span className="lbl">
            コレクション <b>{state.collected.length}</b>／<b>{SPECIES.length}</b> 種
          </span>
          <div className="progress-track">
            <i style={{ width: `${(state.collected.length / SPECIES.length) * 100}%` }} />
          </div>
          <span className="chip">
            つぎの解放まで <b>{nextNeed ?? '—'}</b> 種
          </span>
        </div>
        <div className="fish-grid">
          {SPECIES.map((sp) => {
            const unlocked = isFishUnlocked(sp)
            const n = state.placed.filter((p) => p.sp === sp.id).length
            const unlockingCls = unlocking.includes(sp.id) ? ' unlocking' : ''
            return (
              <div
                key={sp.id}
                className={`fish-card reveal${unlocked ? '' : ' locked'}${unlockingCls}`}
                data-sp={sp.id}
                data-type="fish"
                data-id={sp.id}
                onPointerDown={(e) => {
                  if (!unlocked) {
                    showToast('🔒', 'まだ会えません', '再多收集幾種魚就會出現囉')
                    return
                  }
                  e.preventDefault()
                  const start = { x: e.clientX, y: e.clientY }
                  let moved = false
                  startPaletteDrag('fish', sp.id, e.clientX, e.clientY)
                  const onMove = (ev: PointerEvent) => {
                    if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) moved = true
                    movePaletteDrag(ev.clientX, ev.clientY)
                  }
                  const onUp = (ev: PointerEvent) => {
                    window.removeEventListener('pointermove', onMove)
                    window.removeEventListener('pointerup', onUp)
                    window.removeEventListener('pointercancel', onCancel)
                    endPaletteDrag(ev.clientX, ev.clientY, moved)
                  }
                  const onCancel = () => {
                    window.removeEventListener('pointermove', onMove)
                    window.removeEventListener('pointerup', onUp)
                    window.removeEventListener('pointercancel', onCancel)
                    cancelPaletteDrag()
                  }
                  window.addEventListener('pointermove', onMove)
                  window.addEventListener('pointerup', onUp)
                  window.addEventListener('pointercancel', onCancel)
                }}
              >
                <span className={`fc-rare ${RARE_CLASS[sp.rare]}`}>{sp.rare}</span>
                <span className={`fc-count${n ? ' on' : ''}`}>×{n}</span>
                <div className="newshine" />
                <div
                  className="fish-art"
                  dangerouslySetInnerHTML={{ __html: fishSVGString(sp, 130) }}
                />
                <div className="fc-name">{unlocked ? sp.ja : '？？？？？'}</div>
                <div className="fc-sub">{unlocked ? sp.ro : 'LOCKED'}</div>
                {!unlocked && (
                  <div className="lock-note">{TIERS[sp.tier].need} 種あつめて解放</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
