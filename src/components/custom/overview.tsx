import { motion } from 'framer-motion';
import { MessageCircle, BotIcon } from 'lucide-react';
import '@/styles/main.css';

export const Overview = () => {
  return (
    <motion.div
      className="overview"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.75 }}
    >
      <div className="overview-content">
        <p className="icon-container">
          <BotIcon size={44}/>
          <span>+</span>
          <MessageCircle size={44}/>
        </p>
        <p>
          <strong>한신몰 챗봇</strong><br />
          <strong>궁금하신 걸 물어보세요.</strong>.
        </p>
      </div>
    </motion.div>
  );
};
