import { useState, useEffect } from 'react';
import { Save, Settings, LogIn, Languages, LogOut, Globe } from 'lucide-react';
import { saveAllSections, getSubdomain, translateAndSave } from '../services/api';
import { clearAuthData } from '../services/auth';
import {
  HeaderEditor,
  HeroEditor,
  AboutEditor,
  MenuEditor,
  GalleryEditor,
  StaffEditor,
  NewsEditor,
  StoreInfoEditor,
  CTAEditor,
  PricingEditor,
  FooterEditor,
  ReviewsEditor,
  CompanyEditor,
  AccessEditor,
  FAQEditor,
  ContactEditor,
  SettingsEditor,
} from './EditorSections';
import TranslationLoadingModal from './TranslationLoadingModal';

interface EditorProps {
  userId: string | null;
  sectionData: any;
  onSectionChange: (section: string, data: any) => void;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  onSubdomainFetched?: (subdomain: string | null) => void;
}

const LOGIN_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/login?client_id=12nf22nqg8mpcq1q77nm5uqbls&response_type=code&scope=email+openid+profile&redirect_uri=https%3A%2F%2Fadmin-lp.neural-seeds.com';
const LOGOUT_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/logout?client_id=12nf22nqg8mpcq1q77nm5uqbls&logout_uri=https%3A%2F%2Fadmin-lp.neural-seeds.com';

export default function Editor({ userId, sectionData, onSectionChange, isAuthenticated, isAuthenticating, onSubdomainFetched }: EditorProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0, sectionName: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  const sections = [
    { id: 'settings', label: '蝓ｺ譛ｬ險ｭ螳・繝・・繝・ },
    { id: 'header', label: '繝倥ャ繝繝ｼ' },
    { id: 'hero', label: '繝偵・繝ｭ繝ｼ' },
    { id: 'about', label: '縺薙□繧上ｊ' },
    { id: 'menu', label: '縺雁刀譖ｸ縺・ },
    { id: 'pricing', label: '繧ｳ繝ｼ繧ｹ繝ｻ繝励Λ繝ｳ' },
    { id: 'cta', label: 'CTA' },
    { id: 'gallery', label: '繧ｮ繝｣繝ｩ繝ｪ繝ｼ' },
    { id: 'staff', label: '繧ｹ繧ｿ繝・ヵ' },
    { id: 'reviews', label: '縺雁ｮ｢讒倥・螢ｰ' },
    { id: 'news', label: '縺顔衍繧峨○' },
    { id: 'storeInfo', label: '蠎苓・諠・ｱ' },
    { id: 'company', label: '莠区･ｭ謇讎りｦ・ },
    { id: 'access', label: '繧｢繧ｯ繧ｻ繧ｹ' },
    { id: 'faq', label: '繧医￥縺ゅｋ雉ｪ蝠・ },
    { id: 'contact', label: '縺雁撫縺・粋繧上○' },
    { id: 'footer', label: '繝輔ャ繧ｿ繝ｼ' },
  ];

  useEffect(() => {
    if (isAuthenticated && !isAuthenticating) {
      setShowLoginSuccess(true);
      const timer = setTimeout(() => setShowLoginSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthenticating]);

  const handleSave = async () => {
    if (!userId) {
      alert('菫晏ｭ倥☆繧九↓縺ｯ繝ｭ繧ｰ繧､繝ｳ縺悟ｿ・ｦ√〒縺・);
      return;
    }
    setIsSaving(true);
    const success = await saveAllSections(userId, sectionData, 'Draft');
    setIsSaving(false);
    if (success) {
      alert('縺吶∋縺ｦ縺ｮ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ繧剃ｸ区嶌縺堺ｿ晏ｭ倥＠縺ｾ縺励◆');
      const subdomain = await getSubdomain(userId);
      if (subdomain && onSubdomainFetched) {
        onSubdomainFetched(subdomain);
      }
    }
  };

  const handlePublish = async () => {
    if (!userId) {
      alert('蜈ｬ髢九☆繧九↓縺ｯ繝ｭ繧ｰ繧､繝ｳ縺悟ｿ・ｦ√〒縺・);
      return;
    }
    setIsPublishing(true);
    // Lambda蛛ｴ縺ｧCloudflare Webhook繧り・蜍輔〒繝医Μ繧ｬ繝ｼ縺輔ｌ繧・
    const success = await saveAllSections(userId, sectionData, 'Published');
    setIsPublishing(false);
    if (success) {
      alert('縺吶∋縺ｦ縺ｮ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ繧偵悟・髢九阪せ繝・・繧ｿ繧ｹ縺ｧ菫晏ｭ倥・蜿肴丐縺励∪縺励◆・―n・育ｴ・蛻・〒譛ｬ逡ｪ繧ｵ繧､繝医∈蜿肴丐縺輔ｌ縺ｾ縺呻ｼ・);
      const subdomain = await getSubdomain(userId);
      if (subdomain && onSubdomainFetched) {
        onSubdomainFetched(subdomain);
      }
    }
  };

  const handleTranslateAndSave = async () => {
    if (!userId) {
      alert('菫晏ｭ倥☆繧九↓縺ｯ繝ｭ繧ｰ繧､繝ｳ縺悟ｿ・ｦ√〒縺・);
      return;
    }
    setIsTranslating(true);
    setTranslationProgress({ current: 0, total: 0, sectionName: '' });

    const success = await translateAndSave(userId, sectionData, (current, total, sectionName) => {
      setTranslationProgress({ current, total, sectionName });
    });

    setIsTranslating(false);
    if (success) {
      alert('鄙ｻ險ｳ縺ｨ菫晏ｭ倥′螳御ｺ・＠縺ｾ縺励◆');
      const subdomain = await getSubdomain(userId);
      if (subdomain && onSubdomainFetched) {
        onSubdomainFetched(subdomain);
      }
    }
  };

  const handleLogout = () => {
    clearAuthData();
    window.location.href = LOGOUT_URL;
  };

  const handleSettingsSave = () => {
    const s3Endpoint = (document.getElementById('s3_endpoint') as HTMLInputElement).value;
    localStorage.setItem('s3_upload_endpoint', s3Endpoint);
    alert('險ｭ螳壹ｒ菫晏ｭ倥＠縺ｾ縺励◆');
    setShowSettings(false);
  };

  const updateSectionData = (updates: any) => {
    onSectionChange(activeSection, { ...sectionData[activeSection], ...updates });
  };

  const renderEditor = () => {
    const data = sectionData[activeSection];
    if (!data) {
      return (
        <div className="text-center text-gray-500 py-8">
          繝・・繧ｿ縺後≠繧翫∪縺帙ｓ
        </div>
      );
    }

    switch (activeSection) {
      case 'settings':
        return <SettingsEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'header':
        return <HeaderEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'hero':
        return <HeroEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'about':
        return <AboutEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'menu':
        return <MenuEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'gallery':
        return <GalleryEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'staff':
        return <StaffEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'reviews':
        return <ReviewsEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'news':
        return <NewsEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'storeInfo':
        return <StoreInfoEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'company':
        return <CompanyEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'access':
        return <AccessEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'faq':
        return <FAQEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'contact':
        return <ContactEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'cta':
        return <CTAEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'pricing':
        return <PricingEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      case 'footer':
        return <FooterEditor data={data} onUpdate={updateSectionData} storeId={userId || undefined} />;
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            縺薙・繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ縺ｮ繧ｨ繝・ぅ繧ｿ繝ｼ縺ｯ貅門ｙ荳ｭ縺ｧ縺・
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white border-l border-gray-200">
      {showLoginSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3 text-green-800 text-sm">
          笨・繝ｭ繧ｰ繧､繝ｳ縺ｫ謌仙粥縺励∪縺励◆・∫ｷｨ髮・・螳ｹ繧剃ｿ晏ｭ倥〒縺阪∪縺吶・
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">繧ｨ繝・ぅ繧ｿ繝ｼ</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="險ｭ螳・
            >
              <Settings size={20} />
            </button>
          )}
        </div>

        <div className="w-full sm:w-auto">
          {!isAuthenticated && !isAuthenticating && (
            <a
              href={LOGIN_URL}
              className="w-full sm:w-64 px-5 py-2.5 h-10 bg-gray-900 text-white rounded-lg hover:bg-black flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-md ring-1 ring-gray-900"
            >
              <LogIn size={18} />
              繝ｭ繧ｰ繧､繝ｳ
            </a>
          )}
          
          {isAuthenticating && (
            <div className="w-full sm:w-64 px-5 py-2.5 h-10 text-sm font-medium text-gray-500 flex items-center justify-center gap-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-700"></div>
              隱崎ｨｼ荳ｭ...
            </div>
          )}
          
          {isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 w-full sm:w-[340px]">
              <button
                onClick={handleSave}
                disabled={isSaving || isPublishing || isTranslating}
                className="w-full h-10 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <Save size={16} className={isSaving ? 'animate-pulse text-indigo-500' : 'text-gray-500'} />
                {isSaving ? '菫晏ｭ倅ｸｭ...' : '荳区嶌縺堺ｿ晏ｭ・}
              </button>

              <button
                onClick={handlePublish}
                disabled={isSaving || isPublishing || isTranslating}
                className="w-full h-10 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm font-bold transition-all shadow-md ring-1 ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <Globe size={16} className={isPublishing ? 'animate-spin' : ''} />
                {isPublishing ? '蜃ｦ逅・ｸｭ...' : '蜈ｬ髢・(Publish)'}
              </button>

              <button
                onClick={handleTranslateAndSave}
                disabled={isSaving || isPublishing || isTranslating}
                className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <Languages size={16} className={isTranslating ? 'animate-pulse' : ''} />
                螟夊ｨ隱槭〒遒ｺ螳・
              </button>

              <button
                onClick={handleLogout}
                className="w-full h-10 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <LogOut size={16} />
                繝ｭ繧ｰ繧｢繧ｦ繝・
              </button>
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200 space-y-3">
          <h3 className="font-medium text-sm">S3險ｭ螳・/h3>
          <div>
            <label className="block text-xs font-medium text-gray-700">S3 繧｢繝・・繝ｭ繝ｼ繝・繧ｨ繝ｳ繝峨・繧､繝ｳ繝・/label>
            <input
              id="s3_endpoint"
              type="text"
              defaultValue={localStorage.getItem('s3_upload_endpoint') || ''}
              placeholder="https://your-api-gateway.amazonaws.com/prod/upload"
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={handleSettingsSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            險ｭ螳壹ｒ菫晏ｭ・
          </button>
        </div>
      )}

      <div className="flex border-b border-gray-200 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === section.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {renderEditor()}
      </div>

      {isTranslating && (
        <TranslationLoadingModal
          current={translationProgress.current}
          total={translationProgress.total}
          sectionName={translationProgress.sectionName}
        />
      )}
    </div>
  );
}
