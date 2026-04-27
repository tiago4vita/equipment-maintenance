import { Component, inject } from '@angular/core';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toast.message(); as msg) {
      <div
        class="pointer-events-auto fixed bottom-6 right-6 z-[1000] max-w-md rounded-lg border border-gray-200 bg-gray-900 px-4 py-3 text-sm text-white shadow-lg [font-family:'Inter',sans-serif]"
        role="status"
        aria-live="polite"
      >
        {{ msg }}
      </div>
    }
  `
})
export class AppToastComponent {
  protected readonly toast = inject(ToastService);
}
