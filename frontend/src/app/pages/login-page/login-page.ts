import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submitting = signal(false);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);

    const { email, password } = this.loginForm.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.perfil === 'FUNCIONARIO') {
          void this.router.navigateByUrl('/staff/home');
        } else {
          void this.router.navigateByUrl('/user/maintenance');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        const body = err.error as { message?: string } | undefined;
        this.errorMessage.set(
          body?.message ?? 'Não foi possível entrar. Verifique e-mail e senha.'
        );
      }
    });
  }
}
