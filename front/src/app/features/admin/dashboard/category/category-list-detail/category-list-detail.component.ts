import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseCategoryResponse } from '../../../../../core/models/category/http/response/base-category-response.model';

@Component({
  selector: 'app-category-list-detail',
  templateUrl: './category-list-detail.component.html',
  styleUrls: ['./category-list-detail.component.css'],
})
export class CategoryListDetailComponent {
  private _category: BaseCategoryResponse | null = null;
  private _parentCategory: BaseCategoryResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();

  public get getCategory(): BaseCategoryResponse | null {
    return this._category;
  }

  @Input()
  public set setCategory(category: BaseCategoryResponse | null) {
    this._category = category;
  }

  public get getParentCategory(): BaseCategoryResponse | null {
    return this._parentCategory;
  }

  @Input()
  public set setParentCategory(parentCategory: BaseCategoryResponse | null) {
    this._parentCategory = parentCategory;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }
}
