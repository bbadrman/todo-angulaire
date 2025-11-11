import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()" novalidate>
      <div class="toolbar">
        <input
          type="text"
          formControlName="text"
          placeholder="Nouvelle tâche (min 3 caractères)"
        />
        <button type="submit" [disabled]="form.invalid">Ajouter</button>
      </div>

      <div class="errors" *ngIf="form.controls.text.touched && form.controls.text.invalid">
        <small *ngIf="form.controls.text.errors?.['required']">Le texte est requis.</small>
        <small *ngIf="form.controls.text.errors?.['minlength']">Au moins 3 caractères.</small>
        <small *ngIf="form.controls.text.errors?.['maxlength']">Max 100 caractères.</small>
      </div>
    </form>
  `,
  styles: [`
    .toolbar { display:flex; gap:.5rem; margin:.5rem 0; }
    input { flex:1; padding:.45rem .6rem; }
    .errors { color:#c62828; margin-top:.25rem; }
  `]
})
export class TodoForm {
  @Output() add = new EventEmitter<string>();
  private fb = inject(FormBuilder);

  form = this.fb.group({
    text: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      nonNullable: true
    })
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.add.emit(this.form.value.text!);
    this.form.reset({ text: '' });
  }
}
