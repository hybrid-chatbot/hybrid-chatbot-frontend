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
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          
          setMessages(prev => [
            ...prev,
            { content: resultMessage.dialogflowResponse, role: "assistant", id: sessionId }
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
      <Header/>
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.length == 0 && <Overview />}
        {messages.map((message, index) => (
          <PreviewMessage key={index} message={message} />
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