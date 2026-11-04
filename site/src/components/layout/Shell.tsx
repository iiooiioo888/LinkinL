import type { ReactNode } from 'react';
import { TimelineRail } from './TimelineRail';
import { Topbar } from './Topbar';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Topbar />
      <div className="body-wrap">
        <TimelineRail />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
