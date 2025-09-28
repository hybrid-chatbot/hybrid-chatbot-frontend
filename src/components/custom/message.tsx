// ===== 메시지 컴포넌트 업데이트 =====
// 상품 시각화 기능을 위한 메시지 컴포넌트 확장
// 텍스트 메시지와 상품 카드를 통합 표시

import { motion } from 'framer-motion';
import { cx } from 'classix';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { message } from "../../interfaces/interfaces"
import { MessageActions } from '@/components/custom/actions';
import { ProductGrid } from './ProductGrid'; // 상품 그리드 컴포넌트 추가
import { AnalysisDisplay } from './analysis-display'; // 분석 정보 표시 컴포넌트 추가
import '@/styles/main.css';

interface PreviewMessageProps {
  message: message;
  isDemoMode?: boolean;
}

export const PreviewMessage = ({ message, isDemoMode = false }: PreviewMessageProps) => {
  return (
    <motion.div
      className="message fade-in"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div className="message-content">
        {message.role === 'assistant' && (
          <div className="bot-icon">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className="message-text">
          {/* ===== 텍스트 메시지 렌더링 ===== */}
          {message.content && (
            <div className="markdown">
              <Markdown>{message.content}</Markdown>
            </div>
          )}

          {/* ===== 상품 카드 렌더링 (새로 추가된 기능) ===== */}
          {/* 백엔드에서 전송된 상품 데이터가 있을 때만 표시 */}
          {message.products && message.products.length > 0 && (
            <div className="mt-4">
              <ProductGrid 
                products={message.products} 
                title={message.messageType === 'shopping' ? '검색 결과' : 
                       message.messageType === 'recommendation' ? '추천 상품' : 
                       '상품 목록'}
              />
            </div>
          )}

          {/* ===== 분석 정보 표시 (시연 모드에서만) ===== */}
          {/* 시연 모드이고 분석 정보가 있을 때만 표시 */}
          {isDemoMode && message.role === 'assistant' && message.analysisInfo && message.analysisTrace && (
            <AnalysisDisplay 
              analysisInfo={message.analysisInfo} 
              analysisTrace={message.analysisTrace} 
            />
          )}

          {/* ===== 메시지 액션 버튼들 ===== */}
          {message.role === 'assistant' && (
            <MessageActions message={message} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          'group-data-[role=user]/message:bg-muted'
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>
      </div>
    </motion.div>
  );
};
