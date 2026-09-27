import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionesAdminComponent } from './asignaciones-admin';

describe('AsignacionesAdminComponent', () => {
  let component: AsignacionesAdminComponent;
  let fixture: ComponentFixture<AsignacionesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesAdminComponent  ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionesAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
