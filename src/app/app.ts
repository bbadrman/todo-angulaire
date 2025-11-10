import { Component, signal } from '@angular/core';
import { TodoList } from './features/todos/todo-list/todo-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoList],               // ✅ juste le composant
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('todo-app-angulaire');
}
