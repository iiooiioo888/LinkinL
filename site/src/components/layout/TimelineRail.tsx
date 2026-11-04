const RAIL_NODES: { href: string; title: string; label: string; active?: boolean }[] = [
  { href: '#x00-hero', title: '首頁', label: '首', active: true },
  { href: '#x01-what', title: '你能得到什麼', label: '得' },
  { href: '#x03-tool-sim', title: '三種常見任務', label: '任' },
  { href: '#x0c-install', title: '開始使用', label: '始' },
  { href: '#x00c-ecosystem', title: '可選加購工具', label: '購' },
  { href: '#x0a-faq', title: '常見問題', label: '問' },
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
