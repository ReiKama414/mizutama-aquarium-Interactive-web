import { useAquarium } from '../hooks/AquariumContext'

export function Toast() {
  const { toast } = useAquarium()
  return (
    <div id="toast" className={toast ? 'show' : undefined}>
      <span className="t-ico">{toast?.ico}</span>
      <span className="t-txt">
        {toast?.txt}
        {toast?.sub ? <span className="t-sub">{toast.sub}</span> : null}
      </span>
    </div>
  )
}

export function Ghost() {
  const { ghostHtml, ghostPos } = useAquarium()
  if (!ghostHtml) return null
  return (
    <div
      id="ghost"
      style={{ display: 'block', left: ghostPos.x, top: ghostPos.y }}
      dangerouslySetInnerHTML={{ __html: ghostHtml }}
    />
  )
}

export function CertModal() {
  const { certOpen, certImg, certNames, closeCert, downloadCert } = useAquarium()
  return (
    <div
      className={`modal${certOpen ? ' open' : ''}`}
      id="certModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCert()
      }}
    >
      <div className="modal-box">
        <div className="m-sub">MIZUTAMA AQUARIUM ／ CERTIFICATE</div>
        <h3>
          おかえりなさい、
          <br />
          あなたの水族館です。
        </h3>
        <img id="certImg" alt="わたしの水槽" src={certImg || undefined} />
        <div className="m-stats">
          {certNames.slice(0, 8).map((n) => (
            <span className="chip" key={n}>
              {n}
            </span>
          ))}
          {certNames.length > 8 ? <span className="chip">＋{certNames.length - 8}</span> : null}
        </div>
        <div className="m-btns">
          <button className="btn btn-primary" type="button" onClick={downloadCert}>
            ⬇ カードを保存する
          </button>
          <button className="btn btn-ghost" type="button" onClick={closeCert}>
            とじる
          </button>
        </div>
      </div>
    </div>
  )
}
