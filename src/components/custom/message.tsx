import { motion } from 'framer-motion';
import { cx } from 'classix';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { message } from "../../interfaces/interfaces"
import { MessageActions } from '@/components/custom/actions';
import { RoutingVisualization } from './routing-visualization';
import '@/styles/main.css';

export const PreviewMessage = ({ message, isDemoMode = false }: { message: message; isDemoMode?: boolean; }) => {
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
          {message.content && (
            <div className="markdown">
              <Markdown>{message.content}</Markdown>
            </div>
          )}

          {/* 분석 정보 및 라우팅 시각화 - 시연용 모드일 때만 */}
          {isDemoMode && message.role === 'assistant' && message.analysisInfo && (
            <>
              {/* 기본 분석 정보 */}
              <div className="analysis-info" style={{ 
                marginTop: '8px', 
                padding: '8px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px', 
                fontSize: '12px',
                color: '#666'
              }}>
                <div><strong>엔진:</strong> {message.analysisInfo.engine}</div>
                <div><strong>인텐트:</strong> {message.analysisInfo.intentName}</div>
                <div><strong>신뢰도:</strong> {(message.analysisInfo.originalIntentScore * 100).toFixed(1)}%</div>
                {message.analysisTrace && (
                  <>
                    <div><strong>유사도 점수:</strong> {(message.analysisTrace.similarityScore * 100).toFixed(1)}%</div>
                    <div><strong>안전망 판정:</strong> {message.analysisTrace.safetyNetJudgement}</div>
                    <div><strong>최종 엔진:</strong> {message.analysisTrace.finalEngine}</div>
                  </>
                )}
              </div>

              {/* 라우팅 과정 시각화 */}
              {message.analysisTrace && (
                <RoutingVisualization message={message} />
              )}
            </>
          )}

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
