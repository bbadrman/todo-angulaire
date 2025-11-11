import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../../core/services/todo.service';
import { TodoForm } from '../todo-form/todo-form';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoForm],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoList {
  title = 'Mes tâches';
  constructor(public todoService: TodoService) {}

  addTodo(text: string) { this.todoService.add(text); }
  removeTodo(i: number) { this.todoService.removeByIndex(i); }
  toggle(i: number)     { this.todoService.toggleByIndex(i); }
  clearAll()            { this.todoService.clear(); }
  clearCompleted()      { this.todoService.clearCompleted(); }
  setFilter(f: 'all' | 'active' | 'completed') { this.todoService.setFilter(f); }

  trackById = (_: number, t: { id: string }) => t.id;
}
