import { useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { saveSection } from '../services/api';
import {
  HeroEditor,
  AboutEditor,
  MenuEditor,
  GalleryEditor,
  StaffEditor,
  NewsEditor,
  StoreInfoEditor,
  CTAEditor,
  PricingEditor,
} from './EditorSections';

interface EditorProps {
  userId: string;
  sectionData: any;
  onSectionChange: (section: string, data: any) => void;
}

export default function Editor({ userId, sectionData, onSectionChange }: EditorProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const sections = [
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
  ];

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveSection(userId, activeSection, sectionData[activeSection]);
    setIsSaving(false);
    if (success) {
      alert('保存しました');
    }
  };

  const handleSettingsSave = () => {
    const apiEndpoint = (document.getElementById('api_endpoint') as HTMLInputElement).value;
    const s3Endpoint = (document.getElementById('s3_endpoint') as HTMLInputElement).value;
    localStorage.setItem('api_gateway_endpoint', apiEndpoint);
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
      case 'hero':
        return <HeroEditor data={data} onUpdate={updateSectionData} />;
      case 'about':
        return <AboutEditor data={data} onUpdate={updateSectionData} />;
      case 'menu':
        return <MenuEditor data={data} onUpdate={updateSectionData} />;
      case 'gallery':
        return <GalleryEditor data={data} onUpdate={updateSectionData} />;
      case 'staff':
        return <StaffEditor data={data} onUpdate={updateSectionData} />;
      case 'news':
        return <NewsEditor data={data} onUpdate={updateSectionData} />;
      case 'storeInfo':
        return <StoreInfoEditor data={data} onUpdate={updateSectionData} />;
      case 'cta':
        return <CTAEditor data={data} onUpdate={updateSectionData} />;
      case 'pricing':
        return <PricingEditor data={data} onUpdate={updateSectionData} />;
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">エディター</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <Settings size={16} />
            設定
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200 space-y-3">
          <h3 className="font-medium text-sm">API設定</h3>
          <div>
            <label className="block text-xs font-medium text-gray-700">API Gateway エンドポイント</label>
            <input
              id="api_endpoint"
              type="text"
              defaultValue={localStorage.getItem('api_gateway_endpoint') || ''}
              placeholder="https://your-api-gateway.amazonaws.com/prod"
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>
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
    </div>
  );
}
