import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],     // ✅ nécessaire
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoList {
  title = 'Mes tâches';
  todos = ['Apprendre Angular', 'Coder un composant', 'Boire un café'];

  newTodo = '';                              // ✅ utilisé par [(ngModel)]

  addTodo() {                                // ✅ utilisé par (click)
    const v = this.newTodo.trim();
    if (v) {
      this.todos = [...this.todos, v];
      this.newTodo = '';
    }
  }

  removeTodo(i: number) {                    // ✅ utilisé par (click)
    this.todos = this.todos.filter((_, idx) => idx !== i);
  }
}
