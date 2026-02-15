import { Message } from './message';

export interface ChatResponse {
  conversationId: string;
  history: Message[];
  response: string;
  reply: string;
}
