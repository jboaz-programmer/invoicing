import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editincomepage } from './editincomepage';
 
 
describe('Editincomepage', () => {
  let component: Editincomepage;
  let fixture: ComponentFixture<Editincomepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editincomepage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editincomepage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
