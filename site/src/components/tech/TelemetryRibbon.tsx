import { useTechMetrics, useTechObservability } from './TechMetricsContext';

export function TelemetryRibbon() {
  const m = useTechMetrics();
  const { ledgerHints } = useTechObservability();

  const modeLabel = m.dataMode === 'live' ? 'RUNTIME LIVE' : 'PAGES + IDLE';
  const queueLabel = m.linkinBackendReachable ? 'queue' : 'idle-q';

  return (
    <div className="telemetry-ribbon" role="status" aria-live="polite">
      <div className="telemetry-ribbon-inner">
        <span className="telemetry-tag mono">{modeLabel}</span>
        <span className="telemetry-stat">
          build <strong className="mono">{m.pagesShort}</strong>
        </span>
        <span className="telemetry-stat">
          pages RTT <strong className="mono">{m.pagesRttMs != null ? `${m.pagesRttMs}ms` : '—'}</strong>
        </span>
        <span className="telemetry-stat">
          {queueLabel} <strong className="mono">{m.workerQueue}</strong>
        </span>
        <span className="telemetry-stat">
          p99 <strong className="mono">{m.p99Ms}ms</strong>
        </span>
        <span className="telemetry-stat">
          session <strong className="mono">{m.sessionSec}s</strong>
        </span>
        <span className="telemetry-stat">
          本機程式{' '}
          <strong className="mono">{m.linkinBackendReachable ? '已連上' : '未啟動'}</strong>
        </span>
        <div className="telemetry-marquee" aria-hidden="true">
          <div className="telemetry-marquee-track">
            {[...ledgerHints, ...ledgerHints].map((h, i) => (
              <span key={`${h}-${i}`} className="mono">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
