import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterUsuario } from './register-usuario';

describe('RegisterUsuario', () => {
  let component: RegisterUsuario;
  let fixture: ComponentFixture<RegisterUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
