import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// ❌ retire l'import de provideClientHydration/withEventReplay si pas de SSR

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // ❌ supprime ceci en dev si pas de SSR :
    // provideClientHydration(withEventReplay()),
  ]
};
