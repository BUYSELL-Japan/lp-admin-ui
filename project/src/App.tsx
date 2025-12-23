import { useState, useEffect } from 'react';
import { Eye, Edit } from 'lucide-react';
import Header from './components/Header';
import Preview from './components/Preview';
import Editor from './components/Editor';
import { fetchSiteData } from './services/api';
import {
  exchangeCodeForTokens,
  getStoreIdFromToken,
  getCodeFromUrl,
  storeAuthData,
  getStoredStoreId,
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
        try {
          const tokens = await exchangeCodeForTokens(code);
          const storeId = getStoreIdFromToken(tokens.id_token);

          if (storeId) {
            storeAuthData(tokens, storeId);
            setUserId(storeId);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('store_id not found in token');
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }
      } else {
        const storedStoreId = getStoredStoreId();
        if (storedStoreId) {
          setUserId(storedStoreId);
        }
      }

      setIsAuthenticating(false);
    };

    handleAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      const data = await fetchSiteData(userId);
      if (data) {
        setSectionData({
          header: data.header || headerData,
          hero: data.hero || heroData,
          about: data.about || aboutData,
          menu: data.menu || menuData,
          pricing: data.pricing || pricingData,
          cta: data.cta || ctaData,
          gallery: data.gallery || galleryData,
          staff: data.staff || staffData,
          reviews: data.reviews || reviewsData,
          news: data.news || newsData,
          storeInfo: data.storeInfo || storeInfoData,
          company: data.company || companyData,
          access: data.access || accessData,
          faq: data.faq || faqData,
          contact: data.contact || contactData,
          footer: data.footer || footerData,
        });
      }
    };
    loadData();
  }, [userId]);

  const handleSectionChange = (section: string, data: any) => {
    setSectionData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

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

      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <div className={`flex-1 ${showPreview ? 'block' : 'hidden'} md:block`}>
          <Preview sectionData={sectionData} />
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
