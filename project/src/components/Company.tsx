import { motion } from 'framer-motion';
import { Building2, History, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

interface CompanyProps {
  data: any;
}

export default function Company({ data }: CompanyProps) {
  const { currentLang } = useLanguage();
  const sectionTitle = getText(data?.sectionTitle, currentLang);
  const sectionSubtitle = getText(data?.sectionSubtitle, currentLang);

  const philosophyTitle = getText(data?.philosophy?.title, currentLang);
  const philosophyContent = getText(data?.philosophy?.content, currentLang);

  const historyTitle = getText(data?.history?.title, currentLang);
  const timeline = data?.history?.timeline || [];

  const companyInfoTitle = getText(data?.companyInfo?.title, currentLang);
  const companyInfoItems = data?.companyInfo?.items || [];

  return (
    <section id="company" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700">{sectionSubtitle}</p>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-teal-100 p-4 rounded-2xl">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {philosophyTitle}
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {philosophyContent}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-teal-100 p-4 rounded-2xl">
                <History className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {historyTitle}
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-teal-200" />
              <div className="space-y-6">
                {timeline.map((item: any, index: number) => {
                  const year = typeof item.year === 'string' ? item.year : item.year?.ja || '';
                  const event = getText(item.event, currentLang);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-0 top-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                        <div className="font-bold text-teal-600 text-lg mb-1">
                          {year}
                        </div>
                        <div className="text-gray-700">{event}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-teal-100 p-4 rounded-2xl">
                <Building2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {companyInfoTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyInfoItems.map((item: any, index: number) => {
                const label = getText(item.label, currentLang);
                const value = getText(item.value, currentLang);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex flex-col md:flex-row md:items-start gap-2"
                  >
                    <div className="font-bold text-teal-600 min-w-[120px]">
                      {label}
                    </div>
                    <div className="text-gray-700 flex-1">{value}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
