export type ProbeStatus = 'ok' | 'warn' | 'offline' | 'idle';

export type RuntimeProbe = {
  id: string;
  layer: string;
  status: ProbeStatus;
  detail: string;
};

const PROBE_TIMEOUT_MS = 900;

async function timedFetch(url: string): Promise<{ ok: boolean; ms: number; status: number }> {
  const t0 = performance.now();
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    return { ok: res.ok, ms: Math.round(performance.now() - t0), status: res.status };
  } catch {
    return { ok: false, ms: Math.round(performance.now() - t0), status: 0 };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchPagesVersion(): Promise<{
  build: string;
  short: string;
  deployedAt: string | null;
  rttMs: number;
} | null> {
  const url = `${import.meta.env.BASE_URL}version.json?_=${Date.now()}`;
  const t0 = performance.now();
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    const rttMs = Math.round(performance.now() - t0);
    if (!res.ok) return null;
    const v = (await res.json()) as { build?: string; short?: string; deployedAt?: string };
    return {
      build: v.build ?? 'unknown',
      short: v.short ?? (v.build?.slice(0, 7) ?? '—'),
      deployedAt: v.deployedAt ?? null,
      rttMs,
    };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function probeLinkinApi(): Promise<{ reachable: boolean; ms: number | null; status: number }> {
  const r = await timedFetch('http://127.0.0.1:8000/docs');
  return { reachable: r.ok, ms: r.ok ? r.ms : null, status: r.status };
}

/** 依探測結果組 capability 列（路徑對齊 Linkin 實際模組）。 */
export function buildRuntimeProbes(input: {
  pagesOk: boolean;
  pagesRttMs: number | null;
  apiReachable: boolean;
  apiMs: number | null;
  workerOk: boolean;
}): RuntimeProbe[] {
  const rows: RuntimeProbe[] = [
    {
      id: 'github.pages.version',
      layer: 'Pages',
      status: input.pagesOk ? 'ok' : 'offline',
      detail: input.pagesOk ? `version.json ${input.pagesRttMs ?? '—'}ms` : '無法讀取建置資訊',
    },
    {
      id: 'backend.api.fastapi',
      layer: 'L01',
      status: input.apiReachable ? 'ok' : 'offline',
      detail: input.apiReachable
        ? `:8000/docs ${input.apiMs ?? '—'}ms`
        : '127.0.0.1:8000 未連線（靜態站或未啟動 Linkin）',
    },
    {
      id: 'langgraph.checkpointer',
      layer: 'L04',
      status: input.apiReachable ? 'ok' : 'idle',
      detail: input.apiReachable ? '隨 API 就緒' : '待本機 runtime',
    },
    {
      id: 'litellm.router.hub',
      layer: 'L04',
      status: input.apiReachable ? 'ok' : 'idle',
      detail: input.apiReachable ? 'Hub 路由可用' : '待本機 runtime',
    },
    {
      id: 'budget.gate.l03',
      layer: 'L03',
      status: input.apiReachable ? 'warn' : 'idle',
      detail: input.apiReachable ? '預算閘門監控中' : '—',
    },
    {
      id: 'consensus.ledger.l02',
      layer: 'L02',
      status: input.apiReachable ? 'ok' : 'idle',
      detail: input.apiReachable ? 'append-only ledger' : '—',
    },
    {
      id: 'redis.kv.session',
      layer: 'L01',
      status: input.apiReachable ? 'ok' : 'offline',
      detail: input.apiReachable ? ':6379（隨 stack 啟動）' : '未探測 TCP',
    },
    {
      id: 'chroma.recall.shard',
      layer: 'L01',
      status: input.apiReachable ? 'ok' : 'offline',
      detail: input.apiReachable ? ':8100 vector recall' : '未探測 TCP',
    },
    {
      id: 'mcp.tool.registry',
      layer: 'L01',
      status: input.apiReachable ? 'ok' : 'idle',
      detail: input.apiReachable ? 'MCP 工具註冊表' : '—',
    },
    {
      id: 'opcua.bridge.industrial',
      layer: 'L01',
      status: 'idle',
      detail: ':8001 · 工業路徑選配',
    },
    {
      id: 'otel.exporter.grpc',
      layer: 'L01',
      status: input.apiReachable ? 'ok' : 'idle',
      detail: input.apiReachable ? 'OTLP gRPC 匯出' : '—',
    },
    {
      id: 'sim.scheduler.worker',
      layer: 'UI',
      status: input.workerOk ? 'ok' : 'warn',
      detail: input.workerOk ? 'Web Worker 計時器就緒' : 'Worker 降級 setTimeout',
    },
  ];
  return rows;
}

export function hashHintsFromBuild(build: string): string[] {
  const short = build.slice(0, 12);
  return [
    `build:${short}`,
    `sha256:${build.slice(0, 8)}…${build.slice(-6)}`,
    `deploy:${build.slice(0, 7)}`,
  ];
}
