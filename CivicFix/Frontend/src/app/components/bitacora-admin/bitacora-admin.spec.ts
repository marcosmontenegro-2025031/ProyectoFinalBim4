import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BitacoraAdmin } from './bitacora-admin';

describe('BitacoraAdmin', () => {
  let component: BitacoraAdmin;
  let fixture: ComponentFixture<BitacoraAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitacoraAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
