import { Routes } from '@angular/router';
import { Chat } from './pages/private/chat/chat';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    component: Chat,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
