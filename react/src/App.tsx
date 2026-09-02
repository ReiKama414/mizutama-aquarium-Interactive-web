import { useCallback, useState } from 'react'
import { ClickFx } from './components/ClickFx'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { CertModal, Ghost, Toast } from './components/Overlays'
import { Story } from './components/Story'
import { Studio } from './components/Studio'
import { TakeHome } from './components/TakeHome'
import { Zukan } from './components/Zukan'
import { AquariumProvider } from './hooks/AquariumContext'
import { useReveal } from './hooks/useReveal'

function Shell() {
  const [loading, setLoading] = useState(true)
  const onDone = useCallback(() => setLoading(false), [])
  useReveal([loading])

  return (
    <>
      {loading && <Loader onDone={onDone} />}
      <Nav />
      <Hero />
      <Story />
      <Zukan />
      <Studio />
      <TakeHome />
      <Footer />
      <Toast />
      <Ghost />
      <CertModal />
      <ClickFx />
    </>
  )
}

export default function App() {
  return (
    <AquariumProvider>
      <Shell />
    </AquariumProvider>
  )
}
