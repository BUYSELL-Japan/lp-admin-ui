import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Lightbox from './Lightbox';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

interface GalleryProps {
  data: any;
}

// 常に「すべて」カテゴリーを示す定数
const ALL_CATEGORY = '__ALL__';

export default function Gallery({ data }: GalleryProps) {
  const { currentLang } = useLanguage();
  const categories = data?.categories || [];

  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = data?.images || [];
  const sectionTitle = getText(data?.sectionTitle, currentLang);
  const sectionSubtitle = getText(data?.sectionSubtitle, currentLang);

  // 言語切替時に「すべて」に戻す
  useEffect(() => {
    setSelectedCategory(ALL_CATEGORY);
  }, [currentLang]);

  const filteredImages = selectedCategory === ALL_CATEGORY
    ? images
    : images.filter((img: any) => getText(img.category, currentLang) === selectedCategory);

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

  useEffect(() => {
    setCurrentIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0 });
    }
  }, [selectedCategory]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth * 0.85 + 16;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  const lightboxImages = filteredImages.map((img: any) => {
    const url = typeof img.url === 'string' ? img.url : (img.url as any)?.[currentLang] || (img.url as any)?.ja || '';
    const caption = getText(img.caption, currentLang);
    return {
      src: url,
      alt: caption,
    };
  });

  return (
    <section id="gallery" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category: any, index: number) => {
            const categoryLabel = getText(category, currentLang);
            // 最初のカテゴリーは「すべて」として扱う
            const categoryValue = index === 0 ? ALL_CATEGORY : categoryLabel;
            const isSelected = selectedCategory === categoryValue;

            return (
              <motion.button
                key={categoryLabel}
                onClick={() => setSelectedCategory(categoryValue)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {categoryLabel}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          layout
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((image: any, index: number) => {
            const url = typeof image.url === 'string' ? image.url : (image.url as any)?.[currentLang] || (image.url as any)?.ja || '';
            const caption = getText(image.caption, currentLang);
            const category = getText(image.category, currentLang);
            return (
              <motion.div
                key={`${url}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <img
                    src={url}
                    alt={caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white text-lg font-bold">{caption}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-teal-600 text-white text-sm rounded-full">
                        {category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="md:hidden -mx-4">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4"
          >
            {filteredImages.map((image: any, index: number) => {
              const url = typeof image.url === 'string' ? image.url : (image.url as any)?.[currentLang] || (image.url as any)?.ja || '';
              const caption = getText(image.caption, currentLang);
              const category = getText(image.category, currentLang);
              return (
                <motion.div
                  key={`${url}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className="flex-shrink-0 w-[85vw] snap-center"
                >
                  <div className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                      <img
                        src={url}
                        alt={caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white text-lg font-bold">{caption}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-teal-600 text-white text-sm rounded-full">
                            {category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {filteredImages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-teal-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`画像 ${index + 1} を表示`}
              />
            ))}
          </div>
        </div>

        {lightboxOpen && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        )}
      </div>
    </section>
  );
}
