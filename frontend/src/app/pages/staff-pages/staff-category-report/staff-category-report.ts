import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-category-report',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-category-report.html'
})
export class StaffCategoryReportComponent implements OnInit {

  funcionarioLogado = 'Maria Silva'; 
  dataGeracao = new Date();

  // MOCK: Dados consolidados "desde sempre" agrupados pelas categorias do RF017
  dadosCategoria = [
    { categoria: 'Notebook', quantidadeServicos: 45, valorTotal: 12500.00 },
    { categoria: 'Desktop', quantidadeServicos: 32, valorTotal: 8400.50 },
    { categoria: 'Impressora', quantidadeServicos: 18, valorTotal: 3150.00 },
    { categoria: 'Teclado', quantidadeServicos: 12, valorTotal: 850.00 },
    { categoria: 'Mouse', quantidadeServicos: 8, valorTotal: 400.00 }
  ];

  totalReceita: number = 0;
  totalServicos: number = 0;

  constructor() {}

  ngOnInit() {
    this.calcularTotais();
  }

  calcularTotais() {
    // Calcula a soma de tudo para mostrar nos cards superiores
    this.totalReceita = this.dadosCategoria.reduce((acc, curr) => acc + curr.valorTotal, 0);
    this.totalServicos = this.dadosCategoria.reduce((acc, curr) => acc + curr.quantidadeServicos, 0);
  }

  gerarPDF() {
    this.dataGeracao = new Date(); // Atualiza a hora exata do clique
    window.print(); // Chama a janela de impressão nativa do SO/Navegador
  }
}