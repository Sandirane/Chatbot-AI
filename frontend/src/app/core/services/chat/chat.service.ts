import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@config/environment';
import { ChatResponse } from '@core/models/chat/chat-response';
import { Message } from '@core/models/chat/message';
import { finalize } from 'rxjs';

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  _count?: { messages: number };
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/chat`;
  conversations = signal<Conversation[]>([]);

  messages = signal<Message[]>([]);
  isLoading = signal<boolean>(false);
  currentConversationId = signal<string | null>(null);

  sendMessage(content: string) {
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    this.messages.update((prev) => [...prev, tempUserMsg]);
    this.isLoading.set(true);

    const conversationId = this.currentConversationId();

    this.http
      .post<ChatResponse>(this.apiUrl, {
        message: content,
        conversationId: conversationId,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          if (!conversationId) {
            this.currentConversationId.set(data.conversationId);
            this.loadConversations();
          }

          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.response,
            createdAt: new Date(),
          };
          this.messages.update((prev) => [...prev, assistantMsg]);
        },
        error: (err) => {
          console.error('Erreur ChatService:', err);
        },
      });
  }

  loadConversations() {
    this.http
      .get<Conversation[]>(`${environment.apiUrl}/chat/conversations`)
      .subscribe((data) => this.conversations.set(data));
  }

  loadMessages(conversationId: string) {
    this.isLoading.set(true);
    this.currentConversationId.set(conversationId);

    this.http
      .get<any>(`${environment.apiUrl}/chat/conversations/${conversationId}`)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        this.messages.set(data.messages);
      });
  }

  deleteConversation(id: string) {
    this.http.delete(`${environment.apiUrl}/chat/conversations/${id}`).subscribe({
      next: () => {
        this.conversations.update((list) => list.filter((c) => c.id !== id));

        if (this.currentConversationId() === id) {
          this.clearChat();
        }
      },
      error: (err) => console.error('Erreur suppression:', err),
    });
  }

  clearChat() {
    this.messages.set([]);
    this.currentConversationId.set(null);
  }
}
