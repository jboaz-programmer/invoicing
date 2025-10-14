import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salesinvoice } from './salesinvoice';

describe('Salesinvoice', () => {
  let component: Salesinvoice;
  let fixture: ComponentFixture<Salesinvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salesinvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salesinvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
