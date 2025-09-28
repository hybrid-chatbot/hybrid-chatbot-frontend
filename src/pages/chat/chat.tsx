import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState } from "react";
import { message, BackendMessage, ProductInfo } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import '@/styles/main.css';

// 1. API 주소를 역할에 맞게 두 개로 나눕니다.
const SEND_API_URL = "http://localhost:8080/api/messages/receive"; 
const RESULT_API_URL = "http://localhost:8080/api/messages/result";
// 상품 검색 API (향후 백엔드 연동 시 사용)
// const PRODUCT_SEARCH_API_URL = "http://localhost:8080/api/products/search"; 

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // 시연용 모드 기본값
  const [chatMode, setChatMode] = useState<'cs' | 'product_search'>('cs'); // 채팅 모드

  // 상품 검색 시뮬레이션 함수
  const simulateProductSearch = async (keyword: string): Promise<ProductInfo[]> => {
    // 실제로는 백엔드 API를 호출하지만, 여기서는 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    
    // 키워드에 따른 샘플 상품 데이터
    const sampleProducts: { [key: string]: ProductInfo[] } = {
      '청바지': [
        { id: 1, name: '남성 데님 청바지', quantity: 15, price: 89000, category: '의류', brand: 'Levi\'s' },
        { id: 2, name: '여성 스키니 청바지', quantity: 8, price: 65000, category: '의류', brand: 'ZARA' },
        { id: 3, name: '남성 와이드 청바지', quantity: 12, price: 75000, category: '의류', brand: 'Uniqlo' },
        { id: 4, name: '여성 하이웨이스트 청바지', quantity: 6, price: 85000, category: '의류', brand: 'H&M' }
      ],
      '운동화': [
        { id: 5, name: 'Nike Air Force 1', quantity: 20, price: 120000, category: '신발', brand: 'Nike' },
        { id: 6, name: 'Adidas Stan Smith', quantity: 18, price: 95000, category: '신발', brand: 'Adidas' },
        { id: 7, name: 'Converse Chuck Taylor', quantity: 25, price: 70000, category: '신발', brand: 'Converse' }
      ],
      '스마트폰': [
        { id: 8, name: 'iPhone 15 Pro', quantity: 5, price: 1350000, category: '전자제품', brand: 'Apple' },
        { id: 9, name: 'Galaxy S24', quantity: 8, price: 1200000, category: '전자제품', brand: 'Samsung' },
        { id: 10, name: 'Pixel 8', quantity: 3, price: 800000, category: '전자제품', brand: 'Google' }
      ]
    };

    // 키워드가 포함된 상품들 반환 (기본값도 제공)
    const products = sampleProducts[keyword] || [
      { id: 11, name: `${keyword} 관련 상품 1`, quantity: 10, price: 50000, category: '기타', brand: 'Unknown' },
      { id: 12, name: `${keyword} 관련 상품 2`, quantity: 7, price: 75000, category: '기타', brand: 'Unknown' }
    ];

    return products;
  };

  // 2. 결과를 주기적으로 확인하는 새로운 함수를 만듭니다.
  const pollForResult = (sessionId: string) => {
    const maxRetries = 15; // 최대 15번 (30초) 시도
    let retries = 0;

    const intervalId = setInterval(async () => {
      if (retries >= maxRetries) {
        clearInterval(intervalId);
        // 여기에 타임아웃 에러 처리 로직 추가 가능
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${RESULT_API_URL}/${sessionId}`);
        
        // 상태 코드가 200 (OK)이면 결과가 도착한 것!
        if (response.status === 200) {
          clearInterval(intervalId); // 폴링 중단
          const resultMessage: BackendMessage = response.data;
          
          // 새로운 데이터 형식에서 message 필드를 사용하여 메시지 생성
          setMessages(prev => [
            ...prev,
            { 
              content: resultMessage.message, 
              role: resultMessage.sender === "bot" ? "assistant" : "user", 
              id: resultMessage.id,
              analysisInfo: resultMessage.analysisInfo,
              analysisTrace: resultMessage.analysisTrace
            }
          ]);
          setIsLoading(false); // 로딩 종료
        }
        // 상태 코드가 202 (Accepted)이면 아직 처리 중인 것. 다음 폴링까지 대기
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(intervalId); // 에러 발생 시 폴링 중단
        setIsLoading(false);
      }
      retries++;
    }, 2000); // 2초마다 확인
  };

  // 3. 기존 handleSubmit 함수는 메시지 전송만 담당하도록 수정합니다.
  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const messageText = text || question;
    setIsLoading(true);
    
    const sessionId = uuidv4(); // 이제 sessionId로 사용
    setMessages(prev => [...prev, { 
      content: messageText, 
      role: "user", 
      id: sessionId,
      messageType: chatMode
    }]);
    setQuestion("");

    try {
      if (chatMode === 'product_search') {
        // 상품 검색 모드
        const products = await simulateProductSearch(messageText);
        
        // 상품 검색 결과를 메시지로 추가
        setMessages(prev => [...prev, {
          content: `"${messageText}"에 대한 검색 결과입니다.`,
          role: "assistant",
          id: uuidv4(),
          products: products,
          messageType: 'product_search'
        }]);
        
        setIsLoading(false);
      } else {
        // CS 질문 모드 (기존 로직)
        await axios.post(SEND_API_URL, {
          sessionId: sessionId,
          userId: "testUser123",
          message: messageText,
          languageCode: "ko"
        });

        // 메시지를 보내자마자 바로 폴링을 시작합니다.
        pollForResult(sessionId);
      }

    } catch (error) {
      console.error("Send message error:", error);
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
      />
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.length == 0 && <Overview chatMode={chatMode} />}
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} isDemoMode={isDemoMode} />
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
    </div>
  );
};