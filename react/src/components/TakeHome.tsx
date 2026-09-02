import { useAquarium } from '../hooks/AquariumContext'
import { useReveal } from '../hooks/useReveal'

export function TakeHome() {
  const { state, complete, takeHome } = useAquarium()
  useReveal([complete, state.placed.length, state.decos.length])
  const needF = Math.max(0, 6 - state.placed.length)
  const needD = Math.max(0, 3 - state.decos.length)

  return (
    <section className="takehome" id="takehome">
      <div className="sec-head reveal">
        <div className="sec-num">04 — TAKE IT HOME</div>
        <h2 className="sec-title">
          できあがった水槽を、<em>持ち帰る</em>。
        </h2>
      </div>
      <div className="th-card reveal">
        <h3>「わたしの水族館」を、おうちへ。</h3>
        <p>
          當水槽裡有 <b>6 隻以上的魚</b> 與 <b>3 個以上的裝飾</b>，牠就完成了。
          <br />
          我們會把這一刻的水槽封存成一張紀念卡片，讓你下載、收藏，或是分享出去。
        </p>
        <div className="m-btns">
          <button
            className="btn btn-primary"
            type="button"
            disabled={!complete}
            onClick={() => void takeHome()}
          >
            🏠 水槽を持ち帰る ／ 帶回家
          </button>
          <a href="#studio" className="btn btn-ghost">
            水槽にもどる
          </a>
        </div>
        <div className="th-lock">
          {complete ? (
            <b style={{ color: '#3FA9C9' }}>水槽が完成しました！ 現在可以帶回家了 ✨</b>
          ) : (
            <>
              まだ完成していません — あと <b>{needF}</b> 匹と <b>{needD}</b> こ
            </>
          )}
        </div>
      </div>
    </section>
  )
}
