import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarSubmenuComponent } from './admin-navbar-submenu.component';

describe('AdminNavbarSubmenuComponent', () => {
  let component: AdminNavbarSubmenuComponent;
  let fixture: ComponentFixture<AdminNavbarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminNavbarSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavbarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
