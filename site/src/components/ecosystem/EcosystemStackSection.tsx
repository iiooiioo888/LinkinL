import { SPINE_ONE_LINERS } from '@/data/productCopy';

const PARTNER_ROW = [
  { name: 'LinkinL', hint: '主力 · 省力完成任務', href: 'https://github.com/iiooiioo888/LinkinL' },
  { name: 'GitNexus', hint: '改程式前先看影響', href: 'https://github.com/abhigyanpatwari/GitNexus' },
  { name: 'ATM', hint: '多個幫手一起上', href: 'https://github.com/DatafyingTech/Claude-Agent-Team-Manager' },
  { name: 'Semantica', hint: '事後查為何這樣決定', href: 'https://github.com/semantica-agi/semantica' },
] as const;

export function EcosystemStackSection() {
  return (
    <section id="x00c-ecosystem" className="reveal gs-reveal ecosystem-stack ecosystem-plain">
      <h2 className="h-sec">可選加購工具</h2>
      <p className="sec-intro">{SPINE_ONE_LINERS.extras}</p>

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
    </section>
  );
}
