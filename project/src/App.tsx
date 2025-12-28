import { useState, useEffect } from 'react';
import { Eye, Edit } from 'lucide-react';
import Preview from './components/Preview';
import Editor from './components/Editor';
import {
  exchangeCodeForTokens,
  getStoreIdFromToken,
  getCodeFromUrl,
  storeAuthData,
  getStoredStoreId,
  clearAuthData,
} from './services/auth';
import { getSubdomain } from './services/api';
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
} from './data/content';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [subdomain, setSubdomain] = useState<string | null>(null);
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
  });

  useEffect(() => {
    const handleAuth = async () => {
      const code = getCodeFromUrl();
      console.log('=== DEBUG: Auth Started ===');
      console.log('Code from URL:', code);
      console.log('Current URL:', window.location.href);
      console.log('Stored store_id:', getStoredStoreId());
      console.log('Stored id_token exists:', !!localStorage.getItem('id_token'));
      console.log('==========================');

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
    if (!showPreview && userId && !subdomain) {
      const fetchedSubdomain = await getSubdomain(userId);
      setSubdomain(fetchedSubdomain);
    }
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={handlePreviewToggle}
          className="px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {showPreview ? (
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
        <div className={`flex-1 ${showPreview ? 'block' : 'hidden'} md:block`}>
          <Preview sectionData={sectionData} isAuthenticated={!!userId} subdomain={subdomain} />
        </div>
        <div className={`w-full md:w-[500px] ${showPreview ? 'hidden' : 'block'} md:block`}>
          <Editor
            userId={userId}
            sectionData={sectionData}
            onSectionChange={handleSectionChange}
            isAuthenticated={!!userId}
            isAuthenticating={isAuthenticating}
            onSubdomainFetched={handleSubdomainFetched}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
