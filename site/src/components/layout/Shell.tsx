import type { ReactNode } from 'react';
import { TechMetricsProvider } from '@/components/tech/TechMetricsContext';
import { TelemetryRibbon } from '@/components/tech/TelemetryRibbon';
import { TimelineRail } from './TimelineRail';
import { Topbar } from './Topbar';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <TechMetricsProvider>
      <div className="shell has-telemetry">
        <Topbar />
        <TelemetryRibbon />
        <div className="body-wrap">
          <TimelineRail />
          <main className="main">{children}</main>
        </div>
      </div>
    </TechMetricsProvider>
  );
}
