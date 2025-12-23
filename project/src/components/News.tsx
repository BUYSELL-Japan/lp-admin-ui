import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import { newsData } from '../data/content';

export default function News() {
  return (
    <section id="news" className="py-24 px-4 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {newsData.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700">{newsData.sectionSubtitle}</p>
        </motion.div>

        <div className="space-y-6">
          {newsData.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ x: 10, scale: 1.01 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.date}</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600 text-white text-xs rounded-full mt-1">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
