import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createsalesinvoice } from './createsalesinvoice';

describe('Createsalesinvoice', () => {
  let component: Createsalesinvoice;
  let fixture: ComponentFixture<Createsalesinvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createsalesinvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createsalesinvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
