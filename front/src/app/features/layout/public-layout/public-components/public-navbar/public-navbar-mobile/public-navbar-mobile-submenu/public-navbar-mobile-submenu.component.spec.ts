import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNavbarMobileSubmenuComponent } from './public-navbar-mobile-submenu.component';

describe('PublicNavbarMobileSubmenuComponent', () => {
  let component: PublicNavbarMobileSubmenuComponent;
  let fixture: ComponentFixture<PublicNavbarMobileSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicNavbarMobileSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicNavbarMobileSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


