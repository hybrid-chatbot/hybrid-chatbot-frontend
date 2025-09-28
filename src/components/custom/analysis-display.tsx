import React from 'react';
import { AnalysisInfo, AnalysisTrace } from '../../interfaces/interfaces';
import { Card } from '../ui/card';

interface AnalysisDisplayProps {
  analysisInfo: AnalysisInfo;
  analysisTrace: AnalysisTrace;
}

export function AnalysisDisplay({ analysisInfo, analysisTrace }: AnalysisDisplayProps) {
  const getScoreColor = (score: number | null | undefined) => {
    if (score == null) return 'text-gray-600';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number | null | undefined) => {
    if (score == null) return 'bg-gray-500';
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEngineIcon = (engine: string | null | undefined) => {
    if (!engine) return '⚙️';
    switch (engine.toLowerCase()) {
      case 'dialogflow':
        return '🤖';
      case 'rag':
        return '📚';
      case 'similarity':
        return '🔍';
      default:
        return '⚙️';
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* 분석 정보 카드 */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{getEngineIcon(analysisInfo?.engine)}</span>
          <h3 className="font-semibold text-blue-800">분석 정보</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">엔진:</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {analysisInfo?.engine || '알 수 없음'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">인텐트:</span>
            <span className="ml-2 font-medium">{analysisInfo?.intentName || '알 수 없음'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">원본 인텐트:</span>
            <span className="ml-2">{analysisInfo?.originalIntentName || '알 수 없음'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">신뢰도:</span>
            <div className="ml-2 flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBarColor(analysisInfo?.originalIntentScore)}`}
                  style={{ width: `${(analysisInfo?.originalIntentScore || 0) * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${getScoreColor(analysisInfo?.originalIntentScore)}`}>
                {((analysisInfo?.originalIntentScore || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 분석 추적 정보 카드 */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔍</span>
          <h3 className="font-semibold text-green-800">분석 추적</h3>
        </div>
        <div className="space-y-3">
          {/* Dialogflow 분석 */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center gap-2">
              <span className="text-sm">🤖</span>
              <span className="font-medium text-sm">Dialogflow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">{analysisTrace?.dialogflowIntent || '알 수 없음'}</span>
              <div className="w-12 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBarColor(analysisTrace?.dialogflowScore)}`}
                  style={{ width: `${(analysisTrace?.dialogflowScore || 0) * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${getScoreColor(analysisTrace?.dialogflowScore)}`}>
                {((analysisTrace?.dialogflowScore || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* 유사도 점수 */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔍</span>
              <span className="font-medium text-sm">유사도 검증</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBarColor(analysisTrace?.similarityScore)}`}
                  style={{ width: `${(analysisTrace?.similarityScore || 0) * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${getScoreColor(analysisTrace?.similarityScore)}`}>
                {((analysisTrace?.similarityScore || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* 안전망 판정 */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center gap-2">
              <span className="text-sm">🛡️</span>
              <span className="font-medium text-sm">안전망 판정</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              analysisTrace.safetyNetJudgement && analysisTrace.safetyNetJudgement.includes('통과') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {analysisTrace.safetyNetJudgement || '알 수 없음'}
            </span>
          </div>

          {/* RAG 정보 (있는 경우) */}
          {analysisTrace?.ragFinalIntent && (
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex items-center gap-2">
                <span className="text-sm">📚</span>
                <span className="font-medium text-sm">RAG 최종 인텐트</span>
              </div>
              <span className="text-xs text-gray-600">{analysisTrace.ragFinalIntent}</span>
            </div>
          )}

          {/* 최종 엔진 */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-medium text-sm">최종 엔진</span>
            </div>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {analysisTrace?.finalEngine || '알 수 없음'}
            </span>
          </div>
        </div>
      </Card>

      {/* 라우팅 과정 시각화 */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔄</span>
          <h3 className="font-semibold text-purple-800">라우팅 과정</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
              🤖
            </div>
            <span className="text-xs mt-1 text-center">Dialogflow<br/>분석</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm">
              🔍
            </div>
            <span className="text-xs mt-1 text-center">유사도<br/>검증</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
              🛡️
            </div>
            <span className="text-xs mt-1 text-center">안전망<br/>판정</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">
              ✅
            </div>
            <span className="text-xs mt-1 text-center">최종<br/>결과</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
