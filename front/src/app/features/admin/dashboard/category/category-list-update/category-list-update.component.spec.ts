import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListCreateComponent } from './category-list-create.component';

describe('CategoryListCreateComponent', () => {
  let component: CategoryListCreateComponent;
  let fixture: ComponentFixture<CategoryListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryListCreateComponent],
    });
    fixture = TestBed.createComponent(CategoryListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
