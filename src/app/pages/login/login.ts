import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h2>Connexion</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div class="field">
        <label>Email</label>
        <input type="email" formControlName="email" />
        <div class="error" *ngIf="form.controls.email.touched && form.controls.email.invalid">
          <small *ngIf="form.controls.email.errors?.['required']">Email requis.</small>
          <small *ngIf="form.controls.email.errors?.['email']">Format email invalide.</small>
        </div>
      </div>

      <div class="field">
        <label>Mot de passe</label>
        <input type="password" formControlName="password" />
        <div class="error" *ngIf="form.controls.password.touched && form.controls.password.invalid">
          <small *ngIf="form.controls.password.errors?.['required']">Mot de passe requis.</small>
          <small *ngIf="form.controls.password.errors?.['minlength']">Min 4 caractères.</small>
        </div>
      </div>

      <button type="submit" [disabled]="form.invalid || loading">Se connecter</button>

      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </form>

    <p>
      (Tu t'étais créé un user avec <code>/auth/register</code> :
      par ex. <code>test@example.com / 1234</code>)
    </p>

    <p><a routerLink="/todos">← Retour aux tâches</a></p>
  `,
  styles: [`
    form { max-width: 320px; display:flex; flex-direction:column; gap:12px; }
    .field { display:flex; flex-direction:column; gap:4px; }
    input { padding: .4rem .6rem; border-radius: 4px; border:1px solid #ccc; }
    button { padding:.45rem .8rem; cursor:pointer; }
    .error { color:#c62828; font-size:.85rem; }
  `]
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit() {
    this.errorMessage = '';
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.loading = true;

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/todos');
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur login', err);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      },
    });
  }
}
