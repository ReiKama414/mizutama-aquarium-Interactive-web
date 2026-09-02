# みずたま水族館 — React TSX

Vanilla `index.html`（專案根目錄）的 React + TypeScript 版本。

## 啟動

```bash
cd react
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run preview
```

## 結構

- `src/components/` — UI 區塊（Hero / 図鑑 / Studio / TakeHome…）
- `src/hooks/AquariumContext.tsx` — 水槽狀態、拖曳、解鎖、紀念卡
- `src/lib/tankEngine.ts` — SVG 水槽動畫引擎（rAF）
- `src/lib/svgCreatures.ts` — 原創魚／裝飾 SVG 生成
- `src/data/` — 圖鑑資料與型別
- `src/styles/aquarium.css` — 與 vanilla 版相同的視覺樣式

收藏進度與 vanilla 版共用 `localStorage` key：`mizutama.tank.v1`。
