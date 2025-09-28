import { motion } from 'framer-motion';
import { MessageCircle, BotIcon, ShoppingBag } from 'lucide-react';
import '@/styles/main.css';

interface OverviewProps {
  chatMode?: 'cs' | 'product_search';
}

export const Overview = ({ chatMode = 'cs' }: OverviewProps) => {
  const isProductMode = chatMode === 'product_search';
  
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
          {isProductMode ? (
            <ShoppingBag size={44}/>
          ) : (
            <MessageCircle size={44}/>
          )}
        </p>
        <p>
          <strong>
            {isProductMode ? '상품 검색 챗봇' : '한신몰 챗봇'}
          </strong><br />
          <strong>
            {isProductMode 
              ? '원하는 상품을 찾아보세요.' 
              : '궁금하신 걸 물어보세요.'
            }
          </strong>
        </p>
      </div>
    </motion.div>
  );
};
