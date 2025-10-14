import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editexpenses } from './editexpenses';

describe('Editexpenses', () => {
  let component: Editexpenses;
  let fixture: ComponentFixture<Editexpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editexpenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editexpenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
