import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSidebarSubmenuComponent } from './public-sidebar-submenu.component';

describe('PublicSidebarSubmenuComponent', () => {
  let component: PublicSidebarSubmenuComponent;
  let fixture: ComponentFixture<PublicSidebarSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicSidebarSubmenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicSidebarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


