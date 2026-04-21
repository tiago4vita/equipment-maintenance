import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { ReceitaCategoria, RelatorioService } from '../../../services/relatorio.service';

@Component({
  selector: 'app-staff-reports-by-category',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-reports-by-category.html'
})
export class StaffReportsByCategoryComponent implements OnInit {
  private readonly relatorios = inject(RelatorioService);

  protected readonly dadosPorCategoria = signal<ReceitaCategoria[]>([]);
  protected readonly loadingCategoria = signal(false);
  protected readonly baixandoCategoria = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarCategorias();
  }

  protected carregarCategorias(): void {
    this.loadingCategoria.set(true);
    this.errorMessage.set(null);
    this.relatorios.dadosReceitasCategoria().subscribe({
      next: (lista) => {
        this.dadosPorCategoria.set(lista);
        this.loadingCategoria.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loadingCategoria.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar o relatório por categoria.'
        );
      }
    });
  }

  protected baixarPdfCategoria(): void {
    this.baixandoCategoria.set(true);
    this.errorMessage.set(null);

    this.relatorios.baixarReceitasCategoria().subscribe({
      next: (blob) => {
        this.salvarBlob(blob, 'receitas_categoria.pdf');
        this.baixandoCategoria.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.baixandoCategoria.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível baixar o PDF de receitas por categoria.'
        );
      }
    });
  }

  private salvarBlob(blob: Blob, nomeArquivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
