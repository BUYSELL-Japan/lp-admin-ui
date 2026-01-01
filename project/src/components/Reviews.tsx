import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

interface ReviewsProps {
  data: any;
}

export default function Reviews({ data }: ReviewsProps) {
  const { currentLang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionTitle = getText(data?.sectionTitle, currentLang);
  const sectionSubtitle = getText(data?.sectionSubtitle, currentLang);
  const reviews = data?.reviews || [];

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(index);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="reviews" className="py-24 px-4 bg-gradient-to-b from-white to-amber-50/30">
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

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review: any, index: number) => {
            const name = getText(review.name, currentLang);
            const comment = getText(review.comment, currentLang);
            const avatar = typeof review.avatar === 'string' ? review.avatar : review.avatar?.ja || '';
            const date = typeof review.date === 'string' ? review.date : review.date?.ja || '';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500">{date}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">{comment}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="md:hidden -mx-4">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4"
          >
            {reviews.map((review: any, index: number) => {
              const name = getText(review.name, currentLang);
              const comment = getText(review.comment, currentLang);
              const avatar = typeof review.avatar === 'string' ? review.avatar : review.avatar?.ja || '';
              const date = typeof review.date === 'string' ? review.date : review.date?.ja || '';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[85vw] snap-center"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-500">{date}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed">{comment}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-teal-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${currentLang === 'ja' ? 'レビュー' : 'Review'} ${index + 1} ${currentLang === 'ja' ? 'を表示' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
