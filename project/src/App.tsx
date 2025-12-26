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

      if (code) {
        clearAuthData();

        try {
          const tokens = await exchangeCodeForTokens(code);
          const storeId = getStoreIdFromToken(tokens.id_token);

          if (storeId) {
            storeAuthData(tokens, storeId);
            setUserId(storeId);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('Unable to get store_id from token');
            clearAuthData();
          }
        } catch (error) {
          console.error('Authentication error:', error);
          clearAuthData();
        }
      } else {
        const storedStoreId = getStoredStoreId();
        if (storedStoreId) {
          const idToken = localStorage.getItem('id_token');
          if (idToken) {
            const validStoreId = getStoreIdFromToken(idToken);
            if (validStoreId === storedStoreId) {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowPreview(!showPreview)}
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
          <Preview sectionData={sectionData} isAuthenticated={!!userId} />
        </div>
        <div className={`w-full md:w-[500px] ${showPreview ? 'hidden' : 'block'} md:block`}>
          <Editor
            userId={userId}
            sectionData={sectionData}
            onSectionChange={handleSectionChange}
            isAuthenticated={!!userId}
            isAuthenticating={isAuthenticating}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
