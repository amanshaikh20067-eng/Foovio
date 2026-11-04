import React from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { Badge } from '../components/common/Badge';

export const AskFoovioPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="border-b border-charcoal-200/80 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
            Ask Foovio
          </h1>
          <Badge variant="lime" size="sm">
            AI Assistant
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600">
          Your campus nutrition companion. Compare street food vs canteen meals, maximize protein per rupee, or ask for custom combinations under your exact budget.
        </p>
      </div>

      <ChatInterface />
    </div>
  );
};
