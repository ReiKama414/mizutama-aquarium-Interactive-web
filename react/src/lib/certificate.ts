import { SPECIES, SVGNS, VH, VW } from '../data/catalog'
import type { Species, TankState } from '../data/types'

function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

export function makeCertificate(
  svg: SVGSVGElement,
  state: TankState,
  spOf: (id: string) => Species | undefined,
): Promise<{ dataUrl: string; names: string[] }> {
  return new Promise((resolve, reject) => {
    const clone = svg.cloneNode(true) as SVGSVGElement
    clone.setAttribute('xmlns', SVGNS)
    clone.setAttribute('width', String(VW))
    clone.setAttribute('height', String(VH))
    clone.style.transform = ''
    const str = new XMLSerializer().serializeToString(clone)
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str)
    const W = 1080
    const H = 1350
    const cv = document.createElement('canvas')
    cv.width = W
    cv.height = H
    const g = cv.getContext('2d')
    if (!g) {
      reject(new Error('canvas'))
      return
    }
    const img = new Image()
    img.onload = () => {
      const bg = g.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#F7FDFF')
      bg.addColorStop(0.55, '#E2F6FB')
      bg.addColorStop(1, '#C2ECF6')
      g.fillStyle = bg
      g.fillRect(0, 0, W, H)
      const pad = 70
      const tw = W - pad * 2
      const th = Math.round((tw * VH) / VW)
      const ty = 250
      g.save()
      roundRect(g, pad, ty, tw, th, 36)
      g.clip()
      g.drawImage(img, pad, ty, tw, th)
      g.restore()
      g.strokeStyle = 'rgba(255,255,255,.95)'
      g.lineWidth = 8
      roundRect(g, pad, ty, tw, th, 36)
      g.stroke()
      g.textAlign = 'center'
      g.fillStyle = '#22485E'
      g.font = '700 26px "Zen Maru Gothic","Microsoft JhengHei",sans-serif'
      g.fillText('MIZUTAMA  AQUARIUM', W / 2, 110)
      g.font = '900 52px "Zen Maru Gothic","Microsoft JhengHei",sans-serif'
      g.fillText('みずたま水族館', W / 2, 178)
      g.fillStyle = '#5C8398'
      g.font = '400 24px "Zen Maru Gothic","Microsoft JhengHei",sans-serif'
      g.fillText('わたしの水槽 ／ MY TANK CERTIFICATE', W / 2, 216)
      const y0 = ty + th + 82
      g.fillStyle = '#22485E'
      g.font = '700 34px "Zen Maru Gothic","Microsoft JhengHei",sans-serif'
      g.fillText(`おさかな ${state.placed.length} 匹 ・ かざり ${state.decos.length} こ`, W / 2, y0)
      g.fillStyle = '#3FA9C9'
      g.font = '700 28px "Zen Maru Gothic","Microsoft JhengHei",sans-serif'
      g.fillText(`ずかん ${state.collected.length} ／ ${SPECIES.length} 種 コンプリート`, W / 2, y0 + 52)
      g.fillStyle = '#8FB6C6'
      g.font = '400 22px "Zen Maru Gothic","Microsoft JhengHei",sans-serif'
      const d = new Date()
      g.fillText(
        `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}  —  水槽を持ち帰りました`,
        W / 2,
        y0 + 106,
      )
      g.globalAlpha = 0.5
      ;(
        [
          [70, 60, 18, '#9FE0EF'],
          [1010, 80, 12, '#FFB3C7'],
          [54, 1290, 22, '#FFE4A3'],
          [1024, 1280, 16, '#CFC1F5'],
          [980, 190, 9, '#BFEFD6'],
        ] as const
      ).forEach(([x, y, r, c]) => {
        g.fillStyle = c
        g.beginPath()
        g.arc(x, y, r, 0, 7)
        g.fill()
      })
      g.globalAlpha = 1
      const names = [
        ...new Set(
          state.placed
            .map((p) => spOf(p.sp)?.ja)
            .filter((n): n is string => Boolean(n)),
        ),
      ]
      resolve({ dataUrl: cv.toDataURL('image/png'), names })
    }
    img.onerror = () => reject(new Error('image'))
    img.src = url
  })
}
