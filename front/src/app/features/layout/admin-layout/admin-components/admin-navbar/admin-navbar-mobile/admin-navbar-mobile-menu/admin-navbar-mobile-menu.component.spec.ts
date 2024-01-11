import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarMobileMenuComponent } from './admin-navbar-mobile-menu.component';

describe('AdminNavbarMobileMenuComponent', () => {
  let component: AdminNavbarMobileMenuComponent;
  let fixture: ComponentFixture<AdminNavbarMobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminNavbarMobileMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavbarMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
