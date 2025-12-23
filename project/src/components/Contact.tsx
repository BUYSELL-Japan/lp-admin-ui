import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { contactData } from '../data/content';

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {contactData.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700">
            {contactData.sectionSubtitle}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.name}
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-600 focus:outline-none transition-colors"
                animate={{
                  scale: focused === 'name' ? 1.02 : 1,
                  borderColor: focused === 'name' ? '#0d9488' : '#e5e7eb',
                }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.email}
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-600 focus:outline-none transition-colors"
                animate={{
                  scale: focused === 'email' ? 1.02 : 1,
                  borderColor: focused === 'email' ? '#0d9488' : '#e5e7eb',
                }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.subject}
              </label>
              <motion.input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocused('subject')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-600 focus:outline-none transition-colors"
                animate={{
                  scale: focused === 'subject' ? 1.02 : 1,
                  borderColor: focused === 'subject' ? '#0d9488' : '#e5e7eb',
                }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.message}
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-600 focus:outline-none transition-colors resize-none"
                animate={{
                  scale: focused === 'message' ? 1.02 : 1,
                  borderColor: focused === 'message' ? '#0d9488' : '#e5e7eb',
                }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-teal-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Send className="w-5 h-5" />
              {contactData.submitButton}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
