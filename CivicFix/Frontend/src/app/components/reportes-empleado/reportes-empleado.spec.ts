import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesEmpleado } from './reportes-empleado';

describe('ReportesEmpleado', () => {
  let component: ReportesEmpleado;
  let fixture: ComponentFixture<ReportesEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesEmpleado],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesEmpleado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
