import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expensespage } from './expensespage';

describe('Expensespage', () => {
  let component: Expensespage;
  let fixture: ComponentFixture<Expensespage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expensespage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Expensespage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
