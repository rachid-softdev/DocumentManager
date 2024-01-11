import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSidebarSubmenuComponent } from './user-sidebar-submenu.component';

describe('UserSidebarSubmenuComponent', () => {
  let component: UserSidebarSubmenuComponent;
  let fixture: ComponentFixture<UserSidebarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserSidebarSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSidebarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

