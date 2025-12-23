import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { menuData } from '../data/content';
import type { MenuItem as MenuItemType } from '../data/types';
import Lightbox from './Lightbox';

function MenuItem({ item, index, onImageClick }: { item: MenuItemType; index: number; onImageClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group"
    >
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative overflow-hidden h-56 cursor-pointer" onClick={onImageClick} style={{ pointerEvents: 'auto' }}>
          <motion.img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover pointer-events-none"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 pointer-events-none" />
          <motion.div
            className="absolute top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg pointer-events-none"
            style={{ transform: 'translateZ(50px)' }}
          >
            {item.price}
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Menu() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : menuData.items.length - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev < menuData.items.length - 1 ? prev + 1 : 0));
  };

  const lightboxImages = menuData.items.map((item) => ({
    src: item.image,
    alt: item.name,
  }));

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{menuData.sectionTitle}</h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700">{menuData.sectionSubtitle}</p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuData.items.map((item, index) => (
            <MenuItem key={index} item={item} index={index} onImageClick={() => openLightbox(index)} />
          ))}
        </div>

        <div className="md:hidden -mx-4">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4"
          >
            {menuData.items.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[85vw] snap-center">
                <MenuItem item={item} index={index} onImageClick={() => openLightbox(index)} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {menuData.items.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-teal-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`メニュー ${index + 1} を表示`}
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
