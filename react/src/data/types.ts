export type FishShape = 'classic' | 'tall' | 'puff' | 'jelly' | 'seahorse' | 'long'
export type Rare = 'N' | 'R' | 'SR' | 'SSR'
export type DecoKind = 'plant' | 'kelp' | 'coral' | 'shell' | 'rock' | 'castle' | 'lamp' | 'crystal'
export type ThemeId = 'day' | 'dusk' | 'night'
export type DragType = 'fish' | 'deco'

export interface Species {
  id: string
  ja: string
  ro: string
  shape: FishShape
  c1: string
  c2: string
  c3: string
  size: number
  rare: Rare
  tier: number
  spd: number
}

export interface Deco {
  id: string
  ja: string
  kind: DecoKind
  c1: string
  c2: string
  tier: number
}

export interface Tier {
  n: number
  need: number
  label: string
  desc: string
}

export interface Theme {
  id: ThemeId
  ja: string
  top: string
  mid: string
  bot: string
  sand: string
}

export interface PlacedFish {
  uid: number
  sp: string
  x: number
  y: number
}

export interface PlacedDeco {
  uid: number
  dc: string
  x: number
  y: number
  sc: number
}

export interface TankState {
  placed: PlacedFish[]
  decos: PlacedDeco[]
  collected: string[]
  theme: ThemeId
}

export interface ToastPayload {
  ico: string
  txt: string
  sub?: string
}

export interface VisBounds {
  x0: number
  x1: number
  y0: number
  y1: number
}
