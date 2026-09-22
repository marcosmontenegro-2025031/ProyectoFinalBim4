import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpleadosAdmin } from './empleados-admin';

describe('EmpleadosAdmin', () => {
  let component: EmpleadosAdmin;
  let fixture: ComponentFixture<EmpleadosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
