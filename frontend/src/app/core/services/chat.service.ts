import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@config/environment.development';
import { ChatResponse } from '@core/models/chat-response';
import { Message } from '@core/models/message';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/chat`;

  readonly messages = signal<Message[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly currentConversationId = signal<string | null>(null);

  sendMessage(content: string) {
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    this.messages.update((prev) => [...prev, tempUserMsg]);
    this.isLoading.set(true);

    this.http
      .post<ChatResponse>(this.apiUrl, { message: content })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.currentConversationId.set(data.conversationId);

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

  clearChat() {
    this.messages.set([]);
    this.currentConversationId.set(null);
  }
}
