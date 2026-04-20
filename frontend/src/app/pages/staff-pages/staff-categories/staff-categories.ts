import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { CategoriaService, CategoriaResponse } from '../../../services/categoria.service';

@Component({
  selector: 'app-staff-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-categories.html'
})
export class StaffCategoriesComponent implements OnInit {
  private readonly service = inject(CategoriaService);

  protected readonly categorias = signal<CategoriaResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected categoriaAtual: { id: number; nome: string; descricao: string } = {
    id: 0,
    nome: '',
    descricao: ''
  };
  protected modoEdicao = false;

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.service.listar().subscribe({
      next: (lista) => {
        this.categorias.set([...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Não foi possível carregar as categorias.');
      }
    });
  }

  protected salvarCategoria(): void {
    const nome = this.categoriaAtual.nome.trim();
    if (!nome) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      nome,
      descricao: this.categoriaAtual.descricao?.trim() || null
    };

    const request$ = this.modoEdicao
      ? this.service.atualizar(this.categoriaAtual.id, payload)
      : this.service.criar(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.resetarFormulario();
        this.carregar();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível salvar a categoria.'
        );
      }
    });
  }

  protected editarCategoria(cat: CategoriaResponse): void {
    this.modoEdicao = true;
    this.categoriaAtual = {
      id: cat.id,
      nome: cat.nome,
      descricao: cat.descricao ?? ''
    };
  }

  protected excluirCategoria(cat: CategoriaResponse): void {
    const confirmacao = window.confirm(
      `Confirma a remoção da categoria "${cat.nome}"? Ela ficará inativa no sistema (soft-delete).`
    );
    if (!confirmacao) return;

    this.errorMessage.set(null);
    this.service.deletar(cat.id).subscribe({
      next: () => {
        if (this.categoriaAtual.id === cat.id) {
          this.resetarFormulario();
        }
        this.carregar();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível remover a categoria.'
        );
      }
    });
  }

  protected cancelar(): void {
    this.resetarFormulario();
  }

  private resetarFormulario(): void {
    this.modoEdicao = false;
    this.categoriaAtual = { id: 0, nome: '', descricao: '' };
  }
}
