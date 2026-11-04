import { ECOSYSTEM_PARTNERS } from '@/data/ecosystemPartners';

export function EcosystemStackSection() {
  return (
    <section
      id="x00c-ecosystem"
      data-label="0x00C / ECOSYSTEM"
      className="reveal gs-reveal ecosystem-stack"
    >
      <p className="sec-label">
        <em>Ecosystem</em> · 與 LinkinL 互補的開源棧
      </p>
      <h2 className="h-sec">程式智能 × 決策溯源 · 疊在 Linkin 運行時之上</h2>
      <p className="sec-intro">
        LinkinL 負責<strong>本機可證明的 Agent 執行</strong>（工具 trace、預算閘、產出 hash）。
        下列兩個社群專案分別補上<strong>程式碼影響分析</strong>與<strong>Agent 結果往回查</strong>，
        可與 LangGraph run 並用，而非取代 Linkin runtime。
      </p>

      <div className="ecosystem-flow" aria-label="建議協作順序">
        <span className="ecosystem-flow-step">GitNexus · 改碼 / review</span>
        <span className="ecosystem-flow-arrow" aria-hidden="true">
          →
        </span>
        <span className="ecosystem-flow-step linkin">LinkinL · 執行編排</span>
        <span className="ecosystem-flow-arrow" aria-hidden="true">
          →
        </span>
        <span className="ecosystem-flow-step">Semantica · 決策溯源</span>
      </div>

      <div className="ecosystem-grid">
        {ECOSYSTEM_PARTNERS.map((p) => (
          <article key={p.id} className={`ecosystem-card accent-${p.accent}`}>
            <header className="ecosystem-card-head">
              <div>
                <h3 className="ecosystem-name">{p.name}</h3>
                <p className="ecosystem-tagline">{p.tagline}</p>
              </div>
              <span className="ecosystem-role mono">{p.role}</span>
            </header>

            <dl className="ecosystem-meta">
              <div>
                <dt>安裝</dt>
                <dd className="mono">{p.install}</dd>
              </div>
              <div>
                <dt>授權</dt>
                <dd>{p.license}</dd>
              </div>
            </dl>

            <ul className="ecosystem-caps" aria-label={`${p.name} 能力`}>
              {p.capabilities.map((c) => (
                <li key={c} className="chip mono">
                  {c}
                </li>
              ))}
            </ul>

            <p className="ecosystem-fit">{p.linkinFit}</p>

            <div className="ecosystem-actions">
              <a className="btn primary" href={p.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="btn mono" href={p.homepage} target="_blank" rel="noopener noreferrer">
                官網
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="ecosystem-footnote">
        以上為開源社群專案連結與能力摘要；LinkinL 首頁不托管第三方索引或 API，請在本機或自有環境安裝使用。
      </p>
    </section>
  );
}
