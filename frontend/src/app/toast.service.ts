import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);

  private hideTimer: ReturnType<typeof setTimeout> | undefined;

  show(text: string, durationMs = 8000): void {
    if (this.hideTimer !== undefined) {
      clearTimeout(this.hideTimer);
    }
    this.message.set(text);
    this.hideTimer = setTimeout(() => {
      this.message.set(null);
      this.hideTimer = undefined;
    }, durationMs);
  }
}
