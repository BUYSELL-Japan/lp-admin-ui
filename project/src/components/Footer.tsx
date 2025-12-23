import { motion } from 'framer-motion';
import { Waves, Facebook, Instagram, Twitter } from 'lucide-react';
import { footerData } from '../data/content';

const socialIconMap = {
  Facebook,
  Instagram,
  Twitter,
};

export default function Footer() {
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
              <span className="text-2xl font-bold">{footerData.logo}</span>
            </div>
            <p className="text-teal-200 leading-relaxed">
              {footerData.description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < footerData.description.split('\n').length - 1 && <br />}
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
            <h3 className="text-xl font-bold mb-4">{footerData.businessHours.title}</h3>
            <p className="text-teal-200">{footerData.businessHours.days}</p>
            <p className="text-teal-200">{footerData.businessHours.hours}</p>
            <p className="text-teal-200 text-sm mt-2">{footerData.businessHours.closedDay}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">{footerData.social.title}</h3>
            <div className="flex gap-4">
              {footerData.social.links.map((social, index) => {
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
          <p className="text-teal-300">&copy; {currentYear} {footerData.copyright}</p>
        </motion.div>
      </div>
    </footer>
  );
}
