import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

@Component({
  selector: 'app-staff-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-employees.html'
})
export class StaffEmployeesComponent implements OnInit {
  private readonly auth = inject(AuthService);

  /** ID do funcionário autenticado (JWT / sessão). */
  funcionarioLogadoId = 1;

  // Dados exigidos pela especificação (Maria e Mário)
  funcionarios = [
    { 
      id: 1, 
      nome: 'Maria Silva', 
      email: 'maria@empresa.com', 
      dataNascimento: '1990-05-15', 
      senha: '123' // Apenas ilustrativo no front-end
    },
    { 
      id: 2, 
      nome: 'Mário Souza', 
      email: 'mario@empresa.com', 
      dataNascimento: '1985-11-22', 
      senha: '456' 
    }
  ];

  // Controle de Estado do Formulário
  formulario = { id: 0, nome: '', email: '', dataNascimento: '', senha: '' };
  modoEdicao: boolean = false;
  
  // Simulador de Auto-Incremento para Banco de Dados
  proximoId: number = 3;

  constructor() {}

  ngOnInit(): void {
    const id = this.auth.getUserId();
    if (id != null) {
      this.funcionarioLogadoId = id;
    }
  }


  getMotivoBloqueioExclusao(idFuncionario: number): string {
    if (this.funcionarios.length === 1) {
      return "Não é possível excluir o único funcionário do sistema.";
    }
    if (idFuncionario === this.funcionarioLogadoId) {
      return "Você não pode excluir sua própria conta.";
    }
    return "Excluir funcionário";
  }


  salvar() {
    if (!this.formularioValido()) return;

    // Regra: E-mail deve ser único
    const emailExistente = this.funcionarios.find(
      f => f.email === this.formulario.email && f.id !== this.formulario.id
    );

    if (emailExistente) {
      alert('Erro: Este e-mail já está em uso por outro funcionário.');
      return;
    }

    if (this.modoEdicao) {
      // UPDATE
      const index = this.funcionarios.findIndex(f => f.id === this.formulario.id);
      if (index !== -1) {
        this.funcionarios[index] = { ...this.formulario };
        console.log(`Funcionário #${this.formulario.id} atualizado.`);
      }
    } else {
      // CREATE
      const novoFuncionario = {
        ...this.formulario,
        id: this.proximoId++
      };
      this.funcionarios.push(novoFuncionario);
      console.log(`Novo funcionário cadastrado: ${novoFuncionario.nome}`);
    }

    this.resetarFormulario();
  }

  editar(func: any) {

    this.modoEdicao = true;
    this.formulario = { ...func };
  }

  excluir(id: number) {

    if (id === this.funcionarioLogadoId) {
      alert("Operação negada: Você não pode remover a si mesmo.");
      return;
    }
    if (this.funcionarios.length === 1) {
      alert("Operação negada: O sistema deve ter no mínimo um funcionário.");
      return;
    }

    if (confirm('Tem certeza que deseja excluir este funcionário permanentemente?')) {
      this.funcionarios = this.funcionarios.filter(f => f.id !== id);
      console.log(`Funcionário #${id} removido.`);
      
      if (this.formulario.id === id) {
        this.resetarFormulario();
      }
    }
  }

  formularioValido(): boolean {
    return !!(this.formulario.nome.trim() && 
              this.formulario.email.trim() && 
              this.formulario.dataNascimento && 
              this.formulario.senha.trim());
  }

  formularioTemDados(): boolean {
    return !!(this.formulario.nome || this.formulario.email || this.formulario.dataNascimento || this.formulario.senha);
  }

  cancelar() {
    this.resetarFormulario();
  }

  private resetarFormulario() {
    this.modoEdicao = false;
    this.formulario = { id: 0, nome: '', email: '', dataNascimento: '', senha: '' };
  }
}