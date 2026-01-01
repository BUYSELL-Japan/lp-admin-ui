import { useLanguage, Language } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh-tw', label: '繁體中文', flag: '🇹🇼' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export default function LanguageSelector() {
  const { currentLang, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Change language"
      >
        <Globe size={18} />
        <span className="hidden sm:inline text-sm font-medium">
          {languages.find(l => l.code === currentLang)?.label || '日本語'}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                currentLang === lang.code ? 'bg-gray-50 font-semibold' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm text-gray-700">{lang.label}</span>
              {currentLang === lang.code && (
                <span className="ml-auto text-blue-600 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
