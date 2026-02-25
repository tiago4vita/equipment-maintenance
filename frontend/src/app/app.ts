import { Component, OnInit, inject, signal } from '@angular/core';
import { StatusApiService, type ApiStatus } from './status-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly statusApiService = inject(StatusApiService);

  protected readonly title = signal('Equipment Maintenance');
  protected readonly apiStatus = signal<ApiStatus | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadStatus();
  }

  protected loadStatus(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.statusApiService.getStatus().subscribe({
      next: (data) => {
        this.apiStatus.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Nao foi possivel acessar a API. Inicie o Spring Boot em http://localhost:8080.'
        );
        this.loading.set(false);
      }
    });
  }
}
