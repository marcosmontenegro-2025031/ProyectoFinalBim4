import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartamentosAdmin } from './departamentos-admin';

describe('DepartamentosAdmin', () => {
  let component: DepartamentosAdmin;
  let fixture: ComponentFixture<DepartamentosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
