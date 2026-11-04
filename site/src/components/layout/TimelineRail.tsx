const RAIL_NODES: { href: string; title: string; label: string; active?: boolean }[] = [
  { href: '#x00-hero', title: '首頁', label: '00', active: true },
  { href: '#x00c-ecosystem', title: 'GitNexus · ATM · Semantica', label: '生' },
  { href: '#x01-pain', title: '痛點', label: '01' },
  { href: '#x02-product', title: 'L04 四層', label: 'L4' },
  { href: '#x03-engine', title: '引擎', label: '擎' },
  { href: '#x03-budget', title: 'L03 預算', label: 'L3' },
  { href: '#x03-consensus', title: 'L02 共識', label: 'L2' },
  { href: '#x03-tool-sim', title: '工具模擬', label: '工' },
  { href: '#x04-evidence', title: '實證', label: '證' },
  { href: '#x05-integrations', title: 'L01 整合', label: 'L1' },
  { href: '#x05-ui-atlas', title: '組件圖鑑', label: '件' },
  { href: '#x06-compare', title: '對照', label: '對' },
  { href: '#x07-trust', title: '信任', label: '信' },
  { href: '#x08-voices', title: '聲音', label: '聲' },
  { href: '#x09-pricing', title: '定價', label: '價' },
  { href: '#x0b-layers', title: '四層詳解', label: '層' },
  { href: '#x0c-install', title: '本機安裝', label: '裝' },
  { href: '#x0d-where', title: '分工', label: '分' },
  { href: '#x0a-faq', title: 'FAQ', label: '問' },
];

export function TimelineRail() {
  return (
    <aside className="timeline-rail" aria-label="頁面錨點">
      {RAIL_NODES.map((n) => (
        <a
          key={n.href}
          className={`rail-node${n.active ? ' active' : ''}`}
          href={n.href}
          title={n.title}
        >
          {n.label}
        </a>
      ))}
    </aside>
  );
}
