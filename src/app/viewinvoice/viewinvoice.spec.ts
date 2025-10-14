import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewinvoice } from './viewinvoice';

describe('Viewinvoice', () => {
  let component: Viewinvoice;
  let fixture: ComponentFixture<Viewinvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewinvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewinvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
