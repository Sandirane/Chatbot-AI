import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@core/services/chat.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat { 
  protected chatService = inject(ChatService);
 
  userInput = signal('');

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;
 
    this.chatService.sendMessage(text);
 
    this.userInput.set('');
  }
}
