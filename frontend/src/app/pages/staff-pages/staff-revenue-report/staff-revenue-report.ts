import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-revenue-report',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-revenue-report.html'
})
export class StaffRevenueReportComponent implements OnInit {

  funcionarioLogado = 'Mário Souza'; // Mock do usuário logado
  dataGeracao = new Date();

  // Controle de Filtro (Podem ser vazios conforme RF019)
  filtro = {
    dataInicio: '',
    dataFim: ''
  };


  dadosBrutos = [
    { data: '2026-03-30', quantidadeServicos: 2, valorTotal: 450.00 },
    { data: '2026-03-31', quantidadeServicos: 1, valorTotal: 120.00 },
    { data: '2026-04-01', quantidadeServicos: 3, valorTotal: 850.50 },
    { data: '2026-04-02', quantidadeServicos: 1, valorTotal: 300.00 },
    { data: '2026-04-03', quantidadeServicos: 4, valorTotal: 1250.00 }
  ];

  dadosFiltrados: any[] = [];
  
  // Resumos da tela
  totalReceita: number = 0;
  totalServicos: number = 0;
  periodoExibicao: string = 'Todo o período';

  constructor() {}

  ngOnInit() {
    // Ao iniciar, carrega todos os dados (pois o filtro inicia vazio)
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    // Atualiza a data de geração para o PDF
    this.dataGeracao = new Date();

    // Filtra os dados com base nas datas selecionadas
    this.dadosFiltrados = this.dadosBrutos.filter(item => {
      let passaFiltro = true;
      const dataItem = new Date(item.data).getTime();

      if (this.filtro.dataInicio) {
        const inicio = new Date(this.filtro.dataInicio).getTime();
        if (dataItem < inicio) passaFiltro = false;
      }

      if (this.filtro.dataFim) {
        const fim = new Date(this.filtro.dataFim).getTime();
        if (dataItem > fim + 86400000) passaFiltro = false; 
      }

      return passaFiltro;
    });

    // Recalcula os totais
    this.calcularTotais();
    this.gerarTextoPeriodo();
  }

  calcularTotais() {
    this.totalReceita = this.dadosFiltrados.reduce((acc, curr) => acc + curr.valorTotal, 0);
    this.totalServicos = this.dadosFiltrados.reduce((acc, curr) => acc + curr.quantidadeServicos, 0);
  }

  gerarTextoPeriodo() {
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

  formatarDataBr(dataString: string): string {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  gerarPDF() {
    window.print();
  }
}