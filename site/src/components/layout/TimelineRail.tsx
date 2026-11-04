const RAIL_NODES: { href: string; title: string; label: string; active?: boolean }[] = [
  { href: '#x00-hero', title: '首頁', label: '首', active: true },
  { href: '#x01-what', title: '它做什麼', label: '做' },
  { href: '#x03-tool-sim', title: '三種用法', label: '用' },
  { href: '#x0c-install', title: '怎麼安裝', label: '裝' },
  { href: '#x00c-ecosystem', title: '和誰搭配', label: '伴' },
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
