export type SiteSection = { id: string; label: string };

/** 頂欄只跟主敘事 spine，深度內容在 #x-appendix-deep */
export const SITE_SECTIONS: SiteSection[] = [
  { id: 'x00-hero', label: '外骨骼' },
  { id: 'x01-pain', label: '是什麼' },
  { id: 'x02-product', label: '四層' },
  { id: 'x03-tool-sim', label: '路徑' },
  { id: 'x0c-install', label: '安裝' },
  { id: 'x0d-where', label: '分工' },
  { id: 'x00c-ecosystem', label: '生態' },
  { id: 'x0a-faq', label: 'FAQ' },
];

export const RAIL_SECTIONS = [
  '#x00-hero',
  '#x01-pain',
  '#x02-product',
  '#x03-tool-sim',
  '#x0c-install',
  '#x0d-where',
  '#x00c-ecosystem',
  '#x-appendix-deep',
  '#x0a-faq',
] as const;

export const LEGACY_HASH: Record<string, string> = {
  '#hero': '#x00-hero',
  '#pain': '#x01-pain',
  '#product': '#x02-product',
  '#engine': '#x-appendix-deep',
  '#engine-budget': '#x-appendix-deep',
  '#engine-consensus': '#x-appendix-deep',
  '#tool-sim': '#x03-tool-sim',
  '#evidence': '#x-appendix-deep',
  '#integrations': '#x05-integrations',
  '#ui-atlas': '#x05-ui-atlas',
  '#compare': '#x-appendix-deep',
  '#trust': '#x-appendix-deep',
  '#voices': '#x-appendix-deep',
  '#pricing': '#x-appendix-deep',
  '#faq': '#x0a-faq',
  '#x00b-tech-fabric': '#x00b-tech-fabric-fold',
};
