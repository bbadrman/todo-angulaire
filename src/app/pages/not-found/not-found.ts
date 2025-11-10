import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <h2>Page non trouvée (404)</h2>
    <p>La page que vous cherchez n'existe pas.</p>
    <p><a routerLink="/todos">← Retour aux tâches</a></p>
  `,
})
export class NotFound {}
