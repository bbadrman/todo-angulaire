import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Filter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = 'todos_v2';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private uid() {
    return Math.random().toString(36).slice(2, 9);
    // ou: return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9);
  }

  private load(): Todo[] {
    // ❗ Pas de localStorage côté serveur
    if (!this.isBrowser) {
      return [
        { id: this.uid(), text: 'Apprendre Angular',  done: false },
        { id: this.uid(), text: 'Coder un composant', done: false },
        { id: this.uid(), text: 'Boire un café',      done: false },
      ];
    }
    try {
      const rawV2 = globalThis.localStorage?.getItem(STORAGE_KEY);
      if (rawV2) return JSON.parse(rawV2) as Todo[];

      const rawV1 = globalThis.localStorage?.getItem('todos_v1');
      if (rawV1) {
        const arr = JSON.parse(rawV1) as string[];
        return arr.map(text => ({ id: this.uid(), text, done: false }));
      }
    } catch {}
    return [
      { id: this.uid(), text: 'Apprendre Angular',  done: false },
      { id: this.uid(), text: 'Coder un composant', done: false },
      { id: this.uid(), text: 'Boire un café',      done: false },
    ];
  }

  // --- State
  todos = signal<Todo[]>(this.load());
  filter = signal<Filter>('all');

  // --- Derivés
  filteredTodos = computed(() => {
    const f = this.filter();
    const t = this.todos();
    if (f === 'active') return t.filter(x => !x.done);
    if (f === 'completed') return t.filter(x =>  x.done);
    return t;
  });
  remaining = computed(() => this.todos().filter(t => !t.done).length);
  completed = computed(() => this.todos().filter(t =>  t.done).length);

  // --- Persistance (uniquement dans le navigateur)
  private persist = effect(() => {
    if (!this.isBrowser) return;
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
    } catch {}
  });

  // --- Actions
  add(text: string) {
    const v = text.trim();
    if (!v) return;
    this.todos.update(list => [...list, { id: this.uid(), text: v, done: false }]);
  }
  removeByIndex(index: number) {
    this.todos.update(list => list.filter((_, i) => i !== index));
  }
  toggleByIndex(index: number) {
    this.todos.update(list => list.map((t, i) => i === index ? { ...t, done: !t.done } : t));
  }
  clear() { this.todos.set([]); }
  clearCompleted() { this.todos.update(list => list.filter(t => !t.done)); }
  setFilter(f: Filter) { this.filter.set(f); }
  updateText(index: number, text: string) {
    const v = text.trim(); if (!v) return;
    this.todos.update(list => list.map((t, i) => i === index ? { ...t, text: v } : t));
  }

  // ajoute cette méthode dans la classe TodoService
updateTextById(id: string, text: string) {
  const v = text.trim();
  if (!v) return;
  this.todos.update(list =>
    list.map(t => t.id === id ? { ...t, text: v } : t)
  );
}
}
