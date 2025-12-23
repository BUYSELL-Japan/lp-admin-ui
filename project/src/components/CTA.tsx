import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { ctaData } from '../data/content';

export default function CTA() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ctaData.backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 to-teal-800/90" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {ctaData.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6" />
          <p className="text-xl text-white/90 mb-3">
            {ctaData.sectionSubtitle}
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {ctaData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaData.buttons.map((button, index) => (
              <motion.a
                key={index}
                href={button.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg ${
                  button.type === 'primary'
                    ? 'bg-white text-teal-900 hover:bg-gray-100'
                    : 'bg-transparent text-white border-2 border-white hover:bg-white/10'
                }`}
              >
                {button.type === 'primary' ? (
                  <Phone className="w-5 h-5" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                {button.text}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
