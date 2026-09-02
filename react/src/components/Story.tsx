export function Story() {
  return (
    <section className="story" id="story">
      <div className="sec-head reveal">
        <div className="sec-num">01 — CONCEPT</div>
        <h2 className="sec-title">
          ぜんぶ、<em>ひとつぶの水</em>からはじまる。
        </h2>
        <p className="sec-desc">
          みずたま水族館的每一種生物，都誕生於一顆落下的水滴。
          <br />
          水滴裡有光、有氣泡、有小小的圓點花紋——那就是「みずたま（水玉）」的由來。
          <br />
          我們相信，海洋不必很大，只要夠透明、夠溫柔，一個小水槽就能裝下一整個世界。
        </p>
      </div>
      <div className="story-grid">
        <div className="story-card reveal">
          <svg className="story-ico" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="si1" cx="34%" cy="28%">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#9FE0EF" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="34" fill="url(#si1)" />
            <circle cx="38" cy="40" r="9" fill="#fff" opacity={0.8} />
            <circle cx="62" cy="60" r="6" fill="#fff" opacity={0.5} />
            <circle cx="58" cy="36" r="4" fill="#FFB3C7" />
          </svg>
          <h3>みる ／ 觀看</h3>
          <p>在透明的水中，慢慢地看。每一隻魚都有自己的名字、性格與水玉花紋，游動的節奏也不一樣。</p>
        </div>
        <div className="story-card reveal">
          <svg className="story-ico" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="si2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#CFC1F5" />
                <stop offset="1" stopColor="#9FE0EF" />
              </linearGradient>
            </defs>
            <path
              d="M20 62 C20 40 38 26 50 26 C62 26 80 40 80 62 A30 30 0 0 1 20 62Z"
              fill="url(#si2)"
            />
            <circle cx="41" cy="52" r="7" fill="#fff" opacity={0.85} />
            <circle cx="62" cy="46" r="4.5" fill="#FFE4A3" />
          </svg>
          <h3>えらぶ ／ 選擇</h3>
          <p>喜歡的形狀、喜歡的顏色，憑直覺就好。把魚拖進水槽的那一刻，牠就成為你的家人。</p>
        </div>
        <div className="story-card reveal">
          <svg className="story-ico" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="si3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#BFEFD6" />
                <stop offset="1" stopColor="#6EC9E0" />
              </linearGradient>
            </defs>
            <rect x="18" y="26" width="64" height="52" rx="14" fill="url(#si3)" />
            <rect x="18" y="26" width="64" height="16" rx="8" fill="#fff" opacity={0.55} />
            <circle cx="40" cy="58" r="7" fill="#fff" opacity={0.9} />
            <circle cx="60" cy="66" r="5" fill="#FFB3C7" />
          </svg>
          <h3>もちかえる ／ 帶回家</h3>
          <p>
            佈置完成後，水槽會化成一張「持ち帰りカード」。它是你的收藏證明，也是可以下載保存的紀念品。
          </p>
        </div>
      </div>
    </section>
  )
}
