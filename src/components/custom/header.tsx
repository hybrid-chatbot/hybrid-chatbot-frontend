import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag, Play, Square } from "lucide-react";

interface HeaderProps {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  chatMode: 'cs' | 'product_search';
  setChatMode: (mode: 'cs' | 'product_search') => void;
}

export const Header = ({ isDemoMode, setIsDemoMode, chatMode, setChatMode }: HeaderProps) => {
  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex items-center space-x-2">
          {/* 채팅 모드 전환 버튼들 */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={chatMode === 'cs' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChatMode('cs')}
              className="h-8 px-3"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              CS 상담
            </Button>
            <Button
              variant={chatMode === 'product_search' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChatMode('product_search')}
              className="h-8 px-3"
            >
              <ShoppingBag className="w-4 h-4 mr-1" />
              상품 검색
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 데모 모드 토글 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="h-8 px-3"
          >
            {isDemoMode ? (
              <>
                <Play className="w-4 h-4 mr-1" />
                데모 모드
              </>
            ) : (
              <>
                <Square className="w-4 h-4 mr-1" />
                실제 모드
              </>
            )}
          </Button>
          
          <ThemeToggle />
        </div>
      </header>
    </>
  );
};