import { useEffect, useRef, useState } from 'react';
import { scheduleSim } from '@/sim/schedulerClient';
import {
  buildRuntimeProbes,
  fetchPagesVersion,
  hashHintsFromBuild,
  probeLinkinApi,
  type RuntimeProbe,
} from './runtimeProbes';

export type TraceSpan = {
  name: string;
  svc: string;
  ms: number;
  kind: 'measured' | 'sample';
};

export type LiveMetrics = {
  pagesBuild: string;
  pagesShort: string;
  pagesDeployedAt: string | null;
  pagesRttMs: number | null;
  sessionSec: number;
  linkinBackendReachable: boolean;
  backendRttMs: number | null;
  inflightTasks: number;
  workerQueue: number;
  p99Ms: number;
  budgetUsedPct: number;
  otlpSpansPerSec: number;
  chromaQueriesMin: number;
  wsSessions: number;
  meshUtilPct: number;
  dataMode: 'live' | 'idle-sample';
};

export type TechObservability = {
  metrics: LiveMetrics;
  probes: RuntimeProbe[];
  spans: TraceSpan[];
  ledgerHints: string[];
};

/** Hero DAG 與 tool-sim 對齊的示範 trace（backend 離線時標示 sample）。 */
const SAMPLE_TRACE: Omit<TraceSpan, 'kind'>[] = [
  { name: 'graph.route_by_complexity', ms: 12, svc: 'langgraph' },
  { name: 'retrieval.chroma.query', ms: 84, svc: 'chroma:8100' },
  { name: 'tool.mcp.invoke', ms: 126, svc: 'mcp-gateway' },
  { name: 'budget.gate.evaluate', ms: 3, svc: 'l03-gate' },
  { name: 'ledger.consensus.append', ms: 7, svc: 'l02-ledger' },
];

type SimState = {
  inflightTasks: number;
  workerQueue: number;
  p99Ms: number;
  budgetUsedPct: number;
  otlpSpansPerSec: number;
  chromaQueriesMin: number;
  wsSessions: number;
  meshPhase: number;
};

function initSim(): SimState {
  return {
    inflightTasks: 0,
    workerQueue: 0,
    p99Ms: 96,
    budgetUsedPct: 18,
    otlpSpansPerSec: 0,
    chromaQueriesMin: 0,
    wsSessions: 0,
    meshPhase: 0,
  };
}

/** 小步隨機游走 + 物理感限制，避免數字亂跳。 */
function advanceSim(prev: SimState, backendLive: boolean, pagesRtt: number | null): SimState {
  const next = { ...prev };
  const load = backendLive ? 1 : 0.15;

  const taskDelta = (Math.random() - 0.48) * load;
  next.inflightTasks = clamp(Math.round(prev.inflightTasks + taskDelta), 0, backendLive ? 8 : 1);
  next.workerQueue = clamp(
    Math.round(prev.workerQueue * 0.6 + next.inflightTasks * 0.35 + (Math.random() - 0.5) * load),
    0,
    backendLive ? 12 : 2,
  );

  const targetP99 = (pagesRtt ?? 94) + next.workerQueue * 11 + next.inflightTasks * 6;
  next.p99Ms = clamp(Math.round(prev.p99Ms * 0.82 + targetP99 * 0.18), 42, backendLive ? 420 : 140);

  if (backendLive) {
    next.budgetUsedPct = clamp(prev.budgetUsedPct + 0.04 + Math.random() * 0.06, 8, 92);
    next.otlpSpansPerSec = clamp(Math.round(12 + next.inflightTasks * 4 + next.workerQueue * 0.5), 0, 48);
    next.chromaQueriesMin = clamp(Math.round(40 + next.inflightTasks * 18), 0, 220);
    next.wsSessions = clamp(Math.max(1, next.inflightTasks), 1, 6);
  } else {
    next.budgetUsedPct = clamp(prev.budgetUsedPct + 0.008, 12, 24);
    next.otlpSpansPerSec = next.inflightTasks > 0 ? 1 : 0;
    next.chromaQueriesMin = 0;
    next.wsSessions = 0;
  }

  next.meshPhase = (prev.meshPhase + 1) % 28;
  return next;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function meshUtilFromSim(sim: SimState, backendLive: boolean): number {
  if (!backendLive) return 8 + (sim.meshPhase % 5);
  return clamp(22 + sim.inflightTasks * 9 + sim.workerQueue * 2, 12, 88);
}

function buildSpans(
  pagesRtt: number | null,
  backendLive: boolean,
  backendMs: number | null,
): TraceSpan[] {
  const spans: TraceSpan[] = [];
  if (pagesRtt != null) {
    spans.push({
      name: 'pages.version.fetch',
      svc: 'github-pages',
      ms: pagesRtt,
      kind: 'measured',
    });
  }
  if (backendLive && backendMs != null) {
    spans.push({
      name: 'linkin.http.docs',
      svc: '127.0.0.1:8000',
      ms: backendMs,
      kind: 'measured',
    });
  }
  const sampleKind: TraceSpan['kind'] = backendLive ? 'measured' : 'sample';
  for (const s of SAMPLE_TRACE) {
    spans.push({ ...s, kind: sampleKind });
  }
  return spans;
}

const INITIAL_METRICS: LiveMetrics = {
  pagesBuild: '…',
  pagesShort: '…',
  pagesDeployedAt: null,
  pagesRttMs: null,
  sessionSec: 0,
  linkinBackendReachable: false,
  backendRttMs: null,
  inflightTasks: 0,
  workerQueue: 0,
  p99Ms: 96,
  budgetUsedPct: 18,
  otlpSpansPerSec: 0,
  chromaQueriesMin: 0,
  wsSessions: 0,
  meshUtilPct: 8,
  dataMode: 'idle-sample',
};

export function useLiveMetrics(): TechObservability {
  const sessionStart = useRef(Date.now());
  const simRef = useRef<SimState>(initSim());
  const [view, setView] = useState<TechObservability>({
    metrics: INITIAL_METRICS,
    probes: buildRuntimeProbes({
      pagesOk: false,
      pagesRttMs: null,
      apiReachable: false,
      apiMs: null,
      workerOk: true,
    }),
    spans: buildSpans(null, false, null),
    ledgerHints: hashHintsFromBuild('pending'),
  });

  useEffect(() => {
    let cancelled = false;
    let tickCancel: (() => void) | null = null;
    let probeCancel: (() => void) | null = null;

    const publish = async (workerOk: boolean) => {
      const pages = await fetchPagesVersion();
      const api = await probeLinkinApi();
      if (cancelled) return;

      const pagesOk = pages != null;
      const build = pages?.build ?? 'unknown';
      const sim = advanceSim(simRef.current, api.reachable, pages?.rttMs ?? null);
      simRef.current = sim;

      const metrics: LiveMetrics = {
        pagesBuild: build,
        pagesShort: pages?.short ?? build.slice(0, 7),
        pagesDeployedAt: pages?.deployedAt ?? null,
        pagesRttMs: pages?.rttMs ?? null,
        sessionSec: Math.floor((Date.now() - sessionStart.current) / 1000),
        linkinBackendReachable: api.reachable,
        backendRttMs: api.ms,
        inflightTasks: sim.inflightTasks,
        workerQueue: sim.workerQueue,
        p99Ms: sim.p99Ms,
        budgetUsedPct: sim.budgetUsedPct,
        otlpSpansPerSec: sim.otlpSpansPerSec,
        chromaQueriesMin: sim.chromaQueriesMin,
        wsSessions: sim.wsSessions,
        meshUtilPct: meshUtilFromSim(sim, api.reachable),
        dataMode: api.reachable ? 'live' : 'idle-sample',
      };

      setView({
        metrics,
        probes: buildRuntimeProbes({
          pagesOk,
          pagesRttMs: pages?.rttMs ?? null,
          apiReachable: api.reachable,
          apiMs: api.ms,
          workerOk,
        }),
        spans: buildSpans(pages?.rttMs ?? null, api.reachable, api.ms),
        ledgerHints: hashHintsFromBuild(build),
      });
    };

    const tick = () => {
      void publish(true).finally(() => {
        if (cancelled) return;
        const delay = document.hidden ? 4000 : 2200;
        tickCancel = scheduleSim(delay, tick);
      });
    };

    tickCancel = scheduleSim(120, tick);
    probeCancel = scheduleSim(8000, function probeLoop() {
      void publish(true).finally(() => {
        if (!cancelled) probeCancel = scheduleSim(8000, probeLoop);
      });
    });

    return () => {
      cancelled = true;
      tickCancel?.();
      probeCancel?.();
    };
  }, []);

  return view;
}
