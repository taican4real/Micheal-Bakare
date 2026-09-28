import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppWidget() {
  // Replace with the actual WhatsApp Business number (include country code, omit + or 00)
  const phoneNumber = "1234567890"; 
  const message = encodeURIComponent("Hello! I'm interested in your professional services and would like to learn more.");
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end group"
    >
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-ink text-canvas p-4 rounded-full shadow-lg hover:bg-zinc-800 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-sm font-medium">
          Chat with us
        </span>
        <MessageCircle size={24} />
      </a>
    </motion.div>
  );
}
