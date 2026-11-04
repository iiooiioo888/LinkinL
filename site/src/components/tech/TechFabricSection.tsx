import { NeuralMeshGrid } from './NeuralMeshGrid';
import { useTechObservability } from './TechMetricsContext';

export function TechFabricSection() {
  const { metrics: m, probes, spans } = useTechObservability();
  const meshPhase = m.sessionSec % 28;
  const headroom = Math.max(0, Math.round(100 - m.budgetUsedPct));

  return (
    <section
      id="x00b-tech-fabric"
      data-label="0x00B / TECH FABRIC"
      className="reveal gs-reveal tech-fabric"
    >
      <p className="sec-label">
        <em>Runtime</em> · 可觀測性與匯流排
      </p>
      <h2 className="h-sec">本機 runtime 探測 · 誠實量測</h2>
      <p className="sec-intro">
        選展開面板：<strong>可驗證來源</strong> 含 <code>version.json</code> RTT、Pages 建置 SHA，以及
        <code>127.0.0.1:8000/docs</code> 是否連上本機 Linkin API。
        {m.linkinBackendReachable ? (
          <> 目前已連上本機 runtime，下列佇列／span 率為<strong>低振幅估算</strong>。</>
        ) : (
          <> 目前為<strong>靜態 Pages</strong>（API 離線），僅保留 idle 佇列與 Hero 對齊的<strong>示範 trace</strong>（標示 sample）。</>
        )}
      </p>

      <div className={`tech-mode-banner ${m.dataMode}`} role="status">
        <span className="mono">{m.dataMode === 'live' ? 'LINKIN API REACHABLE' : 'STATIC PAGES · API OFFLINE'}</span>
        <span>
          建置 {m.pagesShort}
          {m.pagesDeployedAt ? ` · ${m.pagesDeployedAt.slice(0, 10)}` : ''}
          {m.backendRttMs != null ? ` · API ${m.backendRttMs}ms` : ''}
        </span>
      </div>

      <div className="tech-fabric-grid">
        <article className="tech-panel">
          <header className="tech-panel-head">
            <span className="mono">execution_mesh.bus</span>
            <span className={`tech-led ${m.linkinBackendReachable ? 'ok' : 'idle'}`} title="path activity" />
          </header>
          <NeuralMeshGrid utilPct={m.meshUtilPct} phase={meshPhase} />
        </article>

        <article className="tech-panel tech-panel-metrics">
          <header className="tech-panel-head">
            <span className="mono">ops.metrics.session</span>
            <span className={`tech-led ${m.pagesRttMs != null ? 'ok' : 'warn'}`} />
          </header>
          <div className="tech-metrics-grid">
            <div className="tech-metric">
              <span className="tech-metric-label">Inflight tasks</span>
              <span className="tech-metric-value mono">{m.inflightTasks}</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Worker queue</span>
              <span className="tech-metric-value mono">{m.workerQueue}</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Est. p99</span>
              <span className="tech-metric-value mono">{m.p99Ms}ms</span>
              <span className="tech-metric-hint">含 pages RTT 權重</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Budget used</span>
              <span className="tech-metric-value mono">{m.budgetUsedPct.toFixed(1)}%</span>
              <span className="tech-metric-hint">headroom {headroom}%</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">WS sessions</span>
              <span className="tech-metric-value mono">{m.wsSessions}</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Chroma queries/min</span>
              <span className="tech-metric-value mono">{m.chromaQueriesMin}</span>
            </div>
          </div>
          <div className="tech-sparkline" aria-hidden="true" title="OTLP spans/s 趨勢">
            {Array.from({ length: 24 }, (_, i) => {
              const h = m.otlpSpansPerSec === 0 ? 12 : 18 + ((m.otlpSpansPerSec + i * 2) % 55);
              return <span key={i} className="tech-spark-bar" style={{ height: `${h}%` }} />;
            })}
          </div>
        </article>

        <article className="tech-panel tech-panel-trace">
          <header className="tech-panel-head">
            <span className="mono">trace.recent</span>
            <span className="tech-led ok" />
          </header>
          <ul className="tech-span-list">
            {spans.map((s, idx) => (
              <li key={`${idx}-${s.name}-${s.kind}`}>
                <span className="tech-span-name mono">{s.name}</span>
                <span className="tech-span-svc">
                  {s.svc}
                  {s.kind === 'sample' ? ' · sample' : ''}
                </span>
                <span className="tech-span-ms mono">{s.ms}ms</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="tech-registry">
        <header className="tech-panel-head">
          <span className="mono">capability.probe</span>
          <span className="tech-sub">HTTP / 就緒狀態 · 非臆測假數字</span>
        </header>
        <div className="tech-cap-grid">
          {probes.map((c) => (
            <div key={c.id} className="tech-cap-row">
              <span className={`tech-led ${c.status}`} aria-hidden="true" />
              <span className="tech-cap-layer mono">{c.layer}</span>
              <span className="tech-cap-id mono">{c.id}</span>
              <span className={`tech-cap-detail mono ${c.status}`}>{c.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
