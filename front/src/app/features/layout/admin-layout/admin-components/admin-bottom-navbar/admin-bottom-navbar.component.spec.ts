import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBottomNavbarComponent } from './admin-bottom-navbar.component';

describe('AdminBottomNavbarComponent', () => {
  let component: AdminBottomNavbarComponent;
  let fixture: ComponentFixture<AdminBottomNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBottomNavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBottomNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
