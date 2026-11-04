import { useTechMetrics } from './TechMetricsContext';

const HASH_SNIPPETS = [
  'bafybei…4a2f',
  '0x9f3c…e811',
  'sha256:8c…01',
  'trace:7b…aa',
  'cid:Qm…9x2',
  'span:4d…f0',
];

export function TelemetryRibbon() {
  const m = useTechMetrics();

  return (
    <div className="telemetry-ribbon" role="status" aria-live="polite">
      <div className="telemetry-ribbon-inner">
        <span className="telemetry-tag mono">LIVE TELEMETRY</span>
        <span className="telemetry-stat">
          agents <strong className="mono">{m.activeAgents}</strong>
        </span>
        <span className="telemetry-stat">
          queue <strong className="mono">{m.queueDepth}</strong>
        </span>
        <span className="telemetry-stat">
          p99 <strong className="mono">{m.p99Ms}ms</strong>
        </span>
        <span className="telemetry-stat">
          spans/s <strong className="mono">{m.spansPerSec}</strong>
        </span>
        <div className="telemetry-marquee" aria-hidden="true">
          <div className="telemetry-marquee-track">
            {[...HASH_SNIPPETS, ...HASH_SNIPPETS].map((h, i) => (
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
