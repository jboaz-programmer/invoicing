import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoicedetails } from './invoicedetails';

describe('Invoicedetails', () => {
  let component: Invoicedetails;
  let fixture: ComponentFixture<Invoicedetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Invoicedetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Invoicedetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
