import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashbank } from './cashbank';

describe('Cashbank', () => {
  let component: Cashbank;
  let fixture: ComponentFixture<Cashbank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cashbank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cashbank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
