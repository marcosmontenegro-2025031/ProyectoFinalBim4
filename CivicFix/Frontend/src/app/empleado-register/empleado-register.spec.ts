import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpleadoRegister } from './empleado-register.component';

describe('EmpleadoRegister', () => {
  let component: EmpleadoRegister;
  let fixture: ComponentFixture<EmpleadoRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
