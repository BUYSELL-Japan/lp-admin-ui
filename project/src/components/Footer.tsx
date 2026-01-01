import { motion } from 'framer-motion';
import { Waves, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

const socialIconMap = {
  Facebook,
  Instagram,
  Twitter,
};

interface FooterProps {
  data: any;
}

export default function Footer({ data }: FooterProps) {
  const { currentLang } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-teal-900 to-teal-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <motion.path
            d="M0,50 C300,80 400,20 600,50 C800,80 900,20 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
            animate={{
              d: [
                "M0,50 C300,80 400,20 600,50 C800,80 900,20 1200,50 L1200,120 L0,120 Z",
                "M0,50 C300,20 400,80 600,50 C800,20 900,80 1200,50 L1200,120 L0,120 Z",
                "M0,50 C300,80 400,20 600,50 C800,80 900,20 1200,50 L1200,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-8 h-8" />
              <span className="text-2xl font-bold">{getText(data?.logo, currentLang)}</span>
            </div>
            <p className="text-teal-200 leading-relaxed">
              {getText(data?.description, currentLang).split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < getText(data?.description, currentLang).split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4">{getText(data?.businessHours?.title, currentLang)}</h3>
            <p className="text-teal-200">{getText(data?.businessHours?.days, currentLang)}</p>
            <p className="text-teal-200">{getText(data?.businessHours?.hours, currentLang)}</p>
            <p className="text-teal-200 text-sm mt-2">{getText(data?.businessHours?.closedDay, currentLang)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">{getText(data?.social?.title, currentLang)}</h3>
            <div className="flex gap-4">
              {(data?.social?.links || []).map((social: any, index: number) => {
                const IconComponent = socialIconMap[social.platform as keyof typeof socialIconMap];
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    className="bg-teal-800 p-3 rounded-full hover:bg-teal-700 transition-colors"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-teal-800 pt-8 text-center"
        >
          <p className="text-teal-300">&copy; {currentYear} {getText(data?.copyright, currentLang)}</p>
        </motion.div>
      </div>
    </footer>
  );
}
