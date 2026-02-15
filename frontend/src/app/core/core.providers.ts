import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  Provider,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '@config/environment.development';
import { KeycloakService, KeycloakBearerInterceptor } from 'keycloak-angular';
import { routes } from '../app.routes';
import { provideMarkdown } from 'ngx-markdown';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
    });
}

export const coreProviders: (Provider | EnvironmentProviders)[] = [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  provideHttpClient(withInterceptors([]), withInterceptorsFromDi()),
  KeycloakService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: KeycloakBearerInterceptor,
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService],
  },
  provideMarkdown(),
];
