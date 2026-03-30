import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowRight } from 'lucide-react';

interface PaymentWallProps {
  storeId: string;
}

const PaymentWall: React.FC<PaymentWallProps> = ({ storeId }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // TODO: Stripe API Gateway Endpointを設定してください
  // 確認された本番用API Gatewayエンドポイント
  const STRIPE_CHECKOUT_API = 'https://1p5i8eve1i.execute-api.ap-southeast-2.amazonaws.com/prod/checkout'; 

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      if (STRIPE_CHECKOUT_API.includes('YOUR_API_GATEWAY_URL')) {
         alert('Stripe APIのURLが設定されていません。管理者に連絡してください。');
         setIsProcessing(false);
         return;
      }

      const response = await fetch(STRIPE_CHECKOUT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId }),
      });

      if (!response.ok) {
        throw new Error('決済セッションの作成に失敗しました');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url; // Stripeの決済ページへリダイレクト
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('エラーが発生しました。時間を置いて再度お試しください。');
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Lock size={32} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        月額プランの登録が必要です
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
        Landyのすべての機能（多言語サイトの公開・AIアシスタント等）を利用するには、プレミアムプランへの登録が必要です。
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          人気
        </div>
        <div className="text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-2">プレミアムプラン</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-extrabold text-gray-900">¥2,980</span>
            <span className="text-gray-500 font-medium">/月</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              '独自ドメインの利用',
              '無制限のAI多言語翻訳',
              'プレミアムテンプレート全体利用',
              '優先カスタマーサポート'
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <CheckCircle size={18} className="text-green-500 mr-2 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className={`group flex items-center justify-center gap-2 w-full max-w-sm py-4 px-6 rounded-xl font-bold text-white transition-all ${
          isProcessing 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            準備中...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            アップグレードして利用開始
            <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="mt-8 text-xs text-gray-400">
        <p>決済はStripeの安全なプラットフォームを通じて行われます</p>
      </div>
    </div>
  );
};

export default PaymentWall;
