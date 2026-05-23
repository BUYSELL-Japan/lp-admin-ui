import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { clearAuthData, getUserEmail } from '../services/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';
import LanguageSelector from './LanguageSelector';

const LOGIN_URL = 'https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/login?client_id=12nf22nqg8mpcq1q77nm5uqbls&response_type=code&scope=email+openid+profile&redirect_uri=https%3A%2F%2Fadmin-lp.neural-seeds.com';

interface HeaderProps {
  data: any;
  isAuthenticated?: boolean;
}

export default function Header({ data, isAuthenticated = false }: HeaderProps) {
  const { currentLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userEmail = getUserEmail();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    window.location.reload();
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              className="flex items-center gap-2 cursor-pointer z-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Waves className={`w-8 h-8 ${scrolled || mobileMenuOpen ? 'text-teal-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'}`}>
                {getText(data?.logo?.text, currentLang)}
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6">
              {(data?.navigation || []).map((item: any) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-base font-medium transition-colors whitespace-nowrap ${
                    scrolled
                      ? 'text-gray-700 hover:text-teal-600'
                      : 'text-white hover:text-teal-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {getText(item.label, currentLang)}
                </motion.button>
              ))}
              <div className={scrolled ? 'text-gray-700' : 'text-white'}>
                <LanguageSelector />
              </div>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    scrolled
                      ? 'text-gray-700'
                      : 'text-white'
                  }`}>
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{userEmail}</span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      scrolled
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    {getText(data?.logoutButton, currentLang)}
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={LOGIN_URL}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      scrolled
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    {getText(data?.loginButton, currentLang)}
                  </a>
                </motion.div>
              )}
            </nav>

            <motion.button
              className={`md:hidden z-50 p-2 ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              className="fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl z-40 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="px-4 py-6 space-y-1">
                {(data?.navigation || []).map((item: any, index: number) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getText(item.label, currentLang)}
                  </motion.button>
                ))}
                {isAuthenticated ? (
                  <>
                    <motion.div
                      className="flex items-center justify-center gap-2 w-full px-4 py-4 mt-4 bg-gray-100 text-gray-900 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (data?.navigation || []).length * 0.05 }}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">{userEmail}</span>
                    </motion.div>
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full px-4 py-4 mt-2 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: ((data?.navigation || []).length + 1) * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-5 h-5" />
                      {getText(data?.logoutButton, currentLang)}
                    </motion.button>
                  </>
                ) : (
                  <motion.a
                    href={LOGIN_URL}
                    className="flex items-center justify-center gap-2 w-full px-4 py-4 mt-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (data?.navigation || []).length * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogIn className="w-5 h-5" />
                    {getText(data?.loginButton, currentLang)}
                  </motion.a>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
