import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavbarMobileMenuComponent } from './user-navbar-mobile-menu.component';

describe('UserNavbarMobileMenuComponent', () => {
  let component: UserNavbarMobileMenuComponent;
  let fixture: ComponentFixture<UserNavbarMobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserNavbarMobileMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNavbarMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

