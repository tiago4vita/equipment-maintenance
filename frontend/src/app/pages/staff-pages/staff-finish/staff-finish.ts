import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';
import { SOLICITACOES, CLIENTES, FUNCIONARIOS } from '../../../database.mock';

@Component({
  selector: 'app-staff-finish',
  standalone: true,
  imports: [CommonModule, StaffNavbarComponent],
  templateUrl: './staff-finish.html'
})
export class StaffFinishComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  solicitacaoId: number = 0;
  dataAtual: Date = new Date();
  

  solicitacaoAtual: any;
  cliente: any;
  tecnicoNome: string = 'Não atribuído';
  funcionarioLogado = { id: 1, nome: 'Mário' };  //usuario logado simulado

  ngOnInit() {

    const idParam = this.route.snapshot.paramMap.get('id');
    this.solicitacaoId = Number(idParam);

    if (this.solicitacaoId) {
      this.solicitacaoAtual = SOLICITACOES.find(s => s.id === this.solicitacaoId);

      if (this.solicitacaoAtual) {
  
        this.cliente = CLIENTES.find(c => c.id === this.solicitacaoAtual.clienteId);
        

        const tecnico = FUNCIONARIOS.find(f => f.id === 2); 
        this.tecnicoNome = tecnico?.nome || 'Técnico Externo';
      }
    }
  }

  finalizar() {
    console.log('--- FINALIZAÇÃO REAL ---');
    console.log(`Solicitação #${this.solicitacaoId} FINALIZADA por ${this.funcionarioLogado.nome}`);
    this.router.navigate(['/staff/all-requests']);
  }

  voltar() {
    this.router.navigate(['/staff/all-requests']);
  }
}