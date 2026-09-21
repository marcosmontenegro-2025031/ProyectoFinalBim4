import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeUsuario } from './home-usuario';

describe('HomeUsuario', () => {
  let component: HomeUsuario;
  let fixture: ComponentFixture<HomeUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
