import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffNavbarComponent } from '../../../components/staff-navbar/staff-navbar';

interface Categoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-staff-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffNavbarComponent],
  templateUrl: './staff-categories.html'
})
export class StaffCategoriesComponent implements OnInit {
  
  // Dados exigidos na especificação
  categorias: Categoria[] = [
    { id: 1, nome: 'Notebook' },
    { id: 2, nome: 'Desktop' },
    { id: 3, nome: 'Impressora' },
    { id: 4, nome: 'Mouse' },
    { id: 5, nome: 'Teclado' }
  ];

  // Controle do Formulário
  categoriaAtual: Categoria = { id: 0, nome: '' };
  modoEdicao: boolean = false;
  
  // Simulador de Auto-Incremento para o banco
  proximoId: number = 6;

  constructor() {}

  ngOnInit() {}

  salvarCategoria() {
    if (!this.categoriaAtual.nome.trim()) return;

    if (this.modoEdicao) {
      // UPDATE: Atualiza a categoria existente
      const index = this.categorias.findIndex(c => c.id === this.categoriaAtual.id);
      if (index !== -1) {
        this.categorias[index] = { ...this.categoriaAtual };
        console.log(`Categoria #${this.categoriaAtual.id} atualizada para: ${this.categoriaAtual.nome}`);
      }
    } else {
      // CREATE: Insere uma nova categoria
      const novaCategoria = {
        id: this.proximoId++,
        nome: this.categoriaAtual.nome.trim()
      };
      this.categorias.push(novaCategoria);
      console.log(`Nova categoria adicionada: ${novaCategoria.nome}`);
    }

    // Limpa o formulário após salvar
    this.resetarFormulario();
  }

  editarCategoria(cat: Categoria) {
    // READ (Carrega para edição)
    this.modoEdicao = true;
    this.categoriaAtual = { ...cat }; // Usa spread para não alterar a lista antes de salvar
  }

  excluirCategoria(id: number) {
    // DELETE: Remove da lista
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categorias = this.categorias.filter(c => c.id !== id);
      console.log(`Categoria #${id} removida.`);
      
      // Se estava editando a categoria que foi apagada, limpa o formulário
      if (this.categoriaAtual.id === id) {
        this.resetarFormulario();
      }
    }
  }

  cancelar() {
    this.resetarFormulario();
  }

  private resetarFormulario() {
    this.modoEdicao = false;
    this.categoriaAtual = { id: 0, nome: '' };
  }
}