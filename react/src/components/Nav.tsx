import { useEffect, useState } from 'react'
import { BrandDrop } from './BrandDrop'

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const sy = window.scrollY || 0
      setSolid(sy > 20)
      setHide(sy > lastY && sy > 420)
      lastY = sy
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${solid ? ' solid' : ''}${hide ? ' hide' : ''}`} id="nav">
      <div className="brand">
        <BrandDrop id="navDrop" />
        みずたま水族館
      </div>
      <nav className="nav-links">
        <a href="#story">コンセプト</a>
        <a href="#zukan">おさかな図鑑</a>
        <a href="#studio">水槽をつくる</a>
        <a href="#takehome">持ち帰る</a>
        <a href="#studio" className="nav-cta">
          水槽をつくる →
        </a>
      </nav>
    </header>
  )
}
