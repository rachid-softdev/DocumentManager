import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNavbarMobileComponent } from './public-navbar-mobilecomponent';

describe('PublicNavbarMobileComponent', () => {
  let component: PublicNavbarMobileComponent;
  let fixture: ComponentFixture<PublicNavbarMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicNavbarMobileComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicNavbarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


