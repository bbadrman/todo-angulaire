import { Injectable, signal, effect } from '@angular/core';

const STORAGE_KEY = 'todos_v1';

@Injectable({ providedIn: 'root' })
export class TodoService {
  // 1) Charge depuis localStorage si dispo
  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as string[] : [
        'Apprendre Angular',
        'Coder un composant',
        'Boire un café',
      ];
    } catch {
      return ['Apprendre Angular', 'Coder un composant', 'Boire un café'];
    }
  }

  todos = signal<string[]>(this.load());

  // 2) Sauvegarde automatique à chaque changement
  private persist = effect(() => {
    const data = JSON.stringify(this.todos());
    localStorage.setItem(STORAGE_KEY, data);
  });

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
