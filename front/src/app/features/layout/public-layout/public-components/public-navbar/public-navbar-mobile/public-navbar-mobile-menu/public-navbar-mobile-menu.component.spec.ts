import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNavbarMobileMenuComponent } from './public-navbar-mobile-menu.component';

describe('PublicNavbarMobileMenuComponent', () => {
  let component: PublicNavbarMobileMenuComponent;
  let fixture: ComponentFixture<PublicNavbarMobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicNavbarMobileMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicNavbarMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


