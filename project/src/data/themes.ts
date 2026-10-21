// 公開LPで選べるテーマ一覧。
// id は lp-baseline-theme の店舗ページ（src/pages/stores/[subdomain]/index.astro）と LP_iframe の VALID_THEMES に揃える。
export interface ThemeOption {
  id: string;
  name: string;
  desc: string;
  color: string;
  demoUrl: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'theme1', name: 'Standard', desc: '清潔感・万能', color: '#0d9488', demoUrl: 'https://demo-standard.global-reaches.com' },
  { id: 'theme2', name: 'Modern', desc: 'ダーク・高級感', color: '#3b82f6', demoUrl: 'https://demo-modern.global-reaches.com' },
  { id: 'theme3', name: 'Elegant', desc: '和風・エレガント', color: '#b45309', demoUrl: 'https://demo-elegant.global-reaches.com' },
  { id: 'theme4', name: 'Tropical', desc: '南国・リゾート', color: '#0891b2', demoUrl: 'https://demo-tropical.global-reaches.com' },
  { id: 'theme5', name: 'Dining', desc: 'レストラン・ダイニング', color: '#7c2d12', demoUrl: 'https://demo-dining.global-reaches.com' },
  { id: 'ember', name: 'Ember', desc: 'ステーキ', color: '#b91c1c', demoUrl: 'https://demo-steak.global-reaches.com' },
  { id: 'blaze', name: 'Blaze', desc: '焼肉', color: '#ea580c', demoUrl: 'https://demo-yakiniku.global-reaches.com' },
  { id: 'char', name: 'Char', desc: '焼き鳥', color: '#57534e', demoUrl: 'https://demo-yakitori.global-reaches.com' },
  { id: 'warm', name: 'Warm', desc: '居酒屋', color: '#c2410c', demoUrl: 'https://demo-izakaya.global-reaches.com' },
  { id: 'kura', name: 'Kura', desc: '割烹', color: '#1e293b', demoUrl: 'https://demo-kappo.global-reaches.com' },
  { id: 'shiro', name: 'Shiro', desc: 'カフェ', color: '#a8a29e', demoUrl: 'https://demo-cafe.global-reaches.com' },
  { id: 'brush', name: 'Brush', desc: 'ラーメン', color: '#dc2626', demoUrl: 'https://demo-ramen.global-reaches.com' },
  { id: 'mist', name: 'Mist', desc: 'そば', color: '#64748b', demoUrl: 'https://demo-soba.global-reaches.com' },
  { id: 'pop', name: 'Pop', desc: 'スイーツ', color: '#ec4899', demoUrl: 'https://demo-sweets.global-reaches.com' },
];

export function getThemeName(id: string): string {
  return THEMES.find(t => t.id === id)?.name ?? id;
}
