import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNavbarSubmenuComponent } from './public-navbar-submenu.component';

describe('PublicNavbarSubmenuComponent', () => {
  let component: PublicNavbarSubmenuComponent;
  let fixture: ComponentFixture<PublicNavbarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicNavbarSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicNavbarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


