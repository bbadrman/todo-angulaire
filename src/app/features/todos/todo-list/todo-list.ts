import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../../core/services/todo.service';// ✅ chemin relatif
 

@Component({
  selector: 'app-todo-list',
  standalone: true,                       // ✅ indispensable
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoList {
  title = 'Mes tâches';
  newTodo = '';

  // ✅ Injection classique (pas "import type")
  constructor(public todoService: TodoService) {}

  addTodo() { this.todoService.add(this.newTodo); this.newTodo = ''; }
  removeTodo(i: number) { this.todoService.remove(i); }
  clearAll() { this.todoService.clear(); }
}
