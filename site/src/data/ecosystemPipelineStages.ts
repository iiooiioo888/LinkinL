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
    shortLabel: 'GitNexus · 改碼',
    title: '改碼前先算影響面',
    blurb: '索引 repo → MCP query / impact / trace，避免改 A 爆 B。',
    logs: [
      'gitnexus analyze',
      'query "call_llm upstream"',
      'impact AuthGate → 2 paths flagged',
    ],
  },
  {
    id: 'atm',
    shortLabel: 'ATM · Claude 組隊',
    title: '視覺化 org chart · 一鍵 Deploy',
    blurb: '拖拽組隊、共用變數、排程 cron，編譯 deployment primer 開終端。',
    logs: [
      'org-chart: SOC Team + 3 agents',
      'Deploy · primer compiled',
      'terminal · claude CLI spawned',
    ],
  },
  {
    id: 'linkin',
    shortLabel: 'LinkinL · 執行',
    title: 'LangGraph 本機 runtime 閉環',
    blurb: '工具 trace、L03 預算閘、L02 账本、產出物 hash — 可重播 run。',
    logs: [
      'graph.invoke · tool.mcp',
      'budget.gate · pass',
      'artifact sealed · cid logged',
    ],
  },
  {
    id: 'semantica',
    shortLabel: 'Semantica · 溯源',
    title: 'Agent 結果往回查',
    blurb: 'record_decision → trace_decision_chain → PROV-O 匯出監管格式。',
    logs: [
      'record_decision(d-1043)',
      'trace_decision_chain ↑ 3 hops',
      'export PROV-O · audit ready',
    ],
  },
];
