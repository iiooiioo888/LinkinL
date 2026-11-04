import { useState } from 'react';
import { ECOSYSTEM_PARTNERS } from '@/data/ecosystemPartners';
import type { PipelineStageId } from '@/data/ecosystemPipelineStages';
import { EcosystemPipelineAnim } from './EcosystemPipelineAnim';

export function EcosystemStackSection() {
  const [pipelineStage, setPipelineStage] = useState<PipelineStageId>('gitnexus');
  return (
    <section
      id="x00c-ecosystem"
      data-label="0x00C / ECOSYSTEM"
      className="reveal gs-reveal ecosystem-stack"
    >
      <p className="sec-label">
        <em>Ecosystem</em> · 與 LinkinL 互補的開源棧
      </p>
      <h2 className="h-sec">程式智能 × 組隊 × 決策溯源 · 疊在 Linkin 運行時之上</h2>
      <p className="sec-intro">
        上方 <strong>pipeline-sim</strong> 用一段動畫說明四步協作（改碼 → 組隊 → Linkin 執行 → 溯源）。
        下方卡片只做<strong>安裝指令與連結</strong>，不再重複 UI 示意；LinkinL 仍負責本機可證明的 Agent runtime。
      </p>

      <div className="ecosystem-slot-banner" role="note">
        <span className="mono">SHOWCASE SLOT</span>
        <span>
          動畫僅 <code>pipeline-sim</code> · 錨點 <code>#x00c-ecosystem</code> · 左軌「生」
        </span>
      </div>

      <EcosystemPipelineAnim onStageChange={setPipelineStage} />

      <p className="ecosystem-partner-label mono">PARTNER LINKS · 與動畫步驟對應</p>
      <ul className="ecosystem-partner-list">
        {ECOSYSTEM_PARTNERS.map((p) => (
          <li key={p.id}>
            <article
              className={`ecosystem-card accent-${p.accent}${pipelineStage === p.id ? ' pipeline-active' : ''}`}
            >
              <header className="ecosystem-card-head">
                <div>
                  <h3 className="ecosystem-name">{p.name}</h3>
                  <p className="ecosystem-tagline">{p.tagline}</p>
                </div>
                <span className="ecosystem-role mono">{p.role}</span>
              </header>

              <p className="ecosystem-install mono" title="安裝">
                {p.install}
              </p>

              <ul className="ecosystem-caps" aria-label={`${p.name} 能力`}>
                {p.capabilities.map((c) => (
                  <li key={c} className="chip mono">
                    {c}
                  </li>
                ))}
              </ul>

              <div className="ecosystem-actions">
                <a className="btn primary" href={p.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a className="btn mono" href={p.homepage} target="_blank" rel="noopener noreferrer">
                  官網
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="ecosystem-footnote">
        以上為開源社群專案連結與能力摘要；LinkinL 首頁不托管第三方索引或 API，請在本機或自有環境安裝使用。
      </p>
    </section>
  );
}
