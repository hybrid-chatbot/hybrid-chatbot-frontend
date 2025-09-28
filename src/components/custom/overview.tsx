import { motion } from 'framer-motion';
import { MessageCircle, BotIcon, ShoppingBag } from 'lucide-react';
import '@/styles/main.css';

interface OverviewProps {
  chatMode?: 'cs' | 'product_search';
}

export const Overview = ({ chatMode = 'cs' }: OverviewProps) => {
  const isProductSearch = chatMode === 'product_search';
  
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
          {isProductSearch ? (
            <ShoppingBag size={44}/>
          ) : (
            <MessageCircle size={44}/>
          )}
        </p>
        <p>
          <strong>한신몰 챗봇</strong><br />
          {isProductSearch ? (
            <>
              <strong>원하는 상품을 검색해보세요!</strong><br />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                예: 청바지, 운동화, 스마트폰 등
              </span>
            </>
          ) : (
            <strong>궁금하신 걸 물어보세요.</strong>
          )}
        </p>
      </div>
    </motion.div>
  );
};
