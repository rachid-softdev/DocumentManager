import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavbarSubmenuComponent } from './user-navbar-submenu.component';

describe('UserNavbarSubmenuComponent', () => {
  let component: UserNavbarSubmenuComponent;
  let fixture: ComponentFixture<UserNavbarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserNavbarSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNavbarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

