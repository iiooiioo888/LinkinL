import { SITE_SECTIONS } from '@/data/siteSections';

export function Topbar() {
  return (
    <header className="topbar" id="header" data-label="0x00 / HEADER">
      <div className="brand">
        靈境·Linkin<span className="L">L</span>
      </div>
      <nav className="nav" id="site-nav" aria-label="主導覽" data-nav-built="react">
        {SITE_SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-nav-id={s.id}
            className={i === 0 ? 'on' : undefined}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <div className="topbar-actions">
        <a
          className="btn mono"
          href="https://github.com/iiooiioo888/Linkin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linkin 原始碼
        </a>
        <a className="btn primary" href="#x0c-install">
          本機安裝
        </a>
      </div>
    </header>
  );
}
