const RAIL_NODES: { href: string; title: string; label: string; active?: boolean }[] = [
  { href: '#x00-hero', title: '本機 AI 外骨骼', label: '骨', active: true },
  { href: '#x01-pain', title: '外骨骼是什麼', label: '是' },
  { href: '#x02-product', title: '四層怎麼穿', label: '層' },
  { href: '#x03-tool-sim', title: '三條執行路徑', label: '徑' },
  { href: '#x0c-install', title: '本機安裝', label: '裝' },
  { href: '#x0d-where', title: 'LinkinL vs runtime', label: '分' },
  { href: '#x00c-ecosystem', title: '生態 pipeline-sim', label: '生' },
  { href: '#x-appendix-deep', title: '深度延伸（收合）', label: '深' },
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
