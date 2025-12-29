import { motion } from 'framer-motion';
import { Globe, Languages } from 'lucide-react';

export default function TranslationLoadingModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="relative"
            >
              <Globe size={64} className="text-blue-500" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Languages size={32} className="text-purple-600" />
            </motion.div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            翻訳処理中
          </h3>

          <p className="text-gray-600 mb-2">
            コンテンツを多言語に翻訳しています
          </p>

          <p className="text-sm text-amber-600 font-medium mb-6">
            処理には数分かかる場合があります
          </p>

          <div className="flex gap-2 justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0,
              }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2,
              }}
              className="w-3 h-3 bg-purple-500 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4,
              }}
              className="w-3 h-3 bg-pink-500 rounded-full"
            />
          </div>

          <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            このウィンドウは自動的に閉じます
          </p>
        </div>
      </motion.div>
    </div>
  );
}
