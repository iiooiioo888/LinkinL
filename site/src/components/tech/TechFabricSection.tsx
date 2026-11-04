import { NeuralMeshGrid } from './NeuralMeshGrid';
import { useTechMetrics } from './TechMetricsContext';

const CAPABILITIES = [
  { id: 'langgraph.checkpointer', layer: 'L04', status: 'ok' as const },
  { id: 'litellm.router.hub', layer: 'L01', status: 'ok' as const },
  { id: 'budget.gate.l03', layer: 'L03', status: 'warn' as const },
  { id: 'consensus.ledger.l02', layer: 'L02', status: 'ok' as const },
  { id: 'mcp.tool.registry', layer: 'L01', status: 'ok' as const },
  { id: 'chroma.recall.shard', layer: 'L01', status: 'ok' as const },
  { id: 'redis.kv.session', layer: 'L01', status: 'ok' as const },
  { id: 'opcua.bridge.industrial', layer: 'L01', status: 'idle' as const },
  { id: 'otel.exporter.grpc', layer: 'L01', status: 'ok' as const },
  { id: 'ws.fanout.runtime', layer: 'L01', status: 'ok' as const },
  { id: 'artifact.ipfs.pin', layer: 'L02', status: 'ok' as const },
  { id: 'sim.worker.scheduler', layer: 'UI', status: 'ok' as const },
];

const SPANS = [
  { name: 'graph.invoke', ms: 12, svc: 'orchestrator' },
  { name: 'tool.execute', ms: 84, svc: 'mcp-gateway' },
  { name: 'budget.evaluate', ms: 3, svc: 'l03-gate' },
  { name: 'vector.query', ms: 41, svc: 'chroma' },
  { name: 'ledger.append', ms: 7, svc: 'consensus' },
];

export function TechFabricSection() {
  const m = useTechMetrics();

  return (
    <section
      id="x00b-tech-fabric"
      data-label="0x00B / TECH FABRIC"
      className="reveal gs-reveal tech-fabric"
    >
      <p className="sec-label">
        <em>Runtime</em> · 可觀測性與匯流排
      </p>
      <h2 className="h-sec">科技運維面 · Mesh · Trace · Registry</h2>
      <p className="sec-intro">
        在瀏覽器端以 <strong>Web Worker 排程器</strong> 驅動儀表刷新，模擬 Linkin 本機 runtime 的 telemetry
        匯流：多 Agent 並行、預算閘門、向量召回與 OTLP span 流。以下為官網展示組件，非真實後端連線。
      </p>

      <div className="tech-fabric-grid">
        <article className="tech-panel">
          <header className="tech-panel-head">
            <span className="mono">neural_mesh.bus</span>
            <span className="tech-led ok" title="healthy" />
          </header>
          <NeuralMeshGrid activeHint={m.meshCells} />
        </article>

        <article className="tech-panel tech-panel-metrics">
          <header className="tech-panel-head">
            <span className="mono">ops.metrics.live</span>
            <span className="tech-led ok" />
          </header>
          <div className="tech-metrics-grid">
            <div className="tech-metric">
              <span className="tech-metric-label">Active agents</span>
              <span className="tech-metric-value mono">{m.activeAgents}</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Queue depth</span>
              <span className="tech-metric-value mono">{m.queueDepth}</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">p99 latency</span>
              <span className="tech-metric-value mono">{m.p99Ms}ms</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Budget headroom</span>
              <span className="tech-metric-value mono">{100 - m.budgetPct}%</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">WS clients</span>
              <span className="tech-metric-value mono">{m.wsClients}</span>
            </div>
            <div className="tech-metric">
              <span className="tech-metric-label">Chroma hits/min</span>
              <span className="tech-metric-value mono">{m.chromaHits}</span>
            </div>
          </div>
          <div className="tech-sparkline" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className="tech-spark-bar"
                style={{ height: `${20 + ((m.spansPerSec + i * 7) % 70)}%` }}
              />
            ))}
          </div>
        </article>

        <article className="tech-panel tech-panel-trace">
          <header className="tech-panel-head">
            <span className="mono">otlp.trace.preview</span>
            <span className="tech-led ok" />
          </header>
          <ul className="tech-span-list">
            {SPANS.map((s) => (
              <li key={s.name}>
                <span className="tech-span-name mono">{s.name}</span>
                <span className="tech-span-svc">{s.svc}</span>
                <span className="tech-span-ms mono">{s.ms}ms</span>
              </li>
            ))}
          </ul>
          <div className="tech-hash-rail">
            <div className="tech-hash-track">
              {['ledger:af3…', 'artifact:Qm…', 'gate:pass', 'trace:8b…', 'cid:bafy…'].map((t, i) => (
                <span key={i} className="mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="tech-registry">
        <header className="tech-panel-head">
          <span className="mono">capability.registry</span>
          <span className="tech-sub">12 modules · synced with L01 map</span>
        </header>
        <div className="tech-cap-grid">
          {CAPABILITIES.map((c) => (
            <div key={c.id} className="tech-cap-row">
              <span className={`tech-led ${c.status}`} aria-hidden="true" />
              <span className="tech-cap-layer mono">{c.layer}</span>
              <span className="tech-cap-id mono">{c.id}</span>
              <span className={`tech-cap-state mono ${c.status}`}>{c.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
