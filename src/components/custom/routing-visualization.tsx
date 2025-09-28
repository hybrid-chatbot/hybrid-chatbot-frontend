import { motion } from 'framer-motion';
import { message } from '../../interfaces/interfaces';

interface RoutingVisualizationProps {
  message: message;
}

export const RoutingVisualization = ({ message }: RoutingVisualizationProps) => {
  if (!message.analysisTrace) return null;

  const { analysisTrace, analysisInfo } = message;
  
  // 라우팅 단계 정의
  const routingSteps = [
    {
      id: 'dialogflow',
      name: 'Dialogflow',
      status: 'completed',
      score: analysisTrace.dialogflowScore,
      intent: analysisTrace.dialogflowIntent,
      color: '#3b82f6'
    },
    {
      id: 'similarity',
      name: '유사도 검증',
      status: analysisTrace.similarityScore > 0.7 ? 'completed' : 'warning',
      score: analysisTrace.similarityScore,
      intent: null,
      color: analysisTrace.similarityScore > 0.7 ? '#10b981' : '#f59e0b'
    },
    {
      id: 'safety',
      name: '안전망',
      status: analysisTrace.safetyNetJudgement === '유사도 검증 통과' ? 'completed' : 'warning',
      score: null,
      intent: analysisTrace.safetyNetJudgement,
      color: analysisTrace.safetyNetJudgement === '유사도 검증 통과' ? '#10b981' : '#ef4444'
    },
    {
      id: 'final',
      name: '최종 엔진',
      status: 'completed',
      score: null,
      intent: analysisTrace.finalEngine,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="routing-visualization" style={{
      marginTop: '12px',
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#374151'
      }}>
        🚀 라우팅 과정
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {routingSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: `2px solid ${step.color}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {/* 단계 아이콘 */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: step.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              marginRight: '12px'
            }}>
              {step.status === 'completed' ? '✓' : step.status === 'warning' ? '⚠' : '○'}
            </div>

            {/* 단계 정보 */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '2px'
              }}>
                {step.name}
              </div>
              
              {step.intent && (
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  marginBottom: '2px'
                }}>
                  {step.intent}
                </div>
              )}
              
              {step.score !== null && (
                <div style={{
                  fontSize: '11px',
                  color: step.color,
                  fontWeight: 'bold'
                }}>
                  점수: {(step.score * 100).toFixed(1)}%
                </div>
              )}
            </div>

            {/* 화살표 (마지막 단계 제외) */}
            {index < routingSteps.length - 1 && (
              <div style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginLeft: '8px'
              }}>
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 최종 결과 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#ecfdf5',
          borderRadius: '6px',
          border: '1px solid #d1fae5'
        }}
      >
        <div style={{
          fontSize: '12px',
          color: '#065f46',
          fontWeight: 'bold'
        }}>
          🎯 최종 결과: {analysisTrace.finalEngine} 엔진 사용
        </div>
        <div style={{
          fontSize: '11px',
          color: '#047857',
          marginTop: '2px'
        }}>
          인텐트: {analysisInfo?.intentName} | 신뢰도: {(analysisInfo?.originalIntentScore || 0 * 100).toFixed(1)}%
        </div>
      </motion.div>
    </div>
  );
};

