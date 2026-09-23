import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BitacoraEmpleado } from './bitacora-empleado';

describe('BitacoraEmpleado', () => {
  let component: BitacoraEmpleado;
  let fixture: ComponentFixture<BitacoraEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacoraEmpleado],
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraEmpleado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
