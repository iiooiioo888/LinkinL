export type EcosystemPartner = {
  id: string;
  name: string;
  tagline: string;
  github: string;
  homepage: string;
  install: string;
  role: string;
  capabilities: string[];
  accent: 'code' | 'provenance' | 'team';
};

/** 順序對齊 pipeline-sim：改碼 → 組隊 → （Linkin 無卡）→ 溯源 */
export const ECOSYSTEM_PARTNERS: EcosystemPartner[] = [
  {
    id: 'gitnexus',
    name: 'GitNexus',
    tagline: 'Zero-Server 程式碼智能 · 改碼前算影響面',
    github: 'https://github.com/abhigyanpatwari/GitNexus',
    homepage: 'https://gitnexus.vercel.app',
    install: 'npx gitnexus analyze',
    role: '改碼前 · 影響面',
    capabilities: ['query', 'context', 'impact', 'trace', 'detect_changes', 'rename'],
    accent: 'code',
  },
  {
    id: 'atm',
    name: 'ATM · Agent Team Manager',
    tagline: 'Claude Code org chart · 一鍵 Deploy · 排程',
    github: 'https://github.com/DatafyingTech/Claude-Agent-Team-Manager',
    homepage: 'https://github.com/DatafyingTech/AUI/releases/latest',
    install: 'ATM-Setup.exe / ATM.dmg（AUI releases）',
    role: '組隊 · 部署 Claude',
    capabilities: ['org-chart', 'deploy', 'pipeline', 'schedule', 'variables', 'export-json'],
    accent: 'team',
  },
  {
    id: 'semantica',
    name: 'Semantica',
    tagline: 'Context Graph · Agent 決策可往回查',
    github: 'https://github.com/semantica-agi/semantica',
    homepage: 'https://getsemantica.ai',
    install: 'pip install semantica',
    role: '跑完後 · 問為什麼',
    capabilities: [
      'record_decision',
      'trace_decision_chain',
      'find_similar_decisions',
      'analyze_decision_impact',
      'PROV-O export',
    ],
    accent: 'provenance',
  },
];
