import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { EmpleadoLogin } from './empleado-login.component';
=======
import { EmpleadoLogin } from './empleado-login';
>>>>>>> fix-jaquino-2025376

describe('EmpleadoLogin', () => {
  let component: EmpleadoLogin;
  let fixture: ComponentFixture<EmpleadoLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
