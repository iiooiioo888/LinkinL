import { useEffect, useMemo, useState } from 'react';
import { scheduleSim } from '@/sim/schedulerClient';

const COLS = 12;
const ROWS = 6;

export function NeuralMeshGrid({ activeHint }: { activeHint: number }) {
  const cells = useMemo(() => Array.from({ length: COLS * ROWS }, (_, i) => i), []);
  const [lit, setLit] = useState<Set<number>>(() => new Set([2, 14, 27, 41]));

  useEffect(() => {
    let cancel: (() => void) | null = null;
    const pulse = () => {
      setLit(() => {
        const next = new Set<number>();
        const count = Math.min(COLS * ROWS, 6 + Math.floor(activeHint / 8));
        while (next.size < count) {
          next.add(Math.floor(Math.random() * COLS * ROWS));
        }
        return next;
      });
      cancel = scheduleSim(480 + Math.random() * 520, pulse);
    };
    cancel = scheduleSim(200, pulse);
    return () => cancel?.();
  }, [activeHint]);

  return (
    <div className="tech-mesh" role="img" aria-label="神經匯流排 mesh 熱圖">
      <div className="tech-mesh-grid">
        {cells.map((i) => (
          <span
            key={i}
            className={`tech-mesh-cell${lit.has(i) ? ' on' : ''}${i % COLS === 0 ? ' edge' : ''}`}
          />
        ))}
      </div>
      <div className="tech-mesh-legend">
        <span>L04 orchestrator</span>
        <span>L01 runtime bus</span>
        <span className="mono">cells={activeHint}</span>
      </div>
    </div>
  );
}
