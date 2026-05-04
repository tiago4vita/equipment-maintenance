import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h1>Design System Demo</h1>
      <p class="subtitle">Component showcase and styling reference</p>

      <section class="demo-section">
        <h2>Cards & Layout</h2>
        <div class="cards-grid">
          <div class="card">
            <div class="card-header">Card Title</div>
            <div class="card-body">
              <p>This is a sample card with content demonstration.</p>
            </div>
          </div>
          <div class="card card-accent">
            <div class="card-header">Accent Card</div>
            <div class="card-body">
              <p>Alternative styling for emphasis.</p>
            </div>
          </div>
          <div class="card">
            <div class="card-header">Another Card</div>
            <div class="card-body">
              <p>Multiple cards in a grid layout.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>Typography</h2>
        <p class="text-large">Large text sample</p>
        <p class="text-normal">Normal text for regular content</p>
        <p class="text-small">Small text for secondary information</p>
      </section>

      <section class="demo-section">
        <h2>Buttons & Interactive</h2>
        <div class="button-group">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-outline">Outline</button>
        </div>
      </section>

      <section class="demo-section">
        <h2>Color Palette</h2>
        <div class="color-grid">
          <div class="color-box color-primary"></div>
          <div class="color-box color-secondary"></div>
          <div class="color-box color-success"></div>
          <div class="color-box color-warning"></div>
        </div>
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
  `]
})
export class UiDemoComponent {}