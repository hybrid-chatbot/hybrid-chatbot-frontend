import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
}

export const Header = ({ isDemoMode, setIsDemoMode }: HeaderProps) => {
  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <ThemeToggle />
          
          {/* 모드 전환 버튼 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {isDemoMode ? '시연용' : '실제 서비스'}
            </span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isDemoMode 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isDemoMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};