import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioRedireccional } from './formulario-redireccional.component';

describe('FormularioRedireccional', () => {
  let component: FormularioRedireccional;
  let fixture: ComponentFixture<FormularioRedireccional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioRedireccional],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioRedireccional);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
