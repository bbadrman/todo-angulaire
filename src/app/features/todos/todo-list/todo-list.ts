import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';                 // ✅ pour [(ngModel)]
import { TodoService } from '../../../core/services/todo.service';
import { TodoForm } from '../todo-form/todo-form';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoForm],              // ✅ ajoute FormsModule
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss'],
})
export class TodoList {
  title = 'Mes tâches';

  // état d'édition
  editingId: string | null = null;
  draftText = '';

  constructor(public todoService: TodoService) {}

  addTodo(text: string)               { this.todoService.add(text); }
  removeTodo(i: number)               { this.todoService.removeByIndex(i); }
  toggle(i: number)                   { this.todoService.toggleByIndex(i); }
  clearAll()                          { this.todoService.clear(); }
  clearCompleted()                    { this.todoService.clearCompleted(); }
  setFilter(f: 'all'|'active'|'completed') { this.todoService.setFilter(f); }

  startEdit(id: string, current: string) {
    this.editingId = id;
    this.draftText = current;
    // Optionnel: focus sera géré par autofocus dans le template
  }
  commitEdit() {
    if (!this.editingId) return;
    this.todoService.updateTextById(this.editingId, this.draftText);
    this.editingId = null;
    this.draftText = '';
  }
  cancelEdit() {
    this.editingId = null;
    this.draftText = '';
  }

  trackById = (_: number, t: { id: string }) => t.id;
}
