import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavbarMobileComponent } from './user-navbar-mobilecomponent';

describe('UserNavbarMobileComponent', () => {
  let component: UserNavbarMobileComponent;
  let fixture: ComponentFixture<UserNavbarMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserNavbarMobileComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNavbarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

