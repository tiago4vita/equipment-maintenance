import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { CATEGORIAS, SOLICITACOES } from '../../../database.mock';

@Component({
  selector: 'app-staff-category-report',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-category-report.html'
})
export class StaffCategoryReportComponent implements OnInit {

  funcionarioLogado = 'Maria Silva'; 
  dataGeracao = new Date();

dadosCategoria: any[] = [];

  totalReceita: number = 0;
  totalServicos: number = 0;

  constructor() {}

  ngOnInit() {
    this.processarDadosDoRelatorio();
  }

  processarDadosDoRelatorio() {

    const solicitacoesFaturadas = SOLICITACOES.filter(
      s => s.estado === 'PAGA' || s.estado === 'FINALIZADA'
    );

   
    this.dadosCategoria = CATEGORIAS.map(categoria => {
    
      const servicosDaCategoria = solicitacoesFaturadas.filter(s => s.categoriaId === categoria.id);
      const receitaDaCategoria = servicosDaCategoria.reduce((acc, curr) => acc + (curr.valorOrcamento || 0), 0);

      return {
        categoria: categoria.nome,
        quantidadeServicos: servicosDaCategoria.length,
        valorTotal: receitaDaCategoria
      };
    });

    // 3. Remove categorias que não tiveram nenhum serviço (opcional, para limpar o relatório)
    this.dadosCategoria = this.dadosCategoria.filter(d => d.quantidadeServicos > 0);

    // 4. Calcula os totais gerais do rodapé/cards
    this.totalReceita = this.dadosCategoria.reduce((acc, curr) => acc + curr.valorTotal, 0);
    this.totalServicos = this.dadosCategoria.reduce((acc, curr) => acc + curr.quantidadeServicos, 0);
  }


  gerarPDF() {
    this.dataGeracao = new Date(); // Atualiza a hora exata da impressão
    window.print(); // Chama a impressão do navegador
  }
}
