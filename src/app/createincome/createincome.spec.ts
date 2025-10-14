import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createincome } from './createincome';

describe('Createincome', () => {
  let component: Createincome;
  let fixture: ComponentFixture<Createincome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createincome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createincome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
