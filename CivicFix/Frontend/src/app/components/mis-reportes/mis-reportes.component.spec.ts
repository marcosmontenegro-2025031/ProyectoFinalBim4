import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisReportesComponent } from './mis-reportes.component';

describe('MisReportes', () => {
  let component: MisReportesComponent;
  let fixture: ComponentFixture<MisReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisReportesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MisReportesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

