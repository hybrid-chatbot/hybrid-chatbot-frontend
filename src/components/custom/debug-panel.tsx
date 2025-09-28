import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Bug, X } from 'lucide-react';

interface DebugPanelProps {
  logs: string[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export function DebugPanel({ logs, isVisible, onToggle, onClear }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 max-h-96 bg-gray-900 text-white border-gray-700">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            <span className="font-medium text-sm">디버그 로그</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
              {logs.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="max-h-64 overflow-y-auto p-3">
            {logs.length === 0 ? (
              <div className="text-gray-400 text-sm">로그가 없습니다.</div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono bg-gray-800 p-2 rounded border-l-2 border-gray-600"
                  >
                    <div className="text-gray-400 text-xs mb-1">
                      {new Date().toLocaleTimeString()}
                    </div>
                    <div className="whitespace-pre-wrap break-words">
                      {log}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
