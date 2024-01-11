import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavbarMenuComponent } from './user-navbar-menu.component';

describe('UserNavbarMenuComponent', () => {
  let component: UserNavbarMenuComponent;
  let fixture: ComponentFixture<UserNavbarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserNavbarMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNavbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

