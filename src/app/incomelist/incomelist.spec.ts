import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Incomelist } from './incomelist';

describe('Incomelist', () => {
  let component: Incomelist;
  let fixture: ComponentFixture<Incomelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Incomelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Incomelist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
