import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiposIncidenciaAdmin } from './tipos-incidencia-admin';

describe('TiposIncidenciaAdmin', () => {
  let component: TiposIncidenciaAdmin;
  let fixture: ComponentFixture<TiposIncidenciaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposIncidenciaAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(TiposIncidenciaAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
