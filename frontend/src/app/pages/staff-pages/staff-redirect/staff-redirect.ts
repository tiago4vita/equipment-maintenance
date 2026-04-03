import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o ngModel
import { Router, ActivatedRoute } from '@angular/router';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-redirect',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-redirect.html',
})
export class StaffRedirectComponent implements OnInit {
  solicitacaoId: number = 0;
  funcionarioDestinoId: number | null = null;
  

  funcionarioLogadoId: number = 1; 


  dadosSolicitacao = {
    cliente: { nome: 'Marcos Mello' },
    produto: 'Monitor Samsung 24"',
    estado: 'aprovada',
    dataAtualizacao: '03/04/2026 15:30',
    descricaoDefeito: 'A tela apresenta listras horizontais verdes intermitentes e desliga sozinha após cerca de 20 minutos de uso contínuo.'
  };

  todosFuncionarios = [
    { id: 1, nome: 'João Silva', cargo: 'Técnico Senior' }, 
    { id: 2, nome: 'Maria Santos', cargo: 'Técnica Pleno' },
    { id: 3, nome: 'Pedro Costa', cargo: 'Especialista em Monitores' },
    { id: 4, nome: 'Ana Oliveira', cargo: 'Técnica Junior' }
  ];

  funcionariosDisponiveis: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id')) || 8492;

    // Regra do RF015: "não pode ser redirecionada para si mesmo"
    // Filtramos a lista para remover o funcionário logado
    this.funcionariosDisponiveis = this.todosFuncionarios.filter(
      func => func.id !== this.funcionarioLogadoId
    );
  }

redirecionar() {
    if (!this.funcionarioDestinoId) return;

    // Convertendo explicitamente para número para evitar erros de tipagem
    const idBuscado = Number(this.funcionarioDestinoId);
    const funcDestino = this.funcionariosDisponiveis.find(f => f.id === idBuscado);

    if (!funcDestino) {
      console.error('Funcionário destino não encontrado!');
      return;
    }

    console.log('--- REDIRECIONAMENTO EXECUTADO ---');
    console.log(`Solicitação: #${this.solicitacaoId}`);
    console.log(`Novo Estado: REDIRECIONADA`);
    console.log(`Funcionário Origem (ID): ${this.funcionarioLogadoId}`);
    console.log(`Funcionário Destino (ID): ${funcDestino.id} - ${funcDestino.nome}`);
    console.log(`Data/Hora: ${new Date().toLocaleString()}`);
    
    this.router.navigate(['/staff/home']);
  }
  voltar() {
    // Volta para a tela anterior
    this.router.navigate(['/staff/home']);
  }
}