import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createexpenses } from './createexpenses';

describe('Createexpenses', () => {
  let component: Createexpenses;
  let fixture: ComponentFixture<Createexpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createexpenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createexpenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
