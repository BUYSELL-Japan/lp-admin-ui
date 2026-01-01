import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getText } from '../utils/i18n';

interface StaffProps {
  data: any;
}

export default function Staff({ data }: StaffProps) {
  const { currentLang } = useLanguage();
  const sectionTitle = getText(data?.sectionTitle, currentLang);
  const sectionSubtitle = getText(data?.sectionSubtitle, currentLang);
  const members = data?.members || [];

  return (
    <section id="staff" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member: any, index: number) => {
            const name = getText(member.name, currentLang);
            const role = getText(member.role, currentLang);
            const description = getText(member.description, currentLang);
            const image = typeof member.image === 'string' ? member.image : member.image?.ja || '';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <motion.img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
                  <p className="text-teal-600 font-medium mb-3">{role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
