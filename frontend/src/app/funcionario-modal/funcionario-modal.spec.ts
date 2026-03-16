import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioModal } from './funcionario-modal';

describe('FuncionarioModal', () => {
  let component: FuncionarioModal;
  let fixture: ComponentFixture<FuncionarioModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
