export type EcosystemPartner = {
  id: string;
  name: string;
  tagline: string;
  github: string;
  homepage: string;
  install: string;
  license: string;
  role: string;
  capabilities: string[];
  linkinFit: string;
  accent: 'code' | 'provenance';
};

export const ECOSYSTEM_PARTNERS: EcosystemPartner[] = [
  {
    id: 'gitnexus',
    name: 'GitNexus',
    tagline: 'Zero-Server 程式碼智能 · 符號 / 呼叫 / 依賴 / 執行流知識圖',
    github: 'https://github.com/abhigyanpatwari/GitNexus',
    homepage: 'https://gitnexus.vercel.app',
    install: 'npx gitnexus analyze',
    license: 'PolyForm Noncommercial',
    role: '改碼前 · 影響面',
    capabilities: ['query', 'context', 'impact', 'trace', 'detect_changes', 'rename'],
    linkinFit: '與 LinkinL 開發 Linkin 本體或 skill 時，用 MCP 查「誰呼叫誰、diff 會波及哪裡」。',
    accent: 'code',
  },
  {
    id: 'semantica',
    name: 'Semantica',
    tagline: 'Context Graph · Agent 決策可往回查 · W3C PROV-O',
    github: 'https://github.com/semantica-agi/semantica',
    homepage: 'https://getsemantica.ai',
    install: 'pip install semantica',
    license: 'MIT',
    role: '跑完後 · 問為什麼',
    capabilities: [
      'record_decision',
      'trace_decision_chain',
      'find_similar_decisions',
      'analyze_decision_impact',
      'PROV-O export',
    ],
    linkinFit:
      'Linkin 跑完一輪 Agent 後，把結論與依據寫入 Context Graph，監管 / 內審可追因果鏈。',
    accent: 'provenance',
  },
];
