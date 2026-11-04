import { useMemo } from 'react';

const COLS = 12;
const ROWS = 6;

/** L04→L01 固定匯流路徑，亮度隨 meshUtil 與相位移動（非亂數閃爍）。 */
const BUS_PATH = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 24, 25, 26, 27, 28,
  29, 30, 31, 32, 33, 34, 35, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 48, 49, 50, 51, 52, 53, 54, 55,
  56, 57, 58, 59, 60, 61, 62, 63, 71, 70, 69, 68, 67, 66, 65, 64,
];

export function NeuralMeshGrid({ utilPct, phase }: { utilPct: number; phase: number }) {
  const cells = useMemo(() => Array.from({ length: COLS * ROWS }, (_, i) => i), []);
  const pathLen = BUS_PATH.length;
  const head = phase % pathLen;
  const tail = Math.max(4, Math.round((utilPct / 100) * 14));

  const lit = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < tail; i++) {
      set.add(BUS_PATH[(head - i + pathLen) % pathLen]);
    }
    for (let row = 0; row < ROWS; row++) {
      set.add(row * COLS);
    }
    return set;
  }, [head, tail, pathLen]);

  return (
    <div className="tech-mesh" role="img" aria-label="執行匯流排 mesh（L04 至 L01 路徑）">
      <div className="tech-mesh-grid">
        {cells.map((i) => (
          <span
            key={i}
            className={`tech-mesh-cell${lit.has(i) ? ' on' : ''}${i % COLS === 0 ? ' edge' : ''}`}
          />
        ))}
      </div>
      <div className="tech-mesh-legend">
        <span>L04 → L03 → L02 → L01</span>
        <span className="mono">util {utilPct}%</span>
      </div>
    </div>
  );
}
