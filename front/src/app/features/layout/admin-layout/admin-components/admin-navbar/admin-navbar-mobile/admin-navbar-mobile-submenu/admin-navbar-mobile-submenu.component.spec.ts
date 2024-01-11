import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarMobileSubmenuComponent } from './admin-navbar-mobile-submenu.component';

describe('AdminNavbarMobileSubmenuComponent', () => {
  let component: AdminNavbarMobileSubmenuComponent;
  let fixture: ComponentFixture<AdminNavbarMobileSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminNavbarMobileSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavbarMobileSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
