export type PipelineStageId = 'gitnexus' | 'atm' | 'linkin' | 'semantica';

export type PipelineStage = {
  id: PipelineStageId;
  shortLabel: string;
  title: string;
  blurb: string;
  logs: string[];
};

export const ECOSYSTEM_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'gitnexus',
    shortLabel: '1 · 改程式',
    title: '改程式前先評估影響',
    blurb: '先看改動會波及哪裡，減少改 A 壞 B。',
    logs: [
      'gitnexus analyze',
      'query "call_llm upstream"',
      'impact AuthGate → 2 paths flagged',
    ],
  },
  {
    id: 'atm',
    shortLabel: '2 · 組隊',
    title: '視覺化組隊與部署',
    blurb: '把多個助手排好隊，一鍵開始工作。',
    logs: [
      'org-chart: SOC Team + 3 agents',
      'Deploy · primer compiled',
      'terminal · claude CLI spawned',
    ],
  },
  {
    id: 'linkin',
    shortLabel: '3 · LinkinL',
    title: '在本機跑完並存紀錄',
    blurb: '外骨骼本體：執行、護欄、封存都在你的電腦。',
    logs: [
      'graph.invoke · tool.mcp',
      'budget.gate · pass',
      'artifact sealed · cid logged',
    ],
  },
  {
    id: 'semantica',
    shortLabel: '4 · 查紀錄',
    title: '事後往回追',
    blurb: '回答「當初為什麼這樣決定」。',
    logs: [
      'record_decision(d-1043)',
      'trace_decision_chain ↑ 3 hops',
      'export PROV-O · audit ready',
    ],
  },
];
