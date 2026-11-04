import { useEffect, useState } from 'react';
import { scheduleSim } from '@/sim/schedulerClient';

export type LiveMetrics = {
  activeAgents: number;
  queueDepth: number;
  p99Ms: number;
  budgetPct: number;
  wsClients: number;
  chromaHits: number;
  spansPerSec: number;
  meshCells: number;
};

const BASE: LiveMetrics = {
  activeAgents: 12,
  queueDepth: 4,
  p99Ms: 118,
  budgetPct: 67,
  wsClients: 28,
  chromaHits: 842,
  spansPerSec: 240,
  meshCells: 38,
};

function jitter(n: number, spread: number, min = 0): number {
  const v = n + (Math.random() - 0.5) * spread;
  return Math.max(min, Math.round(v));
}

function nextMetrics(): LiveMetrics {
  return {
    activeAgents: jitter(BASE.activeAgents, 6, 1),
    queueDepth: jitter(BASE.queueDepth, 5, 0),
    p99Ms: jitter(BASE.p99Ms, 40, 40),
    budgetPct: jitter(BASE.budgetPct, 8, 12),
    wsClients: jitter(BASE.wsClients, 12, 4),
    chromaHits: jitter(BASE.chromaHits, 120, 100),
    spansPerSec: jitter(BASE.spansPerSec, 80, 40),
    meshCells: jitter(BASE.meshCells, 14, 8),
  };
}

/** Worker 排程的即時儀表數字（展示用合成 telemetry）。 */
export function useLiveMetrics(): LiveMetrics {
  const [metrics, setMetrics] = useState<LiveMetrics>(BASE);

  useEffect(() => {
    let cancel: (() => void) | null = null;
    const tick = () => {
      setMetrics(nextMetrics());
      cancel = scheduleSim(900 + Math.random() * 600, tick);
    };
    cancel = scheduleSim(400, tick);
    return () => {
      cancel?.();
    };
  }, []);

  return metrics;
}
