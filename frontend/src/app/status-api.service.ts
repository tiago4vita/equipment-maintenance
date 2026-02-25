import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiStatus {
  service: string;
  status: string;
  message: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class StatusApiService {
  private readonly http = inject(HttpClient);

  getStatus(): Observable<ApiStatus> {
    return this.http.get<ApiStatus>('/api/status');
  }
}
