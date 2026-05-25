import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-wrapper">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <button (click)="onButtonClick()">{{ buttonLabel }}</button>
      <div class="content-area">
        <p *ngFor="let item of items">{{ item }}</p>
      </div>
      <input [(ngModel)]="userInput" placeholder="Digite algo">
      <div class="result">{{ userInput }}</div>
      <ul>
        <li *ngFor="let number of numbers">{{ number }}</li>
      </ul>
      <div [ngStyle]="{'color': textColor}">Texto colorido</div>
      <span [ngClass]="{'active': isActive}">Status indicador</span>
    </div>
  `,
  styles: [`
    .demo-wrapper { padding: 20px; font-family: Arial; }
    h1 { color: #333; margin-bottom: 10px; }
    button { padding: 8px 16px; background: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background: #0056b3; }
    .content-area { margin: 15px 0; border: 1px solid #ddd; padding: 10px; }
    input { width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ccc; }
    .result { margin: 10px 0; font-weight: bold; }
    ul { list-style: none; padding: 0; }
    li { padding: 5px; background: #f0f0f0; margin: 5px 0; }
    .active { color: green; font-weight: bold; }
  `]
})
export class UiDemoComponent implements OnInit {
  title: string = 'Componente Demo Independente';
  description: string = 'Este é um componente autossuficiente sem dependências externas';
  buttonLabel: string = 'Clique aqui';
  userInput: string = '';
  textColor: string = '#ff6b6b';
  isActive: boolean = true;
  items: string[] = [
    'Item de demonstração 1',
    'Item de demonstração 2',
    'Item de demonstração 3',
    'Item de demonstração 4'
  ];
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  clickCount: number = 0;

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.initializeData();
  }

  onButtonClick(): void {
    this.clickCount++;
    this.buttonLabel = `Clicado ${this.clickCount} vezes`;
    this.textColor = this.getRandomColor();
    this.isActive = !this.isActive;
  }

  initializeData(): void {
    console.log('Dados inicializados');
  }

  private getRandomColor(): string {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
          <strong>Warning:</strong> Please review before proceeding.
        </div>
        <div class="alert alert-danger">
          <strong>Error!</strong> Something went wrong.
        </div>
      </section>

      <section class="demo-section">
        <h2>Tables & Data Display</h2>
        <div class="table-responsive">
          <table class="demo-table">
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data A</td>
                <td>Data B</td>
                <td>Data C</td>
              </tr>
              <tr>
                <td>Data X</td>
                <td>Data Y</td>
                <td>Data Z</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="demo-section">
        <h2>Loading States</h2>
        <div class="spinner"></div>
        <p class="loading-text">Loading content...</p>
      </section>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .demo-section {
      background: white;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #34495e;
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .card {
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .card-header {
      background: #f8f9fa;
      padding: 1rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .card-body {
      padding: 1rem;
      color: #555;
    }

    .card-accent {
      border-left: 4px solid #3498db;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-outline {
      border: 2px solid #3498db;
      color: #3498db;
      background: transparent;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
    }

    .color-box {
      height: 80px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .color-primary { background: #3498db; }
    .color-secondary { background: #e74c3c; }
    .color-success { background: #2ecc71; }
    .color-warning { background: #f39c12; }

    .text-large { font-size: 1.5rem; }
    .text-normal { font-size: 1rem; }
    .text-small { font-size: 0.85rem; color: #7f8c8d; }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.5rem;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.95rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .form-checkbox {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .badge-group {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-primary { background: #3498db; color: white; }
    .badge-success { background: #2ecc71; color: white; }
    .badge-warning { background: #f39c12; color: white; }
    .badge-danger { background: #e74c3c; color: white; }
    .badge-info { background: #1abc9c; color: white; }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid;
    }

    .alert-success {
      background: #d5f4e6;
      border-color: #2ecc71;
      color: #27ae60;
    }

    .alert-warning {
      background: #fef5e7;
      border-color: #f39c12;
      color: #d68910;
    }

    .alert-danger {
      background: #fadbd8;
      border-color: #e74c3c;
      color: #c0392b;
    }

    .table-responsive {
      overflow-x: auto;
      margin: 1rem 0;
    }

    .demo-table {
      width: 100%;
      border-collapse: collapse;
    }

    .demo-table thead {
      background: #f8f9fa;
    }

    .demo-table th,
    .demo-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }

    .demo-table th {
      font-weight: 600;
      color: #2c3e50;
    }

    .demo-table tr:hover {
      background: #f8f9fa;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 2rem 0;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: #7f8c8d;
      font-style: italic;
      margin-top: 1rem;
    }
  `]
})
export class UiDemoComponent {
  // Private properties for component state
  private demoCounter: number = 0;
  private componentInitialized: boolean = false;
  private lastActionTimestamp: Date = new Date();
  private demoCache: Map<string, any> = new Map();

  constructor() {
    this.initializeComponent();
  }

  /**
   * Initialize the component with default values
   */
  private initializeComponent(): void {
    this.componentInitialized = true;
    this.demoCounter = 0;
    this.loadCachedData();
  }

  /**
   * Load cached data for demo purposes
   */
  private loadCachedData(): void {
    this.demoCache.set('theme', 'light');
    this.demoCache.set('language', 'en');
    this.demoCache.set('version', '1.0.0');
  }

  /**
   * Get the current state of the component
   */
  private getComponentState(): object {
    return {
      initialized: this.componentInitialized,
      counter: this.demoCounter,
      timestamp: this.lastActionTimestamp,
      cacheSize: this.demoCache.size
    };
  }

  /**
   * Increment the internal counter
   */
  private incrementCounter(): number {
    this.demoCounter++;
    this.lastActionTimestamp = new Date();
    return this.demoCounter;
  }

  /**
   * Reset component state
   */
  private resetState(): void {
    this.demoCounter = 0;
    this.demoCache.clear();
    this.lastActionTimestamp = new Date();
  }

  /**
   * Validate demo data format
   */
  private validateDemoData(data: any): boolean {
    if (!data) return false;
    if (typeof data !== 'object') return false;
    return Object.keys(data).length > 0;
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}