import React from 'react';
import { Settings, CreditCard, ExternalLink, Calendar, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  storeId: string;
  subdomain: string | null;
  subscriptionStatus: string | null;
  planName?: string;
  trialEnd?: string | null;
  templateId?: string;
  onTemplateChange?: (newTheme: string) => void;
  onOpenEditor: () => void;
  onOpenPreview: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  storeId,
  subdomain,
  subscriptionStatus,
  planName = '繝励Ξ繝溘い繝繝励Λ繝ｳ',
  trialEnd,
  templateId = 'theme1',
  onTemplateChange,
  onOpenEditor,
  onOpenPreview,
}) => {

  const handleOpenCustomerPortal = async () => {
    try {
      // TODO: Replace with the actual endpoint for creating a portal session
      const PORTAL_API_URL = 'https://1p5i8eve1i.execute-api.ap-southeast-2.amazonaws.com/prod/create-portal-session';
      
      const response = await fetch(PORTAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId }),
      });

      if (!response.ok) {
        throw new Error('繝昴・繧ｿ繝ｫ繧ｻ繝・す繝ｧ繝ｳ縺ｮ菴懈・縺ｫ螟ｱ謨励＠縺ｾ縺励◆');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('迴ｾ蝨ｨCustomer Portal縺ｯ貅門ｙ荳ｭ縺ｧ縺吶ら腸蠅・ｨｭ螳壹ｒ縺皮｢ｺ隱阪￥縺縺輔＞縲・);
    }
  };

  const calculateRemainingDays = (endDateStr: string | undefined | null) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const remainingDays = calculateRemainingDays(trialEnd);
  const totalTrialDays = 30; // 30譌･縺ｨ莉ｮ螳・
  const trialProgress = trialEnd ? Math.max(0, Math.min(100, ((totalTrialDays - remainingDays) / totalTrialDays) * 100)) : 100;

  return (
    <div className="p-8 bg-gray-50 h-full flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Landy 繝繝・す繝･繝懊・繝・/h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 迴ｾ蝨ｨ縺ｮ繝励Λ繝ｳ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">迴ｾ蝨ｨ縺ｮ繝励Λ繝ｳ</h2>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{planName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-500" />
              <span>{subscriptionStatus === 'active' ? '繧ｵ繝悶せ繧ｯ繝ｪ繝励す繝ｧ繝ｳ譛牙柑' : (subscriptionStatus === 'trialing' ? '繝医Λ繧､繧｢繝ｫ荳ｭ' : '譛ｪ螂醍ｴ・・遒ｺ隱堺ｸｭ')}</span>
            </div>
          </div>

          {/* 辟｡譁呎悄髢捺ュ蝣ｱ */}
          {(subscriptionStatus === 'trialing' || trialEnd) && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">辟｡譁呎悄髢・/h2>
              </div>
              <div className="mb-2 flex justify-between items-end">
                <span className="text-gray-600">谿九ｊ</span>
                <span className="text-3xl font-bold text-gray-900">{remainingDays}<span className="text-lg font-medium text-gray-500 ml-1">譌･</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${trialProgress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">邨ゆｺ・ｺ亥ｮ・ {trialEnd ? new Date(trialEnd).toLocaleDateString('ja-JP') : '-'}</p>
            </div>
          )}

          {/* 繧ｵ繧､繝育憾豕・*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <ExternalLink size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">繧ｵ繧､繝育憾豕・/h2>
            </div>
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                蜈ｬ髢倶ｸｭ
              </span>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg break-all">
              https://{subdomain ? `${subdomain}.neural-seeds.com` : '(譛ｪ險ｭ螳・.neural-seeds.com'}
            </div>
          </div>
          
          {/* 繝励Λ繝ｳ邂｡逅・*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Settings size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">繝励Λ繝ｳ邂｡逅・/h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              繝励Λ繝ｳ縺ｮ螟画峩縲∵髪謇輔＞譁ｹ豕輔・譖ｴ譁ｰ縲√∪縺溘・隗｣邏・・謇狗ｶ壹″繧定｡後＞縺ｾ縺吶・
            </p>
            <button
              onClick={handleOpenCustomerPortal}
              className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
            >
              <ExternalLink size={16} />
              Customer Portal 繧帝幕縺・
            </button>
          </div>
        </div>

        {/* 繝・Φ繝励Ξ繝ｼ繝・*/}
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">繝・Φ繝励Ξ繝ｼ繝・/h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <p className="text-sm text-gray-600 mb-5">蜈ｬ髢記P縺ｮ繝・じ繧､繝ｳ繝・Φ繝励Ξ繝ｼ繝医ｒ螟画峩縺励∪縺吶ょ､画峩蠕後・谺｡蝗槭ン繝ｫ繝画凾縺ｫ蜿肴丐縺輔ｌ縺ｾ縺吶・/p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'theme1', name: 'Standard', color: '#0d9488', desc: '貂・ｽ疲─繝ｻ荳・・' },
              { id: 'theme2', name: 'Modern', color: '#3b82f6', desc: '繝繝ｼ繧ｯ繝ｻ鬮倡ｴ壽─' },
              { id: 'theme3', name: 'Elegant', color: '#b45309', desc: '蜥碁｢ｨ繝ｻ繧ｨ繝ｬ繧ｬ繝ｳ繝・ },
              { id: 'theme4', name: 'Pop', color: '#ef4444', desc: '繝昴ャ繝励・隕ｪ縺励∩' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => onTemplateChange && onTemplateChange(t.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  templateId === t.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {templateId === t.id && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                )}
                <div className="w-10 h-10 rounded-full" style={{ background: t.color }} />
                <span className="font-bold text-sm text-gray-800">{t.name}</span>
                <span className="text-xs text-gray-500">{t.desc}</span>
              </button>
            ))}
          </div>
          {templateId && (
            <p className="mt-4 text-xs text-gray-400 text-center">
              迴ｾ蝨ｨ驕ｸ謚樔ｸｭ: <strong className="text-gray-700">{templateId === 'theme1' ? 'Standard' : templateId === 'theme2' ? 'Modern' : templateId === 'theme3' ? 'Elegant' : 'Pop'}</strong>
            </p>
          )}
        </div>

        {/* 繧ｯ繧､繝・け繧｢繧ｯ繧ｷ繝ｧ繝ｳ */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">繧ｵ繧､繝医・邱ｨ髮・/h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onOpenEditor}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl shadow-sm border border-transparent hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            繧ｨ繝・ぅ繧ｿ繝ｼ繧帝幕縺・
          </button>
          <button
             onClick={onOpenPreview}
            className="flex-1 py-4 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            繝励Ξ繝薙Η繝ｼ繧定ｦ九ｋ
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
