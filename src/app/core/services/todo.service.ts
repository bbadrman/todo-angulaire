import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export type Filter = 'all' | 'active' | 'completed';
export interface Todo { id: string; text: string; done: boolean; }

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  // private API = 'http://localhost:3000/todos';
  private API = 'http://127.0.0.1:8000/todos';


  todos = signal<Todo[]>([]);
  filter = signal<Filter>('all');

  constructor() {
    // Charger depuis l'API au démarrage
    this.http.get<Todo[]>(this.API).subscribe(list => this.todos.set(list));
  }

  // derivés (inchangés)
  filteredTodos = computed(() => {
    const f = this.filter(), t = this.todos();
    if (f === 'active') return t.filter(x => !x.done);
    if (f === 'completed') return t.filter(x =>  x.done);
    return t;
  });
  remaining = computed(() => this.todos().filter(t => !t.done).length);
  completed = computed(() => this.todos().filter(t =>  t.done).length);

  setFilter(f: Filter) { this.filter.set(f); }

  add(text: string) {
    const payload = { id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2,9), text: text.trim(), done: false };
    if (!payload.text) return;
    // Optimistic update
    this.todos.update(list => [...list, payload]);
    this.http.post<Todo>(this.API, payload).subscribe({
      error: () => this.todos.update(list => list.filter(t => t.id !== payload.id))
    });
  }

  removeByIndex(index: number) {
    const t = this.todos()[index]; if (!t) return;
    const prev = this.todos();
    this.todos.update(list => list.filter((_, i) => i !== index));
    this.http.delete(`${this.API}/${t.id}`).subscribe({
      error: () => this.todos.set(prev)
    });
  }

  toggleByIndex(index: number) {
    const t = this.todos()[index]; if (!t) return;
    const updated = { ...t, done: !t.done };
    const prev = this.todos();
    this.todos.update(list => list.map((x, i) => i === index ? updated : x));
    this.http.patch<Todo>(`${this.API}/${t.id}`, { done: updated.done }).subscribe({
      error: () => this.todos.set(prev)
    });
  }

  clear() {
    // Supprime tout sur l’API (simple: delete en série)
    const toDelete = this.todos();
    this.todos.set([]);
    toDelete.forEach(t =>
      this.http.delete(`${this.API}/${t.id}`).subscribe({
        error: () => this.todos.set(toDelete)
      })
    );
  }

  clearCompleted() {
    const prev = this.todos();
    const kept = prev.filter(t => !t.done);
    const completed = prev.filter(t => t.done);
    this.todos.set(kept);
    completed.forEach(t =>
      this.http.delete(`${this.API}/${t.id}`).subscribe({
        error: () => this.todos.set(prev)
      })
    );
  }

  updateTextById(id: string, text: string) {
    const v = text.trim(); if (!v) return;
    const prev = this.todos();
    const updated = prev.map(t => t.id === id ? { ...t, text: v } : t);
    this.todos.set(updated);
    this.http.patch<Todo>(`${this.API}/${id}`, { text: v }).subscribe({
      error: () => this.todos.set(prev)
    });
  }
}
