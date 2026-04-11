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
  planName = 'プレミアムプラン',
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
        throw new Error('ポータルセッションの作成に失敗しました');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('現在Customer Portalは準備中です。環境設定をご確認ください。');
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
  const totalTrialDays = 30; // 30日と仮定
  const trialProgress = trialEnd ? Math.max(0, Math.min(100, ((totalTrialDays - remainingDays) / totalTrialDays) * 100)) : 100;

  return (
    <div className="p-8 bg-gray-50 h-full flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Landy ダッシュボード</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 現在のプラン */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">現在のプラン</h2>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{planName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-500" />
              <span>{subscriptionStatus === 'active' ? 'サブスクリプション有効' : (subscriptionStatus === 'trialing' ? 'トライアル中' : '未契約・確認中')}</span>
            </div>
          </div>

          {/* 無料期間情報 */}
          {(subscriptionStatus === 'trialing' || trialEnd) && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">無料期間</h2>
              </div>
              <div className="mb-2 flex justify-between items-end">
                <span className="text-gray-600">残り</span>
                <span className="text-3xl font-bold text-gray-900">{remainingDays}<span className="text-lg font-medium text-gray-500 ml-1">日</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${trialProgress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">終了予定: {trialEnd ? new Date(trialEnd).toLocaleDateString('ja-JP') : '-'}</p>
            </div>
          )}

          {/* サイト状況 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <ExternalLink size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">サイト状況</h2>
            </div>
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                公開中
              </span>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg break-all">
              https://{subdomain ? `${subdomain}.global-reaches.com` : '(未設定).global-reaches.com'}
            </div>
          </div>
          
          {/* プラン管理 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Settings size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">プラン管理</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              プランの変更、支払い方法の更新、または解約の手続きを行います。
            </p>
            <button
              onClick={handleOpenCustomerPortal}
              className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
            >
              <ExternalLink size={16} />
              Customer Portal を開く
            </button>
          </div>
        </div>

        {/* テンプレート */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">テンプレート</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <p className="text-sm text-gray-600 mb-5">公開LPのデザインテンプレートを変更します。変更後は次回ビルド時に反映されます。</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'theme1', name: 'Standard', color: '#0d9488', desc: '清潔感・万能' },
              { id: 'theme2', name: 'Modern', color: '#3b82f6', desc: 'ダーク・高級感' },
              { id: 'theme3', name: 'Elegant', color: '#b45309', desc: '和風・エレガント' },
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
              現在選択中: <strong className="text-gray-700">{templateId === 'theme1' ? 'Standard' : templateId === 'theme2' ? 'Modern' : 'Elegant'}</strong>
            </p>
          )}
        </div>

        {/* クイックアクション */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">サイトの編集</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onOpenEditor}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl shadow-sm border border-transparent hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            エディターを開く
          </button>
          <button
             onClick={onOpenPreview}
            className="flex-1 py-4 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            プレビューを見る
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
