import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarMobileComponent } from './admin-navbar-mobilecomponent';

describe('AdminNavbarMobileComponent', () => {
  let component: AdminNavbarMobileComponent;
  let fixture: ComponentFixture<AdminNavbarMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminNavbarMobileComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavbarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
