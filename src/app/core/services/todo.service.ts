import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todos = signal<string[]>([
    'Apprendre Angular',
    'Coder un composant',
    'Boire un café'
  ]);

  add(todo: string) {
    const v = todo.trim();
    if (v) this.todos.update(t => [...t, v]);
  }

  remove(index: number) {
    this.todos.update(t => t.filter((_, i) => i !== index));
  }

  clear() {
    this.todos.set([]);
  }
}
