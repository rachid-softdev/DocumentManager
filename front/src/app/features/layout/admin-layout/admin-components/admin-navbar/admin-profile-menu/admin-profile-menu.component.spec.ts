import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileMenuComponent } from './admin-profile-menu.component';

describe('AdminProfileMenuComponent', () => {
  let component: AdminProfileMenuComponent;
  let fixture: ComponentFixture<AdminProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminProfileMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
