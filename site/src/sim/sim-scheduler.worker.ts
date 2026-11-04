/**
 * 集中式計時 Worker：多個模擬（工具鏈 / L01 地圖 / 四層 trace）共用一條時間軸，
 * 避免主執行緒上大量 setTimeout 互相搶佔。
 */

export type SchedulerIn =
  | { op: 'schedule'; id: number; delayMs: number }
  | { op: 'clear'; id: number }
  | { op: 'clearAll' };

export type SchedulerOut = { op: 'fire'; id: number };

const timers = new Map<number, ReturnType<typeof setTimeout>>();

self.onmessage = (ev: MessageEvent<SchedulerIn>) => {
  const msg = ev.data;
  if (msg.op === 'schedule') {
    const prev = timers.get(msg.id);
    if (prev) clearTimeout(prev);
    const t = setTimeout(() => {
      timers.delete(msg.id);
      self.postMessage({ op: 'fire', id: msg.id } satisfies SchedulerOut);
    }, Math.max(0, msg.delayMs));
    timers.set(msg.id, t);
  } else if (msg.op === 'clear') {
    const prev = timers.get(msg.id);
    if (prev) clearTimeout(prev);
    timers.delete(msg.id);
  } else if (msg.op === 'clearAll') {
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
  }
};
