import { SVGNS } from '../data/catalog'
import type { Deco, Species } from '../data/types'

let uidC = 0
export const nextSvgId = () => ++uidC

export function fishInner(sp: Species, uid: number): string {
  const { c1, c2, c3, shape } = sp
  const gid = `g${uid}`
  const gloss = `<ellipse cx="-6" cy="-9" rx="22" ry="9" fill="#ffffff" opacity="0.3"/>`
  const eye = (x: number, y: number, r: number) =>
    `<circle cx="${x}" cy="${y}" r="${r + 2.4}" fill="#ffffff"/><circle cx="${x + 0.6}" cy="${y}" r="${r}" fill="#22485E"/><circle cx="${x - 1.4}" cy="${y - 1.6}" r="${r * 0.38}" fill="#ffffff"/>`
  const dot = (x: number, y: number, r: number, o = 0.85) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${c3}" opacity="${o}"/>`
  const defs = `<defs>
    <radialGradient id="${gid}" cx="34%" cy="26%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>
      <stop offset="42%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </radialGradient></defs>`
  let body = ''
  switch (shape) {
    case 'classic':
      body = `
      <path d="M -30 0 C -46 -26 -60 -24 -68 -2 C -60 22 -46 26 -30 0 Z" fill="${c2}"/>
      <path d="M -6 -23 C 4 -44 26 -40 30 -17 Z" fill="${c2}" opacity=".95"/>
      <path d="M -2 21 C 2 37 18 34 21 17 Z" fill="${c2}" opacity=".85"/>
      <ellipse cx="0" cy="0" rx="40" ry="26" fill="url(#${gid})"/>
      <path d="M 8 4 C 4 21 18 25 24 11 Z" fill="${c2}" opacity=".55"/>
      ${dot(-14, 7, 5.2)}${dot(2, 11, 4.2, 0.7)}${dot(-22, -6, 3.6, 0.6)}${dot(-6, -8, 3, 0.45)}
      ${gloss}
      ${eye(24, -7, 4.6)}
      <path d="M 33 5 q 5 4 9 1" stroke="#22485E" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`
      break
    case 'tall':
      body = `
      <path d="M -22 0 C -34 -18 -46 -14 -50 0 C -46 14 -34 18 -22 0 Z" fill="${c2}"/>
      <path d="M -14 -18 C -12 -52 20 -50 27 -13 Z" fill="${c2}" opacity=".95"/>
      <path d="M -12 18 C -10 50 18 48 25 13 Z" fill="${c2}" opacity=".85"/>
      <ellipse cx="0" cy="0" rx="30" ry="32" fill="url(#${gid})"/>
      ${dot(-10, 4, 6)}${dot(6, 14, 4.4, 0.7)}${dot(-14, -14, 4, 0.6)}${dot(8, -9, 3.2, 0.45)}
      <ellipse cx="-4" cy="-12" rx="15" ry="8" fill="#fff" opacity=".28"/>
      ${eye(17, -9, 4.4)}`
      break
    case 'puff':
      body = `
      <path d="M -30 0 C -42 -14 -52 -11 -55 0 C -52 11 -42 14 -30 0 Z" fill="${c2}"/>
      <circle cx="0" cy="0" r="34" fill="url(#${gid})"/>
      <path d="M -18 -30 l 5 -9 l 5 9 Z M 2 -34 l 5 -9 l 5 9 Z M 22 -22 l 8 -6 l 2 9 Z M -30 -14 l -9 -3 l 6 -7 Z M -12 32 l 4 9 l 6 -8 Z M 14 28 l 8 7 l 2 -9 Z" fill="${c2}" opacity=".9"/>
      ${dot(-13, 9, 5.4)}${dot(6, 15, 4.4, 0.7)}${dot(-16, -9, 4, 0.6)}
      <ellipse cx="-8" cy="-13" rx="16" ry="8" fill="#fff" opacity=".32"/>
      ${eye(18, -7, 4.8)}
      <path d="M 22 8 q 5 5 10 1" stroke="#22485E" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>`
      break
    case 'jelly':
      body = `
      <path d="M -18 14 q 2 16 -5 26 M -6 16 q -2 18 4 26 M 6 16 q 3 16 -3 26 M 18 13 q 6 14 1 25"
            stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M -36 8 C -36 -30 36 -30 36 8 C 22 20 -22 20 -36 8 Z" fill="url(#${gid})"/>
      <path d="M -36 8 C -22 18 22 18 36 8 C 30 16 -30 16 -36 8 Z" fill="${c2}" opacity=".55"/>
      ${dot(-15, -6, 6)}${dot(4, -11, 5, 0.7)}${dot(17, -2, 4, 0.6)}
      <ellipse cx="-10" cy="-13" rx="14" ry="7" fill="#fff" opacity=".45"/>
      ${eye(-8, 2, 3.6)}${eye(10, 2, 3.6)}`
      break
    case 'seahorse':
      body = `
      <path d="M -2 -30 C 20 -30 22 -6 8 6 C -2 16 -6 24 2 28 C 10 32 16 26 14 20"
            stroke="url(#${gid})" stroke-width="21" fill="none" stroke-linecap="round"/>
      <path d="M -4 -31 L -24 -24" stroke="${c1}" stroke-width="9" stroke-linecap="round"/>
      <path d="M 4 -34 l -3 -10 l 8 5 Z M 14 -26 l 2 -11 l 7 8 Z" fill="${c2}"/>
      <path d="M 16 -4 q 12 6 4 16 q -6 4 -8 -4 Z" fill="${c2}" opacity=".8"/>
      ${dot(2, -16, 4.4)}${dot(6, -2, 3.8, 0.7)}${dot(-3, 10, 3.2, 0.6)}
      ${eye(-2, -27, 3.8)}`
      break
    case 'long':
      body = `
      <path d="M -44 0 C -60 -24 -74 -20 -76 0 C -74 20 -60 24 -44 0 Z" fill="${c2}"/>
      <path d="M -12 -26 C 0 -52 24 -46 28 -20 Z" fill="${c2}" opacity=".95"/>
      <path d="M -8 25 C 2 50 24 44 27 19 Z" fill="${c2}" opacity=".85"/>
      <ellipse cx="0" cy="0" rx="48" ry="30" fill="url(#${gid})"/>
      <path d="M 10 6 C 4 26 22 30 30 14 Z" fill="${c2}" opacity=".5"/>
      ${dot(-18, 8, 6.4)}${dot(0, 14, 5, 0.7)}${dot(-28, -7, 4.4, 0.6)}${dot(-6, -11, 3.6, 0.45)}
      <ellipse cx="-8" cy="-12" rx="26" ry="10" fill="#fff" opacity=".3"/>
      ${eye(30, -8, 5)}
      <path d="M 39 5 q 6 5 10 0" stroke="#22485E" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>`
      break
  }
  return defs + body
}

export function decoInner(d: Deco, uid: number): string {
  const gid = `d${uid}`
  const { c1, c2 } = d
  const defs = `<defs><linearGradient id="${gid}" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="${c2}"/><stop offset="100%" stop-color="${c1}"/></linearGradient></defs>`
  let b = ''
  switch (d.kind) {
    case 'plant':
      b = `<path d="M0 60 C -10 30 -26 18 -30 -6 C -16 4 -6 18 0 34 C 6 16 18 2 32 -8 C 26 18 10 30 0 60 Z" fill="url(#${gid})"/>
         <circle cx="-16" cy="8" r="6" fill="#fff" opacity=".55"/><circle cx="14" cy="0" r="4.5" fill="#fff" opacity=".45"/>
         <circle cx="0" cy="30" r="5" fill="#fff" opacity=".4"/>`
      break
    case 'kelp':
      b = `<path d="M -12 60 C -26 30 4 24 -8 -6 C -14 -26 2 -34 8 -46" stroke="url(#${gid})" stroke-width="13" fill="none" stroke-linecap="round"/>
         <path d="M 18 60 C 8 34 30 26 20 2 C 14 -12 24 -22 30 -30" stroke="${c2}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>
         <circle cx="-8" cy="10" r="5" fill="#fff" opacity=".5"/><circle cx="22" cy="18" r="4" fill="#fff" opacity=".4"/>`
      break
    case 'coral':
      b = `<path d="M 0 60 L 0 16 M 0 30 L -22 4 M 0 24 L 22 -2 M 0 42 L -16 26 M 0 40 L 18 24"
            stroke="url(#${gid})" stroke-width="12" fill="none" stroke-linecap="round"/>
         <circle cx="-24" cy="0" r="8" fill="${c1}"/><circle cx="24" cy="-6" r="9" fill="${c1}"/><circle cx="0" cy="10" r="8" fill="${c1}"/>
         <circle cx="-22" cy="-2" r="3" fill="#fff" opacity=".6"/><circle cx="26" cy="-9" r="3.4" fill="#fff" opacity=".6"/>`
      break
    case 'shell':
      b = `<path d="M -34 46 C -34 6 34 6 34 46 Z" fill="url(#${gid})"/>
         <path d="M -20 46 C -18 20 -12 12 -6 8 M 0 46 L 0 8 M 20 46 C 18 20 12 12 6 8" stroke="#fff" stroke-width="3" fill="none" opacity=".65"/>
         <circle cx="0" cy="4" r="7" fill="${c2}"/><circle cx="-2" cy="2" r="2.6" fill="#fff" opacity=".8"/>`
      break
    case 'rock':
      b = `<path d="M -36 50 C -42 20 -20 -2 0 -4 C 24 -6 40 16 36 50 Z" fill="url(#${gid})"/>
         <circle cx="-12" cy="20" r="9" fill="#fff" opacity=".45"/><circle cx="14" cy="30" r="6" fill="#fff" opacity=".35"/>
         <circle cx="4" cy="6" r="4.5" fill="#fff" opacity=".55"/>`
      break
    case 'castle':
      b = `<rect x="-30" y="4" width="60" height="46" rx="8" fill="url(#${gid})"/>
         <rect x="-40" y="-12" width="18" height="62" rx="8" fill="${c1}"/>
         <rect x="22" y="-12" width="18" height="62" rx="8" fill="${c1}"/>
         <path d="M -40 -12 l 9 -16 l 9 16 Z M 22 -12 l 9 -16 l 9 16 Z M -12 4 l 12 -20 l 12 20 Z" fill="${c2}"/>
         <path d="M -8 50 L -8 26 A 8 8 0 0 1 8 26 L 8 50 Z" fill="${c2}" opacity=".8"/>
         <circle cx="-31" cy="8" r="4" fill="#fff" opacity=".7"/><circle cx="31" cy="8" r="4" fill="#fff" opacity=".7"/>`
      break
    case 'lamp':
      b = `<circle cx="0" cy="4" r="26" fill="url(#${gid})" opacity=".95"/>
         <circle cx="0" cy="4" r="34" fill="${c1}" opacity=".28"/>
         <circle cx="-9" cy="-5" r="8" fill="#fff" opacity=".7"/>
         <path d="M 0 30 L 0 50" stroke="${c2}" stroke-width="6" stroke-linecap="round"/>
         <rect x="-14" y="46" width="28" height="8" rx="4" fill="${c2}"/>`
      break
    case 'crystal':
      b = `<path d="M 0 -40 L 18 6 L 0 50 L -18 6 Z" fill="url(#${gid})"/>
         <path d="M 0 -40 L 0 50" stroke="#fff" stroke-width="2.5" opacity=".55"/>
         <path d="M -26 -8 L -14 20 L -26 44 L -34 18 Z" fill="${c1}" opacity=".85"/>
         <path d="M 26 -2 L 36 22 L 26 46 L 16 22 Z" fill="${c1}" opacity=".8"/>
         <circle cx="-6" cy="-8" r="4.5" fill="#fff" opacity=".8"/><circle cx="6" cy="16" r="3.4" fill="#fff" opacity=".6"/>`
      break
  }
  return defs + b
}

export function fishSVGString(sp: Species, w = 130): string {
  const id = nextSvgId()
  return `<svg xmlns="${SVGNS}" viewBox="-90 -60 180 120" width="${w}"><g>${fishInner(sp, id)}</g></svg>`
}

export function decoSVGString(d: Deco, w = 70): string {
  const id = nextSvgId()
  return `<svg xmlns="${SVGNS}" viewBox="-50 -50 100 115" width="${w}">${decoInner(d, id)}</svg>`
}
