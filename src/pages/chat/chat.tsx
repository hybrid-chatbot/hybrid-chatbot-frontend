import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState, useEffect } from "react";
import { message, BackendResponse } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import { DebugPanel } from "@/components/custom/debug-panel";
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import '@/styles/main.css';

// 1. API 주소를 역할에 맞게 두 개로 나눕니다.
const SEND_API_URL = "http://localhost:8080/api/messages/receive"; 
const RESULT_API_URL = "http://localhost:8080/api/messages/result"; 

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([
    // 예시 상품 데이터가 포함된 초기 메시지
    {
      content: "안녕하세요! 쇼핑 도우미입니다. 어떤 상품을 찾고 계신가요?",
      role: "assistant",
      id: "welcome-message",
      products: [
        {
          id: 1,
          title: "Apple iPhone 15 Pro 128GB 자연티타늄",
          image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
          link: "https://www.apple.com/kr/iphone-15-pro/",
          lprice: 1350000,
          hprice: 1500000,
          mallName: "Apple Store",
          brand: "Apple",
          category1: "디지털/가전",
          category2: "스마트폰",
          productType: "스마트폰",
          maker: "Apple",
          searchCount: 1250,
          lastSearchedAt: "2024-01-15T10:30:00Z",
          priceFormatted: "1,350,000원",
          discountRate: "10%",
          isRecommended: true,
          recommendationReason: "최신 모델, 고성능"
        },
        {
          id: 2,
          title: "Samsung Galaxy S24 Ultra 256GB 티타늄 그레이",
          image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
          link: "https://www.samsung.com/kr/smartphones/galaxy-s24-ultra/",
          lprice: 1200000,
          hprice: 1350000,
          mallName: "Samsung",
          brand: "Samsung",
          category1: "디지털/가전",
          category2: "스마트폰",
          productType: "스마트폰",
          maker: "Samsung",
          searchCount: 980,
          lastSearchedAt: "2024-01-14T15:20:00Z",
          priceFormatted: "1,200,000원",
          discountRate: "5%",
          isRecommended: false,
          recommendationReason: ""
        },
        {
          id: 3,
          title: "MacBook Pro 14인치 M3 Pro 칩 512GB 스페이스 그레이",
          image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
          link: "https://www.apple.com/kr/macbook-pro-14/",
          lprice: 2500000,
          hprice: 2800000,
          mallName: "Apple Store",
          brand: "Apple",
          category1: "디지털/가전",
          category2: "노트북",
          productType: "노트북",
          maker: "Apple",
          searchCount: 750,
          lastSearchedAt: "2024-01-13T09:15:00Z",
          priceFormatted: "2,500,000원",
          discountRate: "15%",
          isRecommended: true,
          recommendationReason: "프리미엄 성능"
        },
        {
          id: 4,
          title: "Sony WH-1000XM5 무선 노이즈 캔슬링 헤드폰",
          image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
          link: "https://www.sony.co.kr/electronics/headphones/wh-1000xm5",
          lprice: 450000,
          hprice: 500000,
          mallName: "Sony",
          brand: "Sony",
          category1: "디지털/가전",
          category2: "오디오",
          productType: "헤드폰",
          maker: "Sony",
          searchCount: 320,
          lastSearchedAt: "2024-01-12T14:45:00Z",
          priceFormatted: "450,000원",
          discountRate: "8%",
          isRecommended: false,
          recommendationReason: ""
        }
      ],
      messageType: "recommendation"
    }
  ]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [chatMode, setChatMode] = useState<'cs' | 'product_search'>('cs');
  const [showAnalysis, setShowAnalysis] = useState<boolean>(true);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

  // 디버그 로그 추가 함수
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev.slice(-49), logMessage]); // 최대 50개 로그 유지
  };

  // 디버그 로그 초기화 함수
  const clearDebugLogs = () => {
    setDebugLogs([]);
  };

  // 개발 환경에서만 디버그 패널 표시
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setShowDebugPanel(true);
    }
  }, []);

  // 전역 에러 핸들러 추가
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      addDebugLog(`[GLOBAL ERROR] ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
      console.error('Global error:', event);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addDebugLog(`[UNHANDLED REJECTION] ${event.reason}`);
      console.error('Unhandled promise rejection:', event);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [addDebugLog]);

  // 2. 결과를 주기적으로 확인하는 새로운 함수를 만듭니다.
  const pollForResult = (sessionId: string) => {
    const maxRetries = 15; // 최대 15번 (30초) 시도
    let retries = 0;

    addDebugLog(`[POLLING] 폴링 시작 - sessionId: ${sessionId}, maxRetries: ${maxRetries}`);

    const intervalId = setInterval(async () => {
      addDebugLog(`[POLLING] 시도 ${retries + 1}/${maxRetries} - ${RESULT_API_URL}/${sessionId}`);
      
      if (retries >= maxRetries) {
        addDebugLog(`[POLLING] 최대 재시도 횟수 초과 - sessionId: ${sessionId}`);
        clearInterval(intervalId);
        
        // 타임아웃 에러 메시지 추가
        const timeoutMessage: message = {
          content: "죄송합니다. 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
          role: "assistant",
          id: `timeout-${sessionId}`,
          sessionId: sessionId,
          userId: "system",
          sender: "system",
          languageCode: "ko",
          timestamp: new Date().toISOString(),
          messageType: "error"
        };
        
        setMessages(prev => [...prev, timeoutMessage]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${RESULT_API_URL}/${sessionId}`);
        addDebugLog(`[POLLING] 응답 수신 - status: ${response.status}`);
        addDebugLog(`[POLLING] 응답 데이터: ${JSON.stringify(response.data, null, 2)}`);
        
        // 상태 코드가 200 (OK)이면 결과가 도착한 것!
        if (response.status === 200) {
          addDebugLog(`[POLLING] 성공 - 폴링 중단`);
          clearInterval(intervalId); // 폴링 중단
          
          try {
            // 백엔드 응답 데이터 검증
            const resultMessage: BackendResponse = response.data;
            
            addDebugLog(`[POLLING] 백엔드 응답 데이터: ${JSON.stringify({
              id: resultMessage.id,
              message: resultMessage.message,
              analysisInfo: resultMessage.analysisInfo,
              analysisTrace: resultMessage.analysisTrace
            }, null, 2)}`);
            
            // 필수 필드 검증
            if (!resultMessage.message) {
              throw new Error('백엔드 응답에 message 필드가 없습니다.');
            }
            if (!resultMessage.id) {
              throw new Error('백엔드 응답에 id 필드가 없습니다.');
            }
            
            // ===== 새로운 백엔드 응답을 메시지 형태로 변환 =====
            const assistantMessage: message = {
              content: resultMessage.message || '응답을 받았지만 내용이 비어있습니다.', // 봇의 응답 텍스트
              role: "assistant",
              id: resultMessage.id || `fallback-${sessionId}`,
              sessionId: resultMessage.sessionId || sessionId,
              userId: resultMessage.userId || 'unknown',
              sender: resultMessage.sender || 'assistant',
              languageCode: resultMessage.languageCode || 'ko',
              timestamp: resultMessage.timestamp || new Date().toISOString(),
              analysisInfo: resultMessage.analysisInfo || undefined,
              analysisTrace: resultMessage.analysisTrace || undefined,
              messageType: "text" // 기본 메시지 타입
            };
            
            addDebugLog(`[POLLING] 메시지 변환 완료: ${JSON.stringify(assistantMessage, null, 2)}`);
            
            setMessages(prev => [
              ...prev,
              assistantMessage
            ]);
            setIsLoading(false); // 로딩 종료
            
          } catch (dataError) {
            addDebugLog(`[POLLING] 데이터 처리 오류: ${dataError instanceof Error ? dataError.message : 'Unknown error'}`);
            
            // 데이터 처리 오류 시 기본 메시지 생성
            const fallbackMessage: message = {
              content: "응답을 받았지만 데이터 처리 중 오류가 발생했습니다.",
              role: "assistant",
              id: `fallback-${sessionId}`,
              sessionId: sessionId,
              userId: "system",
              sender: "system",
              languageCode: "ko",
              timestamp: new Date().toISOString(),
              messageType: "error"
            };
            
            setMessages(prev => [...prev, fallbackMessage]);
            setIsLoading(false);
          }
        } else if (response.status === 202) {
          addDebugLog(`[POLLING] 처리 중 - status: 202, 다음 폴링까지 대기`);
        } else {
          addDebugLog(`[POLLING] 예상치 못한 상태 코드 - status: ${response.status}`);
        }
        // 상태 코드가 202 (Accepted)이면 아직 처리 중인 것. 다음 폴링까지 대기
      } catch (error) {
        addDebugLog(`[POLLING] 에러 발생 - 시도 ${retries + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        addDebugLog(`[POLLING] 에러 상세: ${JSON.stringify({
          error: error,
          message: error instanceof Error ? error.message : 'Unknown error',
          sessionId: sessionId,
          url: `${RESULT_API_URL}/${sessionId}`
        }, null, 2)}`);
        
        // 네트워크 에러인 경우 사용자에게 알림
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            addDebugLog(`[POLLING] 백엔드 서버 연결 실패: ${error.code}`);
            const errorMessage: message = {
              content: "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.",
              role: "assistant",
              id: `error-${sessionId}`,
              sessionId: sessionId,
              userId: "system",
              sender: "system",
              languageCode: "ko",
              timestamp: new Date().toISOString(),
              messageType: "error"
            };
            setMessages(prev => [...prev, errorMessage]);
          } else if (error.response?.status === 404) {
            addDebugLog(`[POLLING] 세션을 찾을 수 없음: ${sessionId}`);
            const errorMessage: message = {
              content: "세션을 찾을 수 없습니다. 다시 시도해주세요.",
              role: "assistant",
              id: `error-${sessionId}`,
              sessionId: sessionId,
              userId: "system",
              sender: "system",
              languageCode: "ko",
              timestamp: new Date().toISOString(),
              messageType: "error"
            };
            setMessages(prev => [...prev, errorMessage]);
          }
        }
        
        clearInterval(intervalId); // 에러 발생 시 폴링 중단
        setIsLoading(false);
      }
      retries++;
    }, 2000); // 2초마다 확인
  };

  // 3. 기존 handleSubmit 함수는 메시지 전송만 담당하도록 수정합니다.
  async function handleSubmit(text?: string) {
    if (isLoading) {
      addDebugLog(`[SUBMIT] 이미 로딩 중이므로 요청 무시`);
      return;
    }

    const messageText = text || question;
    addDebugLog(`[SUBMIT] 메시지 제출 시작 - text: "${messageText}", isDemoMode: ${isDemoMode}`);
    
    setIsLoading(true);
    
    const sessionId = uuidv4(); // 이제 sessionId로 사용
    addDebugLog(`[SUBMIT] 세션 ID 생성: ${sessionId}`);
    
    setMessages(prev => [...prev, { content: messageText, role: "user", id: sessionId }]);
    setQuestion("");

    // 데모 모드일 때는 가짜 응답을 생성
    if (isDemoMode) {
      addDebugLog(`[SUBMIT] 데모 모드 - 가짜 응답 생성`);
      setTimeout(() => {
        // 질문 유형에 따라 다른 분석 정보 생성
        const getDemoAnalysis = (query: string) => {
          const lowerQuery = query.toLowerCase();
          
          if (lowerQuery.includes('스마트폰') || lowerQuery.includes('아이폰') || lowerQuery.includes('갤럭시')) {
            return {
              analysisInfo: {
                engine: "dialogflow",
                intentName: "product_search",
                originalIntentName: "product_search",
                originalIntentScore: 0.94
              },
              analysisTrace: {
                dialogflowIntent: "product_search",
                dialogflowScore: 0.94,
                similarityScore: 0.91,
                safetyNetJudgement: "안전망 통과",
                ragFinalIntent: "product_search",
                retrievedDocuments: null,
                finalEngine: "dialogflow"
              }
            };
          } else if (lowerQuery.includes('고객') || lowerQuery.includes('문의') || lowerQuery.includes('도움')) {
            return {
              analysisInfo: {
                engine: "rag",
                intentName: "customer_service",
                originalIntentName: "customer_service",
                originalIntentScore: 0.87
              },
              analysisTrace: {
                dialogflowIntent: "customer_service",
                dialogflowScore: 0.75,
                similarityScore: 0.82,
                safetyNetJudgement: "안전망 통과",
                ragFinalIntent: "customer_service",
                retrievedDocuments: "고객센터 FAQ 문서 3개 검색됨",
                finalEngine: "rag"
              }
            };
          } else {
            return {
              analysisInfo: {
                engine: "similarity",
                intentName: "general_query",
                originalIntentName: "general_query",
                originalIntentScore: 0.78
              },
              analysisTrace: {
                dialogflowIntent: "general_query",
                dialogflowScore: 0.65,
                similarityScore: 0.78,
                safetyNetJudgement: "안전망 통과",
                ragFinalIntent: null,
                retrievedDocuments: null,
                finalEngine: "similarity"
              }
            };
          }
        };

        const demoAnalysis = getDemoAnalysis(messageText);
        
        const demoResponse: message = {
          content: `데모 모드: "${messageText}"에 대한 응답입니다.\n\n실제 서비스에서는 AI가 다음과 같은 과정을 거쳐 답변을 제공합니다:\n1. Dialogflow로 의도 분석\n2. 유사도 검증\n3. 안전망 판정\n4. 최종 엔진 선택`,
          role: "assistant",
          id: `demo-${sessionId}`,
          sessionId: sessionId,
          userId: "demoUser",
          sender: "assistant",
          languageCode: "ko",
          timestamp: new Date().toISOString(),
          analysisInfo: demoAnalysis.analysisInfo,
          analysisTrace: demoAnalysis.analysisTrace,
          messageType: "text"
        };
        
        setMessages(prev => [...prev, demoResponse]);
        setIsLoading(false);
      }, 2000); // 2초 후 응답
      return;
    }

    try {
      addDebugLog(`[SUBMIT] 실제 모드 - 백엔드 API 호출 시작`);
      addDebugLog(`[SUBMIT] 요청 URL: ${SEND_API_URL}`);
      addDebugLog(`[SUBMIT] 요청 데이터: ${JSON.stringify({
        sessionId: sessionId,
        userId: "testUser123",
        message: messageText,
        languageCode: "ko"
      }, null, 2)}`);

      // POST 요청으로 메시지를 보내기만 하고, 응답을 기다리지 않습니다.
      const response = await axios.post(SEND_API_URL, {
        sessionId: sessionId,
        userId: "testUser123",
        message: messageText,
        languageCode: "ko"
      });

      addDebugLog(`[SUBMIT] 메시지 전송 성공 - status: ${response.status}`);
      addDebugLog(`[SUBMIT] 폴링 시작 - sessionId: ${sessionId}`);

      // 메시지를 보내자마자 바로 폴링을 시작합니다.
      pollForResult(sessionId);

    } catch (error) {
      addDebugLog(`[SUBMIT] 메시지 전송 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addDebugLog(`[SUBMIT] 에러 상세: ${JSON.stringify({
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        url: SEND_API_URL,
        sessionId: sessionId
      }, null, 2)}`);

      // 네트워크 에러인 경우 사용자에게 알림
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          addDebugLog(`[SUBMIT] 백엔드 서버 연결 실패: ${error.code}`);
          const errorMessage: message = {
            content: "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.",
            role: "assistant",
            id: `error-${sessionId}`,
            sessionId: sessionId,
            userId: "system",
            sender: "system",
            languageCode: "ko",
            timestamp: new Date().toISOString(),
            messageType: "error"
          };
          setMessages(prev => [...prev, errorMessage]);
        } else if (error.response?.status) {
          addDebugLog(`[SUBMIT] HTTP 에러 - status: ${error.response.status}`);
          const errorMessage: message = {
            content: `서버 오류가 발생했습니다. (상태 코드: ${error.response.status})`,
            role: "assistant",
            id: `error-${sessionId}`,
            sessionId: sessionId,
            userId: "system",
            sender: "system",
            languageCode: "ko",
            timestamp: new Date().toISOString(),
            messageType: "error"
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        const errorMessage: message = {
          content: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
          role: "assistant",
          id: `error-${sessionId}`,
          sessionId: sessionId,
          userId: "system",
          sender: "system",
          languageCode: "ko",
          timestamp: new Date().toISOString(),
          messageType: "error"
        };
        setMessages(prev => [...prev, errorMessage]);
      }

      setIsLoading(false); // 메시지 전송 자체에 실패하면 로딩 종료
    }
  }
  
  return (
    <div className="app-container">
      <Header 
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        chatMode={chatMode}
        setChatMode={setChatMode}
        showAnalysis={showAnalysis}
        setShowAnalysis={setShowAnalysis}
      />
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.length === 0 && <Overview chatMode={chatMode} />}
        {messages.map((message, index) => (
          <PreviewMessage 
            key={message.id || index} 
            message={message} 
            showAnalysis={showAnalysis}
          />
        ))}
        {isLoading && <ThinkingMessage />}
        <div ref={messagesEndRef} className="scroll-anchor"/>
      </div>
      <div className="input-container">
        <ChatInput  
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
      
      {/* 디버그 패널 */}
      {showDebugPanel && (
        <DebugPanel
          logs={debugLogs}
          isVisible={showDebugPanel}
          onToggle={() => setShowDebugPanel(!showDebugPanel)}
          onClear={clearDebugLogs}
        />
      )}
    </div>
  );
};