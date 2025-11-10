import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <h2>À propos</h2>
    <p>Petit projet Angular pour apprendre pas à pas 🚀</p>
    <p><a routerLink="/todos">← Retour aux tâches</a></p>
  `,
})
export class About {}
