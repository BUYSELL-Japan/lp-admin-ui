import { useState, useEffect } from 'react';
import { Eye, Edit } from 'lucide-react';
import Preview from './components/Preview';
import Editor from './components/Editor';
import Dashboard from './components/Dashboard';
import PaymentWall from './components/PaymentWall';
import { LanguageProvider } from './contexts/LanguageContext';
import {
  exchangeCodeForTokens,
  getStoreIdFromToken,
  getCodeFromUrl,
  storeAuthData,
  getStoredStoreId,
  clearAuthData,
} from './services/auth';
import { getSubdomain, getSectionData, getStoreInfo, saveTemplateId } from './services/api';
import {
  headerData,
  heroData,
  aboutData,
  menuData,
  pricingData,
  ctaData,
  galleryData,
  staffData,
  reviewsData,
  newsData,
  storeInfoData,
  companyData,
  accessData,
  faqData,
  contactData,
  footerData,
  settingsData,
} from './data/content';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor' | 'preview'>('dashboard');
  const [planName, setPlanName] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string>('theme1');
  const [sectionData, setSectionData] = useState({
    header: headerData,
    hero: heroData,
    about: aboutData,
    menu: menuData,
    pricing: pricingData,
    cta: ctaData,
    gallery: galleryData,
    staff: staffData,
    reviews: reviewsData,
    news: newsData,
    storeInfo: storeInfoData,
    company: companyData,
    access: accessData,
    faq: faqData,
    contact: contactData,
    footer: footerData,
    settings: settingsData,
  });

  useEffect(() => {
    const handleAuth = async () => {
      const code = getCodeFromUrl();
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      console.log('=== DEBUG: Auth Started ===');
      console.log('Code from URL:', code);
      console.log('Session ID from URL:', sessionId);
      console.log('Current URL:', window.location.href);
      console.log('Stored store_id:', getStoredStoreId());
      console.log('Stored id_token exists:', !!localStorage.getItem('id_token'));
      console.log('==========================');

      // Stripe決済直後 (session_idがある) の場合は、カスタム属性(store_id)が最新化されているため、
      // 既存の古いトークンを破棄して、Cognitoから新しいトークンを取り直す必要があります。
      if (sessionId && !code) {
        console.log('DEBUG: Returned from Stripe Checkout. Saving session_id and forcing fresh login...');
        // ★ Cognitoリダイレクト後も「決済直後」とわかるようにフラグを保存
        localStorage.setItem('stripe_just_paid', '1');
        clearAuthData();
        
        // CognitoのログインURLへリダイレクトして新しいトークンを要求
        // ※Googleにログイン済みなら画面は出ずに一瞬でリダイレクトして戻ってきます
        const COGNITO_AUTHORIZE_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=12nf22nqg8mpcq1q77nm5uqbls&response_type=code&scope=email+openid+profile&redirect_uri=https://admin-lp.global-reaches.com';
        window.location.href = COGNITO_AUTHORIZE_URL;
        return;
      }

      if (code) {
        console.log('DEBUG: Code detected, removing from URL');
        window.history.replaceState({}, document.title, window.location.pathname);

        const storedStoreId = getStoredStoreId();
        if (storedStoreId) {
          console.log('DEBUG: Existing store_id found, checking validity');
          const idToken = localStorage.getItem('id_token');
          if (idToken) {
            const validStoreId = getStoreIdFromToken(idToken);
            if (validStoreId === storedStoreId) {
              console.log('DEBUG: Existing auth valid, using stored credentials');
              setUserId(storedStoreId);
              setIsAuthenticating(false);
              return;
            }
          }
        }

        console.log('DEBUG: Clearing auth and exchanging code for tokens');
        clearAuthData();

        try {
          const tokens = await exchangeCodeForTokens(code);
          console.log('DEBUG: Token exchange successful');
          const storeId = getStoreIdFromToken(tokens.id_token);

          if (storeId) {
            console.log('DEBUG: Store ID found:', storeId);
            storeAuthData(tokens, storeId);
            setUserId(storeId);
          } else {
            console.error('Unable to get store_id from token');
            clearAuthData();
          }
        } catch (error) {
          console.error('Authentication error:', error);
          clearAuthData();
        }
      } else {
        console.log('DEBUG: No code in URL, checking stored auth');
        const storedStoreId = getStoredStoreId();
        if (storedStoreId) {
          const idToken = localStorage.getItem('id_token');
          if (idToken) {
            const validStoreId = getStoreIdFromToken(idToken);
            if (validStoreId === storedStoreId) {
              console.log('DEBUG: Using stored auth, store_id:', storedStoreId);
              setUserId(storedStoreId);
            } else {
              console.error('Stored token is invalid, clearing auth data');
              clearAuthData();
            }
          } else {
            clearAuthData();
          }
        }
      }

      setIsAuthenticating(false);
    };

    handleAuth();
  }, []);

  useEffect(() => {
    const loadSectionData = async () => {
      if (userId) {
        setIsCheckingSubscription(true);
        try {
          // ★ Stripe決済直後フラグを確認
          const justPaid = localStorage.getItem('stripe_just_paid') === '1';

          let storeInfo = await getStoreInfo(userId);

          // ★ 安全網: APIエラーで両方nullの場合は1回だけリトライして確認する
          // （APIが一時的に落ちている場合は再ログインではなくリトライする）
          if (!storeInfo.subdomain && !storeInfo.subscriptionStatus) {
            console.warn('Store info returned empty, retrying once before any action...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            storeInfo = await getStoreInfo(userId);

            // リトライ後もどちらも取れない場合のみ、本当に存在しないと判断して再ログイン
            if (!storeInfo.subdomain && !storeInfo.subscriptionStatus) {
              console.warn('Store not found in DynamoDB for userId:', userId, '- forcing re-login');
              clearAuthData();
              const COGNITO_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=12nf22nqg8mpcq1q77nm5uqbls&response_type=code&scope=email+openid+profile&redirect_uri=https://admin-lp.global-reaches.com';
              window.location.href = COGNITO_URL;
              return;
            }
          }

          setSubdomain(storeInfo.subdomain);
          setPlanName(storeInfo.planName || null);
          setTrialEnd(storeInfo.trialEnd || null);
          setTemplateId(storeInfo.templateId || 'theme1');

          // ★ 決済直後にWebhookがまだ届いていない場合のリトライポーリング
          if (justPaid && storeInfo.subscriptionStatus !== 'active') {
            console.log('Stripe just paid flag detected. Polling for subscription activation...');
            let retries = 0;
            const maxRetries = 10; // 最大10回 = 30秒
            while (retries < maxRetries && storeInfo.subscriptionStatus !== 'active') {
              await new Promise(resolve => setTimeout(resolve, 3000));
              console.log(`Polling attempt ${retries + 1}/${maxRetries}...`);
              storeInfo = await getStoreInfo(userId);
              retries++;
            }
            if (storeInfo.subscriptionStatus === 'active') {
              console.log('✅ Subscription confirmed active after polling!');
              localStorage.removeItem('stripe_just_paid');
            } else {
              console.warn('⚠️ Subscription still not active after 30s polling.');
              // ポーリング上限に達してもフラグを削除してループを防ぐ
              localStorage.removeItem('stripe_just_paid');
            }
          } else if (justPaid && storeInfo.subscriptionStatus === 'active') {
            // 既にactiveなら即座にフラグ削除
            localStorage.removeItem('stripe_just_paid');
          }

          // ★ subscriptionStatus確定後にsection dataを読み込む（tryブロック内に移動）
          setSubscriptionStatus(storeInfo.subscriptionStatus);

          console.log('=== Loading Section Data ===');
          console.log('User ID:', userId);
          const savedData = await getSectionData(userId);
          console.log('Saved data received:', savedData);
          if (savedData) {
            console.log('Saved data keys:', Object.keys(savedData));
            console.log('Saved data hero sample:', savedData.hero);
            console.log('=== Checking problematic sections ===');
            console.log('pricing:', JSON.stringify(savedData.pricing, null, 2));
            console.log('staff:', JSON.stringify(savedData.staff, null, 2));
            console.log('reviews:', JSON.stringify(savedData.reviews, null, 2));
            console.log('company:', JSON.stringify(savedData.company, null, 2));
            console.log('access:', JSON.stringify(savedData.access, null, 2));
            console.log('=====================================');
            console.log('Merging saved data with default data');
            setSectionData((prev) => {
              const merged = { ...prev };

              Object.keys(savedData).forEach(key => {
                if (savedData[key] && typeof savedData[key] === 'object' && Object.keys(savedData[key]).length > 0) {
                  console.log(`  Merging section: ${key}`);
                  console.log(`    Saved keys:`, Object.keys(savedData[key]).join(', '));
                  console.log(`    Default keys:`, prev[key] ? Object.keys(prev[key]).join(', ') : 'none');

                  if (key === 'storeInfo' && savedData[key].items && Array.isArray(savedData[key].items)) {
                    const icons = ['MapPin', 'Clock', 'Phone', 'Mail'];
                    const titles = ['所在地', '営業時間', '電話番号', 'メール'];

                    const convertedItems = savedData[key].items.map((item: any, index: number) => {
                      let content = '';
                      if (typeof item === 'string') {
                        content = item;
                      } else if (typeof item === 'object') {
                        if (item.ja) {
                          content = item.ja;
                        } else if (item.content) {
                          content = typeof item.content === 'string' ? item.content : item.content.ja || '';
                        } else {
                          const values = Object.values(item);
                          content = values.length > 0 ? String(values[0]) : '';
                        }
                      }

                      return {
                        icon: item.icon || icons[index] || 'MapPin',
                        title: item.title || titles[index] || '',
                        content: content
                      };
                    });

                    merged[key] = {
                      ...prev[key],
                      ...savedData[key],
                      items: convertedItems
                    };
                    console.log(`    Converted storeInfo items:`, convertedItems);
                  } else {
                    merged[key] = {
                      ...prev[key],
                      ...savedData[key],
                    };
                  }
                  console.log(`    Merged keys:`, Object.keys(merged[key]).join(', '));
                } else {
                  console.log(`  Skipping empty or invalid section: ${key}`);
                }
              });

              console.log('Merged data keys:', Object.keys(merged));
              console.log('Merged hero sample:', JSON.stringify(merged.hero, null, 2).substring(0, 300));
              console.log('Merged storeInfo sample:', JSON.stringify(merged.storeInfo, null, 2).substring(0, 300));
              console.log('Merged company sample:', JSON.stringify(merged.company, null, 2).substring(0, 300));
              console.log('=== After Deep Merge ===');
              console.log('hero exists:', merged.hero ? 'Yes' : 'No');
              console.log('hero.title:', merged.hero?.title || 'Missing');
              console.log('storeInfo exists:', merged.storeInfo ? 'Yes' : 'No');
              console.log('storeInfo.items:', merged.storeInfo?.items?.length || 'Missing');
              console.log('company exists:', merged.company ? 'Yes' : 'No');
              console.log('company.philosophy:', merged.company?.philosophy ? 'Yes' : 'No');
              console.log('pricing plans exists:', merged.pricing?.plans ? 'Yes' : 'No');
              console.log('staff members exists:', merged.staff?.members ? 'Yes' : 'No');
              console.log('reviews reviews exists:', merged.reviews?.reviews ? 'Yes' : 'No');
              console.log('========================');
              return merged;
            });
          } else {
            console.log('No saved data found, using default data');
          }
          console.log('===========================');
        } catch (error) {
          console.error('Error loading store data:', error);
        } finally {
          // ★ 成功・失敗どちらでも必ずスピナーを解除する
          setIsCheckingSubscription(false);
        }
      }
    };

    loadSectionData();
  }, [userId]);

  const handleSectionChange = (section: string, data: any) => {
    setSectionData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubdomainFetched = (fetchedSubdomain: string | null) => {
    setSubdomain(fetchedSubdomain);
  };

  const handlePreviewToggle = async () => {
    if (activeTab !== 'preview' && userId && !subdomain) {
      const fetchedSubdomain = await getSubdomain(userId);
      setSubdomain(fetchedSubdomain);
    }
    setActiveTab(activeTab === 'preview' ? 'editor' : 'preview');
  };

  const handleEditorToggle = () => {
    setActiveTab('editor');
  };

  const handleDashboardToggle = () => {
    setActiveTab('dashboard');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="md:hidden fixed bottom-4 right-4 z-50 flex gap-2">
          {activeTab !== 'dashboard' && (
            <button
              onClick={handleDashboardToggle}
              className="px-4 py-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 flex items-center gap-2"
            >
              <span>ダッシュボード</span>
            </button>
          )}
          <button
            onClick={handlePreviewToggle}
            className="px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {activeTab === 'preview' ? (
              <>
                <Edit size={20} />
                <span>編集</span>
              </>
            ) : (
              <>
                <Eye size={20} />
                <span>プレビュー</span>
              </>
            )}
          </button>
        </div>

        <div className="flex h-screen">
          {/* 左側のプレビュー画面、エディタータブまたはダッシュボードタブの場合はPC環境のみ表示される */}
          <div className={`flex-1 ${activeTab === 'preview' ? 'block' : 'hidden'} md:block transition-all`}>
            <Preview sectionData={sectionData} isAuthenticated={!!userId} subdomain={subdomain} />
          </div>
          
          {/* 右側の操作パネル（ダッシュボードまたはエディター） */}
          <div className={`w-full md:w-[500px] ${activeTab === 'preview' ? 'hidden' : 'block'} bg-white overflow-y-auto flex flex-col`}>
             {/* タブナビゲーション */}
             {userId && subscriptionStatus === 'active' && (
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ダッシュボード
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  エディター
                </button>
              </div>
            )}

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-y-auto">
              {userId && isCheckingSubscription ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>契約状況を確認しています...</p>
                </div>
              ) : userId && subscriptionStatus !== 'active' ? (
                <PaymentWall storeId={userId} />
              ) : !userId || activeTab === 'editor' ? (
                <Editor
                  userId={userId}
                  sectionData={sectionData}
                  onSectionChange={handleSectionChange}
                  isAuthenticated={!!userId}
                  isAuthenticating={isAuthenticating}
                  onSubdomainFetched={handleSubdomainFetched}
                />
              ) : (
                <Dashboard 
                  storeId={userId!} 
                  subdomain={subdomain} 
                  subscriptionStatus={subscriptionStatus}
                  planName={planName || undefined}
                  trialEnd={trialEnd}
                  templateId={templateId}
                  onTemplateChange={async (newTheme: string) => {
                    if (userId) {
                      const ok = await saveTemplateId(userId, newTheme);
                      if (ok) setTemplateId(newTheme);
                    }
                  }}
                  onOpenEditor={handleEditorToggle}
                  onOpenPreview={handlePreviewToggle}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
