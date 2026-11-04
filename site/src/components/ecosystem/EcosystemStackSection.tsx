import { PRODUCT_ONE_LINER } from '@/data/productCopy';
import { EcosystemPipelineAnim } from './EcosystemPipelineAnim';

const PARTNER_ROW = [
  { name: 'LinkinL', hint: '本體 · 外骨骼', href: 'https://github.com/iiooiioo888/LinkinL' },
  { name: 'GitNexus', hint: '改程式前先評估', href: 'https://github.com/abhigyanpatwari/GitNexus' },
  { name: 'ATM', hint: '組隊與部署', href: 'https://github.com/DatafyingTech/Claude-Agent-Team-Manager' },
  { name: 'Semantica', hint: '事後查紀錄', href: 'https://github.com/semantica-agi/semantica' },
] as const;

export function EcosystemStackSection() {
  return (
    <section id="x00c-ecosystem" className="reveal gs-reveal ecosystem-stack ecosystem-plain">
      <h2 className="h-sec">和誰搭配</h2>
      <p className="sec-intro">{PRODUCT_ONE_LINER} 下列工具可選用，不必全部安裝。</p>

      <div className="eco-partner-row" role="list">
        {PARTNER_ROW.map((p) => (
          <a
            key={p.name}
            className="eco-partner-pill"
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <span className="eco-partner-name">{p.name}</span>
            <span className="eco-partner-hint">{p.hint}</span>
          </a>
        ))}
      </div>

      <details className="site-fold site-fold-nested eco-pipeline-fold">
        <summary className="site-fold-summary">
          <span className="site-fold-title">看四步協作示意（選展開）</span>
          <span className="site-fold-hint">展開後自動播放一次約 15 秒，之後顯示文字摘要</span>
        </summary>
        <div className="site-fold-body">
          <EcosystemPipelineAnim playOnce />
        </div>
      </details>
    </section>
  );
}
