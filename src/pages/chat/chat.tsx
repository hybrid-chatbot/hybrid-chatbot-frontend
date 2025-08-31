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

const API_URL = "http://localhost:8080/api/messages/receive"; // MessageController API endpoint

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(text?: string) {
    if (isLoading) return;

    const messageText = text || question;
    setIsLoading(true);
    
    const traceId = uuidv4();
    console.log('Sending message:', messageText);  // 요청 메시지 로깅
    setMessages(prev => [...prev, { content: messageText, role: "user", id: traceId }]);
    setQuestion("");

    try {
      console.log('API Request URL:', API_URL);  // API URL 로깅
      console.log('Request params:', {           // 요청 파라미터 로깅
        sessionId: traceId,
        userId: "testUser123",
        message: messageText,
        languageCode: "ko"
      });

      // json으로 보내기
      const response = await axios.post(API_URL, {
        sessionId: traceId,
        userId: "testUser123",
        message: messageText,
        languageCode: "ko"
      });

      console.log('API Response:', response.data);  // 응답 데이터 로깅

      if (!response.data.response) {
        console.error('No fulfillmentText in response:', response.data);
        return;
      }

      setMessages(prev => [
        ...prev,
        { content: response.data.response, role: "assistant", id: traceId }
      ]);
    } catch (error) {
      // axios에서 발생한 에러인지 먼저 확인
      if (axios.isAxiosError(error)) {
        console.error("API error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      // 일반적인 자바스크립트 Error인지 확인
      } else if (error instanceof Error) {
        console.error("General error:", error.message);
      // 정체를 알 수 없는 에러
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
    finally {
      setIsLoading(false);
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