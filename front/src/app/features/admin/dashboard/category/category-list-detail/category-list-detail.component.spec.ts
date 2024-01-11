import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListDetailComponent } from './category-list-detail.component';

describe('CategoryListDetailComponent', () => {
  let component: CategoryListDetailComponent;
  let fixture: ComponentFixture<CategoryListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryListDetailComponent],
    });
    fixture = TestBed.createComponent(CategoryListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
