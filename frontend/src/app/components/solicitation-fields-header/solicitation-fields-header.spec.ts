import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationFieldsHeader } from './solicitation-fields-header';

describe('SolicitationFieldsHeader', () => {
  let component: SolicitationFieldsHeader;
  let fixture: ComponentFixture<SolicitationFieldsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationFieldsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitationFieldsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
