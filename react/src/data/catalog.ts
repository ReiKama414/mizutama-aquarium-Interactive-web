import type { Deco, Species, Theme, Tier } from './types'

export const SPECIES: Species[] = [
  { id: 'guppy', ja: 'みずたまグッピー', ro: 'MIZUTAMA GUPPY', shape: 'classic', c1: '#9FE0EF', c2: '#6EC9E0', c3: '#FFFFFF', size: 1.0, rare: 'N', tier: 0, spd: 1.0 },
  { id: 'kingyo', ja: 'ぽかぽかキンギョ', ro: 'POKAPOKA GOLDFISH', shape: 'classic', c1: '#FFC79A', c2: '#FF9F6E', c3: '#FFF3E2', size: 1.15, rare: 'N', tier: 0, spd: 0.75 },
  { id: 'neon', ja: 'そらいろネオン', ro: 'SORAIRO NEON', shape: 'classic', c1: '#BFD8FF', c2: '#8FB6FF', c3: '#FFFFFF', size: 0.78, rare: 'N', tier: 0, spd: 1.5 },
  { id: 'kusa', ja: 'わかばテトラ', ro: 'WAKABA TETRA', shape: 'classic', c1: '#BFEFD6', c2: '#7FD9AC', c3: '#FFFFFF', size: 0.85, rare: 'N', tier: 0, spd: 1.35 },
  { id: 'angel', ja: 'しずくエンゼル', ro: 'SHIZUKU ANGEL', shape: 'tall', c1: '#FFF0C2', c2: '#FFD98A', c3: '#FFB3C7', size: 1.05, rare: 'R', tier: 1, spd: 0.62 },
  { id: 'fugu', ja: 'もこもこフグ', ro: 'MOKOMOKO PUFFER', shape: 'puff', c1: '#FFD9E4', c2: '#FFB3C7', c3: '#FFFFFF', size: 1.0, rare: 'R', tier: 1, spd: 0.5 },
  { id: 'beta', ja: 'ゆめいろベタ', ro: 'YUMEIRO BETTA', shape: 'tall', c1: '#CFC1F5', c2: '#A78FE6', c3: '#FFE4A3', size: 1.0, rare: 'R', tier: 1, spd: 0.7 },
  { id: 'tatsu', ja: 'つきよタツノコ', ro: 'TSUKIYO SEAHORSE', shape: 'seahorse', c1: '#FFE4A3', c2: '#FFC46B', c3: '#FFFFFF', size: 1.0, rare: 'SR', tier: 2, spd: 0.4 },
  { id: 'chou', ja: 'にじいろチョウ', ro: 'NIJIIRO BUTTERFLY', shape: 'tall', c1: '#B8ECF7', c2: '#FFB3C7', c3: '#FFFFFF', size: 1.05, rare: 'SR', tier: 2, spd: 0.85 },
  { id: 'kurage', ja: 'ふわりクラゲ', ro: 'FUWARI JELLY', shape: 'jelly', c1: '#E7DEFF', c2: '#CFC1F5', c3: '#FFFFFF', size: 1.0, rare: 'SR', tier: 2, spd: 0.34 },
  { id: 'manbo', ja: 'ほしくずマンボウ', ro: 'HOSHIKUZU SUNFISH', shape: 'long', c1: '#C9DDE8', c2: '#9FB9C9', c3: '#FFF3E2', size: 1.35, rare: 'SSR', tier: 3, spd: 0.3 },
  { id: 'ryugu', ja: 'まぼろしリュウグウ', ro: 'MABOROSHI DRAGON', shape: 'long', c1: '#FFD6EC', c2: '#B79BF0', c3: '#FFE4A3', size: 1.5, rare: 'SSR', tier: 3, spd: 0.36 },
]

export const DECOS: Deco[] = [
  { id: 'kusa1', ja: 'みずたま水草', kind: 'plant', c1: '#BFEFD6', c2: '#7FD9AC', tier: 0 },
  { id: 'kelp', ja: 'ゆらゆらケルプ', kind: 'kelp', c1: '#9FE0EF', c2: '#6EC9E0', tier: 0 },
  { id: 'sango', ja: 'ももいろサンゴ', kind: 'coral', c1: '#FFC7D8', c2: '#FF9FBB', tier: 0 },
  { id: 'kai', ja: 'しろつぶ貝', kind: 'shell', c1: '#FFF6E9', c2: '#FFD9C2', tier: 0 },
  { id: 'ishi', ja: 'あわのいし', kind: 'rock', c1: '#CBE3EE', c2: '#A6C8D8', tier: 1 },
  { id: 'shiro', ja: 'ちいさなお城', kind: 'castle', c1: '#FFF1DA', c2: '#FFD2A6', tier: 2 },
  { id: 'lamp', ja: 'つきのランプ', kind: 'lamp', c1: '#FFE9A8', c2: '#FFC46B', tier: 2 },
  { id: 'crystal', ja: 'ゆめのクリスタル', kind: 'crystal', c1: '#DCD0FF', c2: '#B79BF0', tier: 3 },
]

export const TIERS: Tier[] = [
  { n: 0, need: 0, label: 'あさせ ／ 淺灘', desc: '最初の4匹＋4つのかざり' },
  { n: 1, need: 3, label: 'いわば ／ 岩場', desc: '3種あつめて解放' },
  { n: 2, need: 6, label: 'ふかみ ／ 深み', desc: '6種あつめて解放' },
  { n: 3, need: 9, label: 'しんかい ／ 深海', desc: '9種あつめて解放' },
]

export const THEMES: Theme[] = [
  { id: 'day', ja: 'ひるのうみ', top: '#DFF6FD', mid: '#8FD8EC', bot: '#2E88AB', sand: '#FFF0D6' },
  { id: 'dusk', ja: 'ゆうぐれ', top: '#FFE3E9', mid: '#C9B6F0', bot: '#5B5FA8', sand: '#FFE7D2' },
  { id: 'night', ja: 'よるのうみ', top: '#BFE3F5', mid: '#3E7FB0', bot: '#12324D', sand: '#DCE9F2' },
]

export const STORAGE_KEY = 'mizutama.tank.v1'
export const VW = 1000
export const VH = 700
export const FLOOR = 596
export const SVGNS = 'http://www.w3.org/2000/svg'
