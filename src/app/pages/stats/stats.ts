import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from '../../core/services/todo.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Statistiques</h2>

    <section class="cards">
      <div class="card">
        <h3>Total</h3>
        <p class="big">{{ total() }}</p>
      </div>
      <div class="card">
        <h3>À faire</h3>
        <p class="big">{{ remaining() }}</p>
      </div>
      <div class="card">
        <h3>Terminées</h3>
        <p class="big">{{ completed() }}</p>
      </div>
      <div class="card">
        <h3>Taux d’avancement</h3>
        <p class="big">{{ rate() }}%</p>
      </div>
    </section>

    <section class="progress">
      <div class="bar">
        <div class="fill" [style.width.%]="rate()"></div>
      </div>
      <small>{{ completed() }} / {{ total() }} terminées</small>
    </section>

    <section class="details" *ngIf="total() > 0">
      <h3>Détails</h3>
      <ul>
        <li *ngFor="let t of todoService.todos(); let i = index">
          <span [class.done]="t.done">{{ i + 1 }}. {{ t.text }}</span>
          <span class="badge" [class.ok]="t.done" [class.no]="!t.done">
            {{ t.done ? '✔ fait' : 'à faire' }}
          </span>
        </li>
      </ul>
    </section>

    <p><a routerLink="/todos">← Retour aux tâches</a></p>
  `,
  styles: [`
    .cards { display:grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin:12px 0 20px; }
    .card { border:1px solid #eee; border-radius:10px; padding:12px; background:#fafafa; }
    .big { font-size:1.8rem; font-weight:700; margin:.2rem 0 0; }
    .progress .bar { height:12px; border-radius:999px; background:#eee; overflow:hidden; margin:8px 0; }
    .progress .fill { height:100%; background:#4caf50; transition: width .25s ease; }
    .details ul { list-style:none; padding:0; margin:8px 0 0; }
    .details li { display:flex; justify-content:space-between; border-bottom:1px dashed #e5e5e5; padding:.35rem 0; }
    .done { text-decoration:line-through; color:#777; }
    .badge { font-size:.8rem; border-radius:999px; padding:.1rem .5rem; border:1px solid #ddd; }
    .badge.ok { background:#e8f5e9; border-color:#a5d6a7; }
    .badge.no { background:#fff3e0; border-color:#ffcc80; }
  `]
})
export class Stats {
  constructor(public todoService: TodoService) {}

  total = computed(() => this.todoService.todos().length);
  remaining = computed(() => this.todoService.remaining());
  completed = computed(() => this.todoService.completed());
  rate = computed(() => {
    const t = this.total();
    if (!t) return 0;
    return Math.round((this.completed() / t) * 100);
  });
}
