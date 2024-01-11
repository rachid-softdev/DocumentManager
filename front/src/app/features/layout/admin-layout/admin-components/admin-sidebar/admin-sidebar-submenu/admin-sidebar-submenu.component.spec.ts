import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidebarSubmenuComponent } from './admin-sidebar-submenu.component';

describe('AdminSidebarSubmenuComponent', () => {
  let component: AdminSidebarSubmenuComponent;
  let fixture: ComponentFixture<AdminSidebarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminSidebarSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidebarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
