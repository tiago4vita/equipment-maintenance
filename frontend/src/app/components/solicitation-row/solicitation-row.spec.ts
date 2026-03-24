import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationRow } from './solicitation-row';

describe('SolicitationRow', () => {
  let component: SolicitationRow;
  let fixture: ComponentFixture<SolicitationRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitationRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
