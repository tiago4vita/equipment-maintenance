import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import {
  FiltroReceitasPeriodo,
  ReceitaCategoria,
  ReceitaDiaria,
  RelatorioService
} from '../../../services/relatorio.service';

@Component({
  selector: 'app-staff-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-reports.html'
})
export class StaffReportsComponent implements OnInit {
  private readonly relatorios = inject(RelatorioService);

  protected dataGeracao = new Date();

  protected filtro: FiltroReceitasPeriodo = {
    dataInicio: '',
    dataFim: ''
  };

  protected readonly dadosPorDia = signal<ReceitaDiaria[]>([]);
  protected readonly dadosPorCategoria = signal<ReceitaCategoria[]>([]);
  protected readonly totalReceita = signal(0);
  protected readonly periodoExibicao = signal('Todo o período');

  protected readonly loadingDia = signal(false);
  protected readonly loadingCategoria = signal(false);
  protected readonly baixandoPeriodo = signal(false);
  protected readonly baixandoCategoria = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarDados();
    this.carregarCategorias();
  }

  protected aplicarFiltro(): void {
    this.carregarDados();
  }

  protected carregarDados(): void {
    this.loadingDia.set(true);
    this.errorMessage.set(null);
    this.dataGeracao = new Date();

    const filtro = this.normalizarFiltro();

    this.relatorios.dadosReceitasPeriodo(filtro).subscribe({
      next: (lista) => {
        const ordenada = [...lista].sort((a, b) => a.data.localeCompare(b.data));
        this.dadosPorDia.set(ordenada);
        const total = ordenada.reduce((acc, x) => acc + Number(x.valorTotal ?? 0), 0);
        this.totalReceita.set(total);
        this.atualizarPeriodoExibicao(filtro);
        this.loadingDia.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loadingDia.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível carregar o relatório de receitas por período.'
        );
      }
    });
  }

  protected carregarCategorias(): void {
    this.loadingCategoria.set(true);
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

  protected baixarPdfPeriodo(): void {
    this.baixandoPeriodo.set(true);
    this.errorMessage.set(null);
    const filtro = this.normalizarFiltro();

    this.relatorios.baixarReceitasPeriodo(filtro).subscribe({
      next: (blob) => {
        this.salvarBlob(blob, 'receitas_periodo.pdf');
        this.baixandoPeriodo.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.baixandoPeriodo.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Não foi possível baixar o PDF de receitas por período.'
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

  private normalizarFiltro(): FiltroReceitasPeriodo {
    return {
      dataInicio: this.filtro.dataInicio?.trim() || undefined,
      dataFim: this.filtro.dataFim?.trim() || undefined
    };
  }

  private atualizarPeriodoExibicao(filtro: FiltroReceitasPeriodo): void {
    if (!filtro.dataInicio && !filtro.dataFim) {
      this.periodoExibicao.set('Todo o período');
    } else if (filtro.dataInicio && !filtro.dataFim) {
      this.periodoExibicao.set(`A partir de ${this.formatarDataBr(filtro.dataInicio)}`);
    } else if (!filtro.dataInicio && filtro.dataFim) {
      this.periodoExibicao.set(`Até ${this.formatarDataBr(filtro.dataFim)}`);
    } else if (filtro.dataInicio && filtro.dataFim) {
      this.periodoExibicao.set(
        `De ${this.formatarDataBr(filtro.dataInicio)} a ${this.formatarDataBr(filtro.dataFim)}`
      );
    }
  }

  private formatarDataBr(dataIso: string): string {
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
