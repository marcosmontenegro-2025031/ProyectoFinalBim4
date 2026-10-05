import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeCivicfix } from './home-civicfix';

describe('HomeCivicfix', () => {
  let component: HomeCivicfix;
  let fixture: ComponentFixture<HomeCivicfix>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCivicfix],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCivicfix);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
