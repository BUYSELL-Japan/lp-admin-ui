import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { aboutData } from '../data/content';
import type { AboutFeature } from '../data/types';

function FeatureCard({ feature, index }: { feature: AboutFeature; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 mb-24`}
    >
      <motion.div
        className="w-full md:w-1/2"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <motion.img
            src={feature.image}
            alt={feature.title}
            className="w-full h-80 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      <div className="w-full md:w-1/2 space-y-4">
        <motion.h3
          className="text-3xl md:text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -20 : 20 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p
          className="text-lg text-gray-700 leading-relaxed"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -20 : 20 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
        >
          {feature.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {aboutData.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto" />
        </motion.div>

        <div>
          {aboutData.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
