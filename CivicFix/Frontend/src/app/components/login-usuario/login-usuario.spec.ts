import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { LoginUsuario } from './login-usuario.component';

describe('LoginUsuario', () => {
  let component: LoginUsuario;
  let fixture: ComponentFixture<LoginUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUsuario],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});