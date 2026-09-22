import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrioridadesAdmin } from './prioridades-admin';

describe('PrioridadesAdmin', () => {
  let component: PrioridadesAdmin;
  let fixture: ComponentFixture<PrioridadesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioridadesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(PrioridadesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
