import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@core/services/chat/chat.service';
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: 'app-chat',
  imports: [FormsModule, MarkdownComponent],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit {
  protected chatService = inject(ChatService);

  ngOnInit() {
    this.chatService.loadConversations();
  }

  userInput = signal('');

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;

    this.chatService.sendMessage(text);

    this.userInput.set('');
  }
}
