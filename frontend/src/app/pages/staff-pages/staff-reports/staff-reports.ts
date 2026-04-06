import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { CATEGORIAS, SOLICITACOES } from '../../../database.mock';

type SolicitacaoMock = (typeof SOLICITACOES)[number];

interface DiaReceita {
  data: string;
  quantidadeServicos: number;
  valorTotal: number;
}

interface LinhaCategoria {
  categoria: string;
  quantidadeServicos: number;
  valorTotal: number;
}

@Component({
  selector: 'app-staff-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-reports.html'
})
export class StaffReportsComponent implements OnInit {
  funcionarioLogado = 'Mário Souza';
  dataGeracao = new Date();

  filtro = {
    dataInicio: '',
    dataFim: ''
  };

  /** Quando ativo, aplica `selectedCategoryIds` em receita diária e por categoria. */
  categoryFilterEnabled = false;

  /** IDs selecionados (quando o filtro está ativo). */
  selectedCategoryIds: number[] = [];

  dadosFiltrados: SolicitacaoMock[] = [];
  dadosPorDia: DiaReceita[] = [];
  dadosPorCategoria: LinhaCategoria[] = [];

  totalReceita = 0;
  totalServicos = 0;
  periodoExibicao = 'Todo o período';

  readonly categorias = CATEGORIAS;

  ngOnInit(): void {
    this.selectedCategoryIds = CATEGORIAS.map((c) => c.id);
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    this.dataGeracao = new Date();

    let base = SOLICITACOES.filter(
      (s) => s.estado === 'PAGA' || s.estado === 'FINALIZADA'
    ) as SolicitacaoMock[];

    if (this.categoryFilterEnabled) {
      const set = new Set(this.selectedCategoryIds);
      base = base.filter((s) => set.has(s.categoriaId));
    }

    this.dadosFiltrados = base.filter((s) => this.passDateFilter(s));

    this.buildPorDia();
    this.buildPorCategoria();
    this.calcularTotais();
    this.gerarTextoPeriodo();
  }

  toggleCategoryFilter(): void {
    this.categoryFilterEnabled = !this.categoryFilterEnabled;
    if (this.categoryFilterEnabled && this.selectedCategoryIds.length === 0) {
      this.selectedCategoryIds = CATEGORIAS.map((c) => c.id);
    }
    this.aplicarFiltro();
  }

  toggleCategoryId(id: number): void {
    const idx = this.selectedCategoryIds.indexOf(id);
    if (idx === -1) {
      this.selectedCategoryIds = [...this.selectedCategoryIds, id];
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter((x) => x !== id);
    }
    if (this.categoryFilterEnabled) {
      this.aplicarFiltro();
    }
  }

  isCategorySelected(id: number): boolean {
    return this.selectedCategoryIds.includes(id);
  }

  gerarPDF(): void {
    window.print();
  }

  formatarDataBr(dataString: string): string {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private passDateFilter(s: SolicitacaoMock): boolean {
    const dataItem = new Date(this.getDataFaturamentoIso(s)).getTime();
    if (this.filtro.dataInicio) {
      const inicio = new Date(this.filtro.dataInicio).getTime();
      if (dataItem < inicio) return false;
    }
    if (this.filtro.dataFim) {
      const fim = new Date(this.filtro.dataFim).getTime();
      if (dataItem > fim + 86400000) return false;
    }
    return true;
  }

  /** Data usada no agrupamento diário (pagamento, se existir). */
  private getDataFaturamentoIso(s: SolicitacaoMock): string {
    const h = s.historico ?? [];
    const paga = [...h].reverse().find((e: { status?: string }) => e.status === 'PAGA');
    if (paga && 'dataHora' in paga) {
      return (paga as { dataHora: string }).dataHora.split('T')[0];
    }
    const fin = [...h].reverse().find((e: { status?: string }) => e.status === 'FINALIZADA');
    if (fin && 'dataHora' in fin) {
      return (fin as { dataHora: string }).dataHora.split('T')[0];
    }
    return s.dataAbertura.split('T')[0];
  }

  private buildPorDia(): void {
    const map = new Map<string, { q: number; v: number }>();
    for (const s of this.dadosFiltrados) {
      const d = this.getDataFaturamentoIso(s);
      const valor = s.valorOrcamento ?? 0;
      const cur = map.get(d) ?? { q: 0, v: 0 };
      cur.q += 1;
      cur.v += valor;
      map.set(d, cur);
    }
    this.dadosPorDia = [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, { q, v }]) => ({
        data,
        quantidadeServicos: q,
        valorTotal: v
      }));
  }

  private buildPorCategoria(): void {
    const byCat = new Map<number, { q: number; v: number }>();
    for (const s of this.dadosFiltrados) {
      const id = s.categoriaId;
      const valor = s.valorOrcamento ?? 0;
      const cur = byCat.get(id) ?? { q: 0, v: 0 };
      cur.q += 1;
      cur.v += valor;
      byCat.set(id, cur);
    }

    this.dadosPorCategoria = CATEGORIAS.map((c) => {
      const agg = byCat.get(c.id) ?? { q: 0, v: 0 };
      return {
        categoria: c.nome,
        quantidadeServicos: agg.q,
        valorTotal: agg.v
      };
    }).filter((row) => row.quantidadeServicos > 0);
  }

  private calcularTotais(): void {
    this.totalReceita = this.dadosFiltrados.reduce(
      (acc, s) => acc + (s.valorOrcamento ?? 0),
      0
    );
    this.totalServicos = this.dadosFiltrados.length;
  }

  private gerarTextoPeriodo(): void {
    if (!this.filtro.dataInicio && !this.filtro.dataFim) {
      this.periodoExibicao = 'Todo o período';
    } else if (this.filtro.dataInicio && !this.filtro.dataFim) {
      this.periodoExibicao = `A partir de ${this.formatarDataBr(this.filtro.dataInicio)}`;
    } else if (!this.filtro.dataInicio && this.filtro.dataFim) {
      this.periodoExibicao = `Até ${this.formatarDataBr(this.filtro.dataFim)}`;
    } else {
      this.periodoExibicao = `De ${this.formatarDataBr(this.filtro.dataInicio)} a ${this.formatarDataBr(this.filtro.dataFim)}`;
    }
  }
}
