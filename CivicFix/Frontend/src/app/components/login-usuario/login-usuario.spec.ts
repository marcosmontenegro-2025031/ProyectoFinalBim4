import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { LoginUsuario } from './login-usuario.component';
=======

import { LoginUsuario } from './login-usuario';
>>>>>>> fix-jaquino-2025376

describe('LoginUsuario', () => {
  let component: LoginUsuario;
  let fixture: ComponentFixture<LoginUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUsuario]
<<<<<<< HEAD
    }).compileComponents();

    fixture = TestBed.createComponent(LoginUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
=======
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
>>>>>>> fix-jaquino-2025376
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> fix-jaquino-2025376
