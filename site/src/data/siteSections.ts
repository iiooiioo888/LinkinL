export type SiteSection = { id: string; label: string };

export const SITE_SECTIONS: SiteSection[] = [
  { id: 'x00-hero', label: '首頁' },
  { id: 'x01-what', label: '得到' },
  { id: 'x03-tool-sim', label: '任務' },
  { id: 'x0c-install', label: '開始' },
  { id: 'x00c-ecosystem', label: '加購' },
  { id: 'x0a-faq', label: 'FAQ' },
];

export const RAIL_SECTIONS = [
  '#x00-hero',
  '#x01-what',
  '#x03-tool-sim',
  '#x0c-install',
  '#x00c-ecosystem',
  '#x0a-faq',
] as const;

export const LEGACY_HASH: Record<string, string> = {
  '#hero': '#x00-hero',
  '#pain': '#x01-what',
  '#product': '#x-advanced',
  '#engine': '#x-advanced',
  '#engine-budget': '#x-advanced',
  '#engine-consensus': '#x-advanced',
  '#tool-sim': '#x03-tool-sim',
  '#evidence': '#x-advanced',
  '#integrations': '#x-advanced',
  '#ui-atlas': '#x-advanced',
  '#compare': '#x-advanced',
  '#trust': '#x-advanced',
  '#voices': '#x-advanced',
  '#pricing': '#x-advanced',
  '#faq': '#x0a-faq',
  '#x00b-tech-fabric': '#x00b-tech-fabric-fold',
  '#x01-pain': '#x01-what',
  '#x02-product': '#x-advanced',
  '#x02-how': '#x02-how',
  '#x0d-where': '#x0c-install',
};
