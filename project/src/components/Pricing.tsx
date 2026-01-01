import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

interface PricingProps {
  data: any;
}

export default function Pricing({ data }: PricingProps) {
  const { currentLang } = useLanguage();
  const sectionTitle = getText(data?.sectionTitle, currentLang);
  const sectionSubtitle = getText(data?.sectionSubtitle, currentLang);
  const note = getText(data?.note, currentLang);
  const plans = data?.plans || [];
  const popularLabel = getText(data?.popularLabel, currentLang);
  const taxIncluded = getText(data?.taxIncluded, currentLang);
  const ctaButton = getText(data?.ctaButton, currentLang);
  return (
    <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
                plan.isPopular ? 'ring-4 ring-teal-600' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-teal-600 text-white px-6 py-2 rounded-bl-2xl">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{popularLabel}</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {getText(plan.name, currentLang)}
                </h3>
                <p className="text-gray-600 text-sm mb-6 min-h-[40px]">
                  {getText(plan.description, currentLang)}
                </p>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-teal-600">
                    {getText(plan.price, currentLang)}
                  </div>
                  <div className="text-sm text-gray-500">{taxIncluded}</div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <ul className="space-y-3">
                    {(plan.features || []).map((feature: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{getText(feature, currentLang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-8 pb-8">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full text-center px-6 py-3 rounded-xl font-bold transition-all ${
                    plan.isPopular
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {ctaButton}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {note && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-sm text-gray-600"
          >
            {note}
          </motion.div>
        )}
      </div>
    </section>
  );
}
