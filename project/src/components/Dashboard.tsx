import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  XCircle,
  LayoutDashboard,
  FileText,
  Settings,
  Loader2,
} from 'lucide-react';

interface SubscriptionInfo {
  plan: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  trialEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}

interface DashboardProps {
  storeId: string;
  subscriptionStatus: string | null;
  onOpenEditor: () => void;
}

const SETTINGS_ENDPOINT = 'https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/settings';
const CUSTOMER_PORTAL_API = 'https://1p5i8eve1i.execute-api.ap-southeast-2.amazonaws.com/prod/customer-portal';

type TabId = 'overview' | 'subscription' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ storeId, subscriptionStatus, onOpenEditor }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    plan: null,
    status: subscriptionStatus,
    currentPeriodEnd: null,
    trialEnd: null,
    cancelAtPeriodEnd: false,
    stripeCustomerId: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${SETTINGS_ENDPOINT}/${storeId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const result = await response.json();
          setSubscriptionInfo({
            plan: result.subscription_plan || result.subscriptionPlan || 'standard',
            status: result.subscription_status || result.subscriptionStatus || subscriptionStatus,
            currentPeriodEnd: result.current_period_end || result.currentPeriodEnd || null,
            trialEnd: result.trial_end || result.trialEnd || null,
            cancelAtPeriodEnd: result.cancel_at_period_end ?? result.cancelAtPeriodEnd ?? false,
            stripeCustomerId: result.stripe_customer_id || result.stripeCustomerId || null,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, [storeId, subscriptionStatus]);

  const handleOpenCustomerPortal = async () => {
    setIsPortalLoading(true);
    try {
      const response = await fetch(CUSTOMER_PORTAL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('カスタマーポータルのセッション作成に失敗しました');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Customer portal error:', error);
      alert('エラーが発生しました。時間を置いて再度お試しください。');
    } finally {
      setIsPortalLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const getTrialDaysRemaining = (): number | null => {
    if (!subscriptionInfo.trialEnd) return null;
    const trialEnd = new Date(subscriptionInfo.trialEnd);
    const now = new Date();
    const diffMs = trialEnd.getTime() - now.getTime();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = () => {
    const status = subscriptionInfo.status;
    if (status === 'trialing') {
      const daysLeft = getTrialDaysRemaining();
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
          <Clock size={14} />
          無料トライアル中{daysLeft !== null ? `（残り${daysLeft}日）` : ''}
        </span>
      );
    }
    if (status === 'active') {
      if (subscriptionInfo.cancelAtPeriodEnd) {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
            <AlertTriangle size={14} />
            解約予定
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
          <CheckCircle size={14} />
          有効
        </span>
      );
    }
    if (status === 'past_due') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
          <AlertTriangle size={14} />
          支払い遅延
        </span>
      );
    }
    if (status === 'canceled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
          <XCircle size={14} />
          解約済み
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-500">
        未登録
      </span>
    );
  };

  const getPlanLabel = (): string => {
    const plan = subscriptionInfo.plan;
    if (!plan) return '未設定';
    if (plan.includes('year') || plan.includes('annual')) return 'スタンダードプラン（年額）';
    return 'スタンダードプラン（月額）';
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '概要', icon: <LayoutDashboard size={16} /> },
    { id: 'subscription', label: 'プラン・お支払い', icon: <CreditCard size={16} /> },
    { id: 'settings', label: '契約管理', icon: <Settings size={16} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>ダッシュボードを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-blue-600" />
            ダッシュボード
          </h1>
          <button
            onClick={onOpenEditor}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} />
            サイト編集
          </button>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Current Plan Card */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">現在のプラン</h3>
                  {getStatusBadge()}
                </div>
                <p className="text-xl font-bold text-gray-900">{getPlanLabel()}</p>
                {subscriptionInfo.currentPeriodEnd && (
                  <p className="text-sm text-gray-500 mt-1">
                    次回更新日: {formatDate(subscriptionInfo.currentPeriodEnd)}
                  </p>
                )}
              </div>

              {/* Trial Info Card */}
              {subscriptionInfo.status === 'trialing' && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">無料トライアル期間中</h3>
                      {(() => {
                        const daysLeft = getTrialDaysRemaining();
                        if (daysLeft !== null && daysLeft > 0) {
                          return (
                            <>
                              <p className="text-3xl font-extrabold text-amber-600 mt-1">
                                残り {daysLeft} 日
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                トライアル終了日: {formatDate(subscriptionInfo.trialEnd)}
                              </p>
                            </>
                          );
                        }
                        if (daysLeft === 0) {
                          return (
                            <p className="text-sm text-red-600 mt-1 font-semibold">
                              トライアルは本日終了します
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel Warning */}
              {subscriptionInfo.cancelAtPeriodEnd && (
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900">解約予定</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        現在の請求期間終了後（{formatDate(subscriptionInfo.currentPeriodEnd)}）にサービスが停止されます。
                        解約をキャンセルするには「契約管理」タブからStripeカスタマーポータルをご利用ください。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">クイックアクション</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={onOpenEditor}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">サイトを編集する</p>
                    <p className="text-xs text-gray-500">コンテンツの編集・公開</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">プラン・お支払い</p>
                    <p className="text-xs text-gray-500">プランの確認・変更</p>
                  </div>
                </button>
                <button
                  onClick={handleOpenCustomerPortal}
                  disabled={isPortalLoading}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    {isPortalLoading ? (
                      <Loader2 size={18} className="text-purple-600 animate-spin" />
                    ) : (
                      <Settings size={18} className="text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">契約管理ポータル</p>
                    <p className="text-xs text-gray-500">お支払い方法・解約はこちら</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">プラン詳細</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">プラン名</span>
                  <span className="text-sm font-semibold text-gray-900">{getPlanLabel()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">ステータス</span>
                  {getStatusBadge()}
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">次回更新日</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(subscriptionInfo.currentPeriodEnd)}
                  </span>
                </div>
                {subscriptionInfo.trialEnd && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">トライアル終了日</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDate(subscriptionInfo.trialEnd)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-600">自動更新</span>
                  <span className={`text-sm font-semibold ${subscriptionInfo.cancelAtPeriodEnd ? 'text-red-600' : 'text-green-600'}`}>
                    {subscriptionInfo.cancelAtPeriodEnd ? 'OFF（解約予定）' : 'ON'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Management */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">お支払い管理</h3>
              <p className="text-sm text-gray-600 mb-4">
                お支払い方法の変更、請求書の確認、プランの変更はStripeカスタマーポータルから行えます。
              </p>
              <button
                onClick={handleOpenCustomerPortal}
                disabled={isPortalLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPortalLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    読み込み中...
                  </>
                ) : (
                  <>
                    <ExternalLink size={18} />
                    Stripeカスタマーポータルを開く
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Customer Portal */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">契約管理</h3>
              <p className="text-sm text-gray-600 mb-4">
                Stripeカスタマーポータルでは以下の操作が可能です：
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'お支払い方法の追加・変更',
                  '請求書・領収書の確認・ダウンロード',
                  'プランの変更（月額 ⇔ 年額）',
                  'サブスクリプションの解約',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <CheckCircle size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleOpenCustomerPortal}
                disabled={isPortalLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPortalLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    読み込み中...
                  </>
                ) : (
                  <>
                    <ExternalLink size={18} />
                    カスタマーポータルを開く
                  </>
                )}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl p-5 border border-red-200 shadow-sm">
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">解約について</h3>
              <p className="text-sm text-gray-600 mb-3">
                解約はStripeカスタマーポータルから行えます。解約しても現在の請求期間の終了まではサービスをご利用いただけます。
              </p>
              <p className="text-xs text-gray-400">
                ストアID: {storeId}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
