import { Recommendation } from './recommendation';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendationCard?: Recommendation;
  suggestedPrompts?: string[];
}
