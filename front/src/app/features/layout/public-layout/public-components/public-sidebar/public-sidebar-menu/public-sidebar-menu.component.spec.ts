import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSidebarMenuComponent } from './public-sidebar-menu.component';

describe('PublicSidebarMenuComponent', () => {
  let component: PublicSidebarMenuComponent;
  let fixture: ComponentFixture<PublicSidebarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicSidebarMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicSidebarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


