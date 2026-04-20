import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { FuncionarioResponse, FuncionarioService } from '../../../services/funcionario.service';

interface FuncionarioFormulario {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  senha: string;
}

@Component({
  selector: 'app-staff-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-employees.html'
})
export class StaffEmployeesComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly service = inject(FuncionarioService);

  protected readonly funcionarios = signal<FuncionarioResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected funcionarioLogadoId = 0;

  protected formulario: FuncionarioFormulario = this.formularioVazio();
  protected modoEdicao = false;

  ngOnInit(): void {
    this.funcionarioLogadoId = this.auth.getUserId() ?? 0;
    this.carregar();
  }

  protected carregar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.service.listar().subscribe({
      next: (lista) => {
        this.funcionarios.set([...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar os funcionários.'
        );
      }
    });
  }

  protected getMotivoBloqueioExclusao(idFuncionario: number): string {
    if (this.funcionarios().length === 1) {
      return 'Não é possível excluir o único funcionário do sistema.';
    }
    if (idFuncionario === this.funcionarioLogadoId) {
      return 'Você não pode excluir sua própria conta.';
    }
    return 'Excluir funcionário';
  }

  protected salvar(): void {
    if (!this.formularioValido()) return;

    const payload = {
      nome: this.formulario.nome.trim(),
      email: this.formulario.email.trim(),
      dataNascimento: this.formulario.dataNascimento,
      ...(this.formulario.senha ? { senha: this.formulario.senha } : {})
    };

    this.submitting.set(true);
    this.errorMessage.set(null);

    const request$ = this.modoEdicao
      ? this.service.atualizar(this.formulario.id, payload)
      : this.service.criar({ ...payload, senha: this.formulario.senha });

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.resetarFormulario();
        this.carregar();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível salvar o funcionário.'
        );
      }
    });
  }

  protected editar(func: FuncionarioResponse): void {
    this.modoEdicao = true;
    this.formulario = {
      id: func.id,
      nome: func.nome,
      email: func.email,
      dataNascimento: func.dataNascimento,
      senha: ''
    };
  }

  protected excluir(func: FuncionarioResponse): void {
    if (func.id === this.funcionarioLogadoId) {
      this.errorMessage.set('Operação negada: você não pode remover a si mesmo.');
      return;
    }
    if (this.funcionarios().length === 1) {
      this.errorMessage.set('Operação negada: o sistema deve ter no mínimo um funcionário.');
      return;
    }

    const confirmacao = window.confirm(
      `Confirma a remoção do funcionário "${func.nome}"? O registro ficará inativo (soft-delete).`
    );
    if (!confirmacao) return;

    this.errorMessage.set(null);
    this.service.deletar(func.id).subscribe({
      next: () => {
        if (this.formulario.id === func.id) {
          this.resetarFormulario();
        }
        this.carregar();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível remover o funcionário.'
        );
      }
    });
  }

  protected formularioValido(): boolean {
    const base =
      this.formulario.nome.trim().length > 0 &&
      this.formulario.email.trim().length > 0 &&
      !!this.formulario.dataNascimento;
    if (this.modoEdicao) {
      return base;
    }
    return base && this.formulario.senha.trim().length > 0;
  }

  protected formularioTemDados(): boolean {
    return !!(
      this.formulario.nome ||
      this.formulario.email ||
      this.formulario.dataNascimento ||
      this.formulario.senha
    );
  }

  protected cancelar(): void {
    this.resetarFormulario();
  }

  private resetarFormulario(): void {
    this.modoEdicao = false;
    this.formulario = this.formularioVazio();
  }

  private formularioVazio(): FuncionarioFormulario {
    return { id: 0, nome: '', email: '', dataNascimento: '', senha: '' };
  }
}
