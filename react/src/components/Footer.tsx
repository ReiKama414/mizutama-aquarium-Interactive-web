import { BrandDrop } from './BrandDrop'

export function Footer() {
  return (
    <footer>
      <svg className="wave-top" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 40 C 180 78 300 2 480 26 C 660 50 780 88 960 62 C 1140 36 1280 4 1440 30 L1440 0 L0 0 Z"
          fill="#CDEBF7"
        />
      </svg>
      <div className="f-brand">
        <BrandDrop id="fg1" />
        <div className="f-name">みずたま水族館</div>
        <div className="f-tag">MIZUTAMA AQUARIUM ／ TAKE YOUR OCEAN HOME</div>
      </div>
      <div className="f-links">
        <a href="#story">コンセプト</a>
        <a href="#zukan">おさかな図鑑</a>
        <a href="#studio">水槽をつくる</a>
        <a href="#takehome">持ち帰る</a>
        <a href="#top">▲ TOP</a>
      </div>
      <div className="copy">
        © みずたま水族館 — 這是一個虛構品牌企劃（Fictional Brand Concept）。All fish are original
        characters. · React TSX version
      </div>
    </footer>
  )
}
