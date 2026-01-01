import { motion } from 'framer-motion';
import { MapPin, Car, Train } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

interface AccessProps {
  data: any;
}

export default function Access({ data }: AccessProps) {
  const { currentLang } = useLanguage();
  return (
    <section id="access" className="py-24 px-4 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getText(data?.sectionTitle, currentLang)}
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700">{getText(data?.sectionSubtitle, currentLang)}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-teal-100 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{getText(data?.addressLabel, currentLang)}</h3>
                <p className="text-gray-700 text-lg">{getText(data?.address, currentLang)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <Car className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {getText(data?.parking?.title, currentLang)}
                  </h3>
                  <p className="text-gray-700 mb-2">{getText(data?.parking?.description, currentLang)}</p>
                  <p className="text-teal-600 font-bold text-lg mb-2">
                    {getText(data?.parking?.spacesLabel, currentLang)}: {getText(data?.parking?.spaces, currentLang)}
                  </p>
                  <p className="text-sm text-gray-600">{getText(data?.parking?.notes, currentLang)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <Train className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {getText(data?.transportation?.title, currentLang)}
                  </h3>
                  <div className="space-y-3">
                    {(data?.transportation?.methods || []).map((method: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-gray-900">{getText(method.type, currentLang)}:</span>
                          <span className="text-gray-700 ml-2">{getText(method.description, currentLang)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="aspect-square bg-gray-200">
              <iframe
                src={typeof data?.mapEmbedUrl === 'string' ? data.mapEmbedUrl : data?.mapEmbedUrl?.ja || ''}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={getText(data?.mapTitle, currentLang)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
