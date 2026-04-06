import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FUNCIONARIOS } from '../../database.mock';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html'
})
export class LoginPageComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router); // Usando apenas UMA declaração do router!

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
protected submit(): void {
    // 1. Verifica se o formulário é válido (se preencheu e-mail e senha)
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // 2. Pega o e-mail exato que o usuário digitou no campo
    const emailDigitado = this.loginForm.get('email')?.value;

    // 3. Procura se o e-mail digitado existe na lista de funcionários do Mock
    const funcionarioEncontrado = FUNCIONARIOS.find(f => f.email === emailDigitado);
    
    if (funcionarioEncontrado) {
      // Se achou, é um funcionário! Redireciona para o painel de Staff
      console.log(`Bem-vindo(a) Funcionário(a) ${funcionarioEncontrado.nome}!`);
      this.router.navigate(['/staff/home']);
    } else {
      // Se não achou na lista de funcionários, é um Cliente
      console.log('Bem-vindo(a) Cliente!');
      this.router.navigateByUrl('/user/maintenance'); 
    }
  }
}


  