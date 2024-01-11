import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBottomNavbarComponent } from './user-bottom-navbar.component';

describe('UserBottomNavbarComponent', () => {
  let component: UserBottomNavbarComponent;
  let fixture: ComponentFixture<UserBottomNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBottomNavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBottomNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

