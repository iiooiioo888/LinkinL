import type { SchedulerIn, SchedulerOut } from './sim-scheduler.worker';

type FireHandler = () => void;

let worker: Worker | null = null;
let nextId = 1;
const handlers = new Map<number, FireHandler>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./sim-scheduler.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (ev: MessageEvent<SchedulerOut>) => {
    if (ev.data.op !== 'fire') return;
    const fn = handlers.get(ev.data.id);
    if (fn) {
      handlers.delete(ev.data.id);
      fn();
    }
  };
  return worker;
}

/** 在 Worker 中排程；回傳 cancel。降級為 setTimeout 若 Worker 不可用。 */
export function scheduleSim(delayMs: number, fn: FireHandler): () => void {
  try {
    const w = ensureWorker();
    const id = nextId++;
    handlers.set(id, fn);
    w.postMessage({ op: 'schedule', id, delayMs } satisfies SchedulerIn);
    return () => {
      handlers.delete(id);
      w.postMessage({ op: 'clear', id } satisfies SchedulerIn);
    };
  } catch {
    const t = window.setTimeout(fn, delayMs);
    return () => window.clearTimeout(t);
  }
}

export function clearAllSimSchedules(): void {
  handlers.clear();
  worker?.postMessage({ op: 'clearAll' } satisfies SchedulerIn);
}

/** 供後續模組化 sim 使用；現階段 legacy 仍用 setTimeout，Worker 已就緒。 */
export function patchGlobalSchedulingForLegacy(): void {
  if (import.meta.env.PROD) return;
}
