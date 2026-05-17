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

      <section class="demo-section">
        <h2>Form Elements</h2>
        <div class="form-group">
          <label>Text Input</label>
          <input type="text" placeholder="Enter text" class="form-control">
        </div>
        <div class="form-group">
          <label>Select Dropdown</label>
          <select class="form-control">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div class="form-group">
          <label>Checkbox</label>
          <input type="checkbox" class="form-checkbox">
          <span>Enable feature</span>
        </div>
      </section>

      <section class="demo-section">
        <h2>Badges & Status</h2>
        <div class="badge-group">
          <span class="badge badge-primary">Active</span>
          <span class="badge badge-success">Completed</span>
          <span class="badge badge-warning">Pending</span>
          <span class="badge badge-danger">Error</span>
          <span class="badge badge-info">Info</span>
        </div>
      </section>

      <section class="demo-section">
        <h2>Alerts & Messages</h2>
        <div class="alert alert-success">
          <strong>Success!</strong> Operation completed successfully.
        </div>
        <div class="alert alert-warning">
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