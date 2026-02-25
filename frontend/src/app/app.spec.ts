import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { StatusApiService } from './status-api.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: StatusApiService,
          useValue: {
            getStatus: () =>
              of({
                service: 'equipment-maintenance-api',
                status: 'UP',
                message: 'API REST funcionando',
                timestamp: '2026-02-24T00:00:00'
              })
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Equipment Maintenance');
  });
});
