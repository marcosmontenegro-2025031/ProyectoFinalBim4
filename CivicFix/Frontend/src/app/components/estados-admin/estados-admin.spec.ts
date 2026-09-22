import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadosAdmin } from './estados-admin';

describe('EstadosAdmin', () => {
  let component: EstadosAdmin;
  let fixture: ComponentFixture<EstadosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
