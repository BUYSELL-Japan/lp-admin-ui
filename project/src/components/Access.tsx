import { motion } from 'framer-motion';
import { MapPin, Car, Train } from 'lucide-react';
import { accessData } from '../data/content';

export default function Access() {
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
            {accessData.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700">{accessData.sectionSubtitle}</p>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">住所</h3>
                <p className="text-gray-700 text-lg">{accessData.address}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <Car className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {accessData.parking.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{accessData.parking.description}</p>
                  <p className="text-teal-600 font-bold text-lg mb-2">
                    駐車可能台数: {accessData.parking.spaces}
                  </p>
                  <p className="text-sm text-gray-600">{accessData.parking.notes}</p>
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
                    {accessData.transportation.title}
                  </h3>
                  <div className="space-y-3">
                    {accessData.transportation.methods.map((method, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-gray-900">{method.type}:</span>
                          <span className="text-gray-700 ml-2">{method.description}</span>
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
                src={accessData.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="店舗地図"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
