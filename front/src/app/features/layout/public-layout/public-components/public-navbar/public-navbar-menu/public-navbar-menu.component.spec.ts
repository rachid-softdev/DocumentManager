import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNavbarMenuComponent } from './public-navbar-menu.component';

describe('PublicNavbarMenuComponent', () => {
  let component: PublicNavbarMenuComponent;
  let fixture: ComponentFixture<PublicNavbarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicNavbarMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicNavbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


