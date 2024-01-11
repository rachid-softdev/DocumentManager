import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavbarMobileSubmenuComponent } from './user-navbar-mobile-submenu.component';

describe('UserNavbarMobileSubmenuComponent', () => {
  let component: UserNavbarMobileSubmenuComponent;
  let fixture: ComponentFixture<UserNavbarMobileSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserNavbarMobileSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNavbarMobileSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

