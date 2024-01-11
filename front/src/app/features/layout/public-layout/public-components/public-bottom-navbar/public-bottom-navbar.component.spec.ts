import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBottomNavbarComponent } from './public-bottom-navbar.component';

describe('PublicBottomNavbarComponent', () => {
  let component: PublicBottomNavbarComponent;
  let fixture: ComponentFixture<PublicBottomNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBottomNavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBottomNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


