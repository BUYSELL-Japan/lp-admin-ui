import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

const iconMap = {
  MapPin,
  Clock,
  Phone,
  Mail,
};

interface StoreInfoProps {
  data: any;
}

export default function StoreInfo({ data }: StoreInfoProps) {
  const { currentLang } = useLanguage();
  const sectionTitle = getText(data?.sectionTitle, currentLang);
  const items = data?.items || [];
  const mainImage = typeof data?.mainImage === 'string' ? data.mainImage : data?.mainImage?.ja || '';
  const mainImageCaption = getText(data?.mainImageCaption, currentLang);

  return (
    <section id="store" className="py-24 px-4 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{sectionTitle}</h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {items.map((item: any, index: number) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            const title = getText(item.title, currentLang);
            const content = getText(item.content, currentLang);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-teal-100 p-3 rounded-xl"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-700 leading-relaxed">{content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="aspect-video bg-gray-200 relative">
            <img
              src={mainImage}
              alt={mainImageCaption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-2xl font-bold">{mainImageCaption}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
