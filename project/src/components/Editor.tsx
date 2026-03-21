import { useState, useEffect } from 'react';
import { Save, Settings, LogIn, Languages, LogOut, Globe } from 'lucide-react';
import { saveAllSections, getSubdomain, translateAndSave, triggerDeployWebhook } from '../services/api';
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

const LOGIN_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/login?client_id=12nf22nqg8mpcq1q77nm5uqbls&response_type=code&scope=email+openid+profile&redirect_uri=https%3A%2F%2Fadmin-lp.global-reaches.com';
const LOGOUT_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/logout?client_id=12nf22nqg8mpcq1q77nm5uqbls&logout_uri=https%3A%2F%2Fadmin-lp.global-reaches.com';

export default function Editor({ userId, sectionData, onSectionChange, isAuthenticated, isAuthenticating, onSubdomainFetched }: EditorProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0, sectionName: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  const sections = [
    { id: 'header', label: 'ヘッダー' },
    { id: 'hero', label: 'ヒーロー' },
    { id: 'about', label: 'こだわり' },
    { id: 'menu', label: 'お品書き' },
    { id: 'pricing', label: 'コース・プラン' },
    { id: 'cta', label: 'CTA' },
    { id: 'gallery', label: 'ギャラリー' },
    { id: 'staff', label: 'スタッフ' },
    { id: 'reviews', label: 'お客様の声' },
    { id: 'news', label: 'お知らせ' },
    { id: 'storeInfo', label: '店舗情報' },
    { id: 'company', label: '事業所概要' },
    { id: 'access', label: 'アクセス' },
    { id: 'faq', label: 'よくある質問' },
    { id: 'contact', label: 'お問い合わせ' },
    { id: 'footer', label: 'フッター' },
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
      alert('保存するにはログインが必要です');
      return;
    }
    setIsSaving(true);
    const success = await saveAllSections(userId, sectionData, 'Draft');
    setIsSaving(false);
    if (success) {
      alert('すべてのセクションを下書き保存しました');
      const subdomain = await getSubdomain(userId);
      if (subdomain && onSubdomainFetched) {
        onSubdomainFetched(subdomain);
      }
    }
  };

  const handlePublish = async () => {
    if (!userId) {
      alert('公開するにはログインが必要です');
      return;
    }
    setIsPublishing(true);
    const success = await saveAllSections(userId, sectionData, 'Published');
    setIsPublishing(false);
    if (success) {
      const webhookSuccess = await triggerDeployWebhook();
      if (webhookSuccess) {
        alert('すべてのセクションを「公開」ステータスで保存・反映しました！\n（約1分で本番サイトへ反映されます）');
      } else {
        alert('データの保存には成功しましたが、ビルドの自動実行（Webhook）に失敗しました。');
      }

      const subdomain = await getSubdomain(userId);
      if (subdomain && onSubdomainFetched) {
        onSubdomainFetched(subdomain);
      }
    }
  };

  const handleTranslateAndSave = async () => {
    if (!userId) {
      alert('保存するにはログインが必要です');
      return;
    }
    setIsTranslating(true);
    setTranslationProgress({ current: 0, total: 0, sectionName: '' });

    const success = await translateAndSave(userId, sectionData, (current, total, sectionName) => {
      setTranslationProgress({ current, total, sectionName });
    });

    setIsTranslating(false);
    if (success) {
      alert('翻訳と保存が完了しました');
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
    alert('設定を保存しました');
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
          データがありません
        </div>
      );
    }

    switch (activeSection) {
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
            このセクションのエディターは準備中です
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white border-l border-gray-200">
      {showLoginSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3 text-green-800 text-sm">
          ✓ ログインに成功しました！編集内容を保存できます。
        </div>
      )}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">エディター</h2>
        <div className="flex items-center gap-3">
          {!isAuthenticated && !isAuthenticating && (
            <a
              href={LOGIN_URL}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black flex items-center gap-2 text-sm font-semibold transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 ring-1 ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <LogIn size={18} />
              ログイン
            </a>
          )}
          {isAuthenticating && (
            <div className="px-5 py-2.5 text-sm font-medium text-gray-500 flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-700"></div>
              認証中...
            </div>
          )}
          {isAuthenticated && (
            <>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                title="設定"
              >
                <Settings size={20} />
              </button>
              
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              
              <button
                onClick={handleSave}
                disabled={isSaving || isPublishing || isTranslating}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <Save size={16} className={isSaving ? 'animate-pulse text-indigo-500' : 'text-gray-500'} />
                {isSaving ? '保存中...' : '下書き保存'}
              </button>
              
              <button
                onClick={handleTranslateAndSave}
                disabled={isSaving || isPublishing || isTranslating}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <Languages size={16} className={isTranslating ? 'animate-pulse' : ''} />
                多言語で確定
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isSaving || isPublishing || isTranslating}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 ring-1 ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ml-1"
              >
                <Globe size={16} className={isPublishing ? 'animate-spin' : ''} />
                {isPublishing ? '処理中...' : '公開 (Publish)'}
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <LogOut size={16} />
                ログアウト
              </button>
            </>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200 space-y-3">
          <h3 className="font-medium text-sm">S3設定</h3>
          <div>
            <label className="block text-xs font-medium text-gray-700">S3 アップロード エンドポイント</label>
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
            設定を保存
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
