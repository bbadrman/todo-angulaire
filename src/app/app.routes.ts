import { Routes } from '@angular/router';
import { TodoList } from './features/todos/todo-list/todo-list';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoList },

  // ✅ Stats (lazy)
  {
    path: 'stats',
    loadComponent: () =>
      import('./pages/stats/stats').then(m => m.Stats)
  },
// login (lazy)
   {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },

  // About (lazy)
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then(m => m.About)
  },
  // 404 (lazy)
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(m => m.NotFound)
  },
];
