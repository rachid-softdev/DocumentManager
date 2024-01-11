import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarMenuComponent } from './admin-navbar-menu.component';

describe('AdminNavbarMenuComponent', () => {
  let component: AdminNavbarMenuComponent;
  let fixture: ComponentFixture<AdminNavbarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminNavbarMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
