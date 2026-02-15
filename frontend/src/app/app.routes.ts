import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/public/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadChildren: () => import('./features/chat.routes').then((m) => m.CHAT_ROUTES),
  },
  {
    path: 'notauthorized',
    loadComponent: () =>
      import('./features/public/pages/notauthorized/notauthorized').then((m) => m.Notauthorized),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/public/pages/pagenotfound/pagenotfound').then((m) => m.Pagenotfound),
  },
];
