import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileMenuComponent } from './public-profile-menu.component';

describe('PublicProfileMenuComponent', () => {
  let component: PublicProfileMenuComponent;
  let fixture: ComponentFixture<PublicProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PublicProfileMenuComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


