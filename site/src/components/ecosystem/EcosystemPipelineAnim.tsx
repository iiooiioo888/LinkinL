import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ECOSYSTEM_PIPELINE_STAGES,
  type PipelineStageId,
} from '@/data/ecosystemPipelineStages';
import { scheduleSim } from '@/sim/schedulerClient';

const STAGE_MS = 3200;
const LOG_STEP_MS = 520;

export function EcosystemPipelineAnim({
  onStageChange,
}: {
  onStageChange?: (id: PipelineStageId) => void;
}) {
  const [stageIdx, setStageIdx] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const stage = ECOSYSTEM_PIPELINE_STAGES[stageIdx]!;
  const stageId = stage.id;

  useEffect(() => {
    onStageChange?.(stageId);
  }, [stageId, onStageChange]);

  const runStage = useCallback((idx: number) => {
    const s = ECOSYSTEM_PIPELINE_STAGES[idx]!;
    setStageIdx(idx);
    setLogLines([]);
    setTick(0);
    let line = 0;
    let cancelLog: (() => void) | null = null;

    const pushLog = () => {
      if (line < s.logs.length) {
        const text = s.logs[line]!;
        line++;
        setLogLines((prev) => [...prev, text]);
        setTick((t) => t + 1);
        cancelLog = scheduleSim(LOG_STEP_MS, pushLog);
      }
    };
    cancelLog = scheduleSim(280, pushLog);

    return () => {
      cancelLog?.();
    };
  }, []);

  const advance = useCallback(() => {
    setStageIdx((i) => {
      const next = (i + 1) % ECOSYSTEM_PIPELINE_STAGES.length;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const cleanup = runStage(stageIdx);
    const cancel = scheduleSim(STAGE_MS, advance);
    return () => {
      cleanup();
      cancel();
    };
  }, [running, stageIdx, runStage, advance]);

  useEffect(() => {
    if (startedRef.current) return;
    const host = hostRef.current;
    if (!host) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      startedRef.current = true;
      setRunning(true);
      setLogLines(ECOSYSTEM_PIPELINE_STAGES[0]!.logs);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !startedRef.current) {
          startedRef.current = true;
          setRunning(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="eco-pipeline" ref={hostRef} aria-label="生態協作流程動畫">
      <div className="eco-pipeline-head">
        <span className="mono">
          <span className="live-dot">LIVE</span> pipeline-sim · 四段協作
        </span>
        <button
          type="button"
          className="btn mono eco-pipeline-replay"
          onClick={() => {
            startedRef.current = true;
            setRunning(true);
            runStage(0);
            setStageIdx(0);
          }}
        >
          RE-RUN
        </button>
      </div>

      <div className="eco-pipeline-rail" role="tablist" aria-label="流程步驟">
        {ECOSYSTEM_PIPELINE_STAGES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === stageIdx}
            className={`eco-pipeline-step${i === stageIdx ? ' active' : ''}${i < stageIdx ? ' done' : ''}${s.id === 'linkin' ? ' linkin' : ''}`}
            onClick={() => {
              setRunning(true);
              setStageIdx(i);
            }}
          >
            {s.shortLabel}
          </button>
        ))}
        <span
          className="eco-pipeline-beacon"
          style={{ '--eco-stage': stageIdx } as CSSProperties}
          aria-hidden="true"
        />
      </div>

      <div className="eco-pipeline-stage">
        <div className="eco-pipeline-copy">
          <h3 className="eco-pipeline-title">{stage.title}</h3>
          <p className="eco-pipeline-blurb">{stage.blurb}</p>
        </div>
        <EcosystemStageViewport stageId={stageId} animTick={tick} />
      </div>

      <div className="eco-pipeline-log terminal" aria-live="polite">
        <div className="terminal-bar mono">ecosystem-trace</div>
        <pre>
          {logLines.map((line, i) => (
            <span key={`${stageId}-${i}`} className="eco-log-line">
              <span className="prompt">› </span>
              {line}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

function EcosystemStageViewport({
  stageId,
  animTick,
}: {
  stageId: PipelineStageId;
  animTick: number;
}) {
  if (stageId === 'gitnexus') {
    const hot = animTick >= 2;
    return (
      <div className="eco-stage-view preview-gitnexus" aria-hidden="true">
        <div className="eco-dag-row">
          <span className={`eco-dag-node${animTick >= 0 ? ' on' : ''}`}>diff: api.py</span>
          <span className="eco-dag-edge" />
          <span className={`eco-dag-node${animTick >= 1 ? ' on' : ''}`}>AuthGate</span>
          <span className={`eco-dag-edge${hot ? ' warn' : ''}`} />
          <span className={`eco-dag-node${hot ? ' hot pulse' : ''}`}>call_llm</span>
        </div>
      </div>
    );
  }

  if (stageId === 'atm') {
    return (
      <div className="eco-stage-view preview-atm" aria-hidden="true">
        <div className="eco-org-tree">
          <span className={`eco-org-node you${animTick >= 0 ? ' on' : ''}`}>You</span>
          <span className="eco-org-connector" />
          <span className={`eco-org-node team${animTick >= 1 ? ' on' : ''}`}>Team</span>
          <span className="eco-org-connector branch" />
          <div className="eco-org-row">
            <span className={`eco-org-node agent${animTick >= 2 ? ' on' : ''}`}>Deploy</span>
            <span className={`eco-org-node skill${animTick >= 3 ? ' on' : ''}`}>cron</span>
          </div>
        </div>
      </div>
    );
  }

  if (stageId === 'linkin') {
    const layer = Math.min(3, Math.floor(animTick / 1.2));
    const layers = ['L04', 'L03', 'L02', 'L01'];
    return (
      <div className="eco-stage-view preview-linkin" aria-hidden="true">
        <div className="eco-linkin-stack">
          {layers.map((l, i) => (
            <div key={l} className={`eco-linkin-layer${i === layer ? ' active' : ''}${i < layer ? ' done' : ''}`}>
              <span className="mono">{l}</span>
              {i === layer && <span className="eco-linkin-packet" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const chainOn = 2 - Math.min(2, Math.floor(animTick / 1.5));
  return (
    <div className="eco-stage-view preview-semantica" aria-hidden="true">
      <ul className="eco-decision-chain eco-decision-chain-anim">
        {['retrieval', 'budget.gate', 'final_answer'].map((name, i) => (
          <li key={name} className={i === chainOn ? 'on' : i > chainOn ? 'dim' : 'done'}>
            <span className="mono">d-{1040 + i}</span>
            <span>{name}</span>
            <span className="mono ms">{i === chainOn ? '◀ trace' : 'ok'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
