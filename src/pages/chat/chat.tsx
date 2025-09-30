import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState } from "react";
import { message } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
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
          const resultMessage = response.data;
          
          // ===== 백엔드 응답을 메시지 형태로 변환 (상품 시각화 기능 추가) =====
          // ShoppingMessageResponse를 프론트엔드 message 인터페이스로 변환
          const assistantMessage = {
            content: resultMessage.response || resultMessage.message, // 봇의 응답 텍스트
            role: "assistant",
            id: sessionId,
            products: resultMessage.products || [], // 상품 카드 데이터 (새로 추가)
            messageType: resultMessage.messageType || "text" // 메시지 타입 (새로 추가)
          };
          
          setMessages(prev => [
            ...prev,
            assistantMessage
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
    setMessages(prev => [...prev, { content: messageText, role: "user", id: sessionId }]);
    setQuestion("");

    try {
      // POST 요청으로 메시지를 보내기만 하고, 응답을 기다리지 않습니다.
      await axios.post(SEND_API_URL, {
        sessionId: sessionId,
        userId: "testUser123",
        message: messageText,
        languageCode: "ko"
      });

      // 메시지를 보내자마자 바로 폴링을 시작합니다.
      pollForResult(sessionId);

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
        {messages.length === 0 && <Overview chatMode={chatMode} />}
        {messages.map((message, index) => (
          <PreviewMessage key={message.id || index} message={message} isDemoMode={isDemoMode} />
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