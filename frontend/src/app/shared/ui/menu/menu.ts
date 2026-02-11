import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

interface Action {
  title: string;
  route: string;
}
@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  isLoggedIn = signal(false);
  username = signal('');

  actions: Array<Action> = [
    { title: 'Home', route: '/home' },
    { title: 'Chat', route: 'chat' },
  ];

  private keycloak = inject(KeycloakService);

  async ngOnInit() {
    const loggedIn = await this.keycloak.isLoggedIn();
    this.isLoggedIn.set(loggedIn);

    if (loggedIn) {
      const profile = await this.keycloak.loadUserProfile();
      this.username.set(profile.firstName || profile.username || 'Utilisateur');
    }
  }

  login() {
    this.keycloak.login();
  }
  logout() {
    this.keycloak.logout(window.location.origin);
  }
  
}
