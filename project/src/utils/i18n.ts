import { Language } from '../contexts/LanguageContext';

export type MultilingualText = {
  ja: string;
  en?: string;
  'zh-tw'?: string;
  ko?: string;
};

export function getText(field: string | MultilingualText | undefined, lang: Language): string {
  if (!field) return '';

  if (typeof field === 'string') {
    return field;
  }

  if (typeof field === 'object' && field !== null) {
    return field[lang] || field['ja'] || field['en'] || field['zh-tw'] || field['ko'] || '';
  }

  return '';
}

export function getTextOrDefault(field: string | MultilingualText | undefined, lang: Language, defaultValue: string = ''): string {
  const text = getText(field, lang);
  return text || defaultValue;
}
