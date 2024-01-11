import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListDeleteComponent } from './category-list-delete.component';

describe('CategoryListDeleteComponent', () => {
  let component: CategoryListDeleteComponent;
  let fixture: ComponentFixture<CategoryListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryListDeleteComponent],
    });
    fixture = TestBed.createComponent(CategoryListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
