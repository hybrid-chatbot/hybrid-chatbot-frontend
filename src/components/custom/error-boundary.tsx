import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="max-w-2xl w-full p-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                오류가 발생했습니다
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                애플리케이션에서 예상치 못한 오류가 발생했습니다.
              </p>
              
              <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  오류 정보:
                </h3>
                <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
                  {this.state.error?.toString()}
                </pre>
                
                {this.state.errorInfo && (
                  <>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 mt-4">
                      컴포넌트 스택:
                    </h3>
                    <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 시도
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  페이지 새로고침
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
