import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/chat';
import { askFoovioAssistant } from '../../services/chatAssistantService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Send,
  MessageSquareCode,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

const SUGGESTED_QUICK_CHIPS = [
  'What can I eat under ₹80?',
  'Suggest a vegetarian protein-rich meal.',
  'Compare poha and samosa.',
  'What fits my current nutrition goal?',
  'Suggest meals using only my available canteen items.',
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm **Foovio**, your Indian college canteen AI assistant. 
I have live access to your profile parameters and campus canteen menu. Ask me for budget combos, nutritional comparisons, or how to hit your protein targets on student pocket money!`,
      timestamp: new Date().toISOString(),
      suggestedPrompts: SUGGESTED_QUICK_CHIPS,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askFoovioAssistant(userMsg.text);
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString(),
        suggestedPrompts: response.suggestedPrompts,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'I ran into a temporary hiccup evaluating your request. Please try asking again!',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: `Chat reset. What would you like to know about your canteen food today?`,
        timestamp: new Date().toISOString(),
        suggestedPrompts: SUGGESTED_QUICK_CHIPS,
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 shadow-soft-sm flex flex-col h-[650px] overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-charcoal-100 bg-cream-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-limeAccent-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-charcoal-900">Ask Foovio</span>
              <Badge variant="lime" size="sm">
                Canteen AI
              </Badge>
            </div>
            <p className="text-[11px] text-charcoal-500">
              Personalized Indian college nutrition assistant
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200 rounded-lg transition-colors"
          title="Reset conversation"
          aria-label="Reset chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-forest-600 text-white rounded-tr-none shadow-soft-sm'
                    : 'bg-cream-100 border border-charcoal-200 text-charcoal-900 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {/* Formatted Markdown-like display */}
                  {msg.text.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Suggested prompt chips below assistant message */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-charcoal-200/80 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      Suggested Follow-ups:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedPrompts.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-charcoal-200 hover:border-forest-500 hover:text-forest-800 text-[11px] font-semibold text-charcoal-700 transition-all text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-forest-800 text-limeAccent-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading typing bubble */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-cream-100 border border-charcoal-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-600 animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-forest-600 animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-forest-600 animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom input area */}
      <div className="p-3 sm:p-4 border-t border-charcoal-100 bg-cream-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything: e.g. 'What can I eat under ₹80 with high protein?'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 bg-white"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim() || isLoading}
            icon={<Send className="w-4 h-4" />}
          >
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
};
