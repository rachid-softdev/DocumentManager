import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../../core/services/category/category.service';
import { CategoryResponse } from '../../../../core/models/category/http/response/category-response.model';
import { BaseCategoryResponse } from '../../../../core/models/category/http/response/base-category-response.model';
import { CategoryMapper } from '../../../../core/models/category/http/mapper/category-mapper.model';
import { CategoryResponseAPI } from '../../../../core/models/category/http/response/category-response-api.model';

enum DialogType {
  AddCategory,
  CategoryUpdate,
  CategoryDetail,
  CategoryDelete,
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryService],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private _collapsing: boolean = false;

  public get getCollapsing(): boolean {
    return this._collapsing;
  }
  public set setCollapsing(collapsing: boolean) {
    this._collapsing = collapsing;
  }

  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddCategory]: false,
    [DialogType.CategoryUpdate]: false,
    [DialogType.CategoryDetail]: false,
    [DialogType.CategoryDelete]: false,
  };

  private _categories: CategoryResponse[] = [];
  private _selectedCategory: BaseCategoryResponse | null = null;
  private _newCategory: BaseCategoryResponse = new BaseCategoryResponse();

  ngOnInit(): void {
    const defaultCategorys: CategoryResponse[] = [
      new CategoryResponse('id-1', 'Sport', 'Description sport', [
        new CategoryResponse('id-2', 'Sport', 'Description sport'),
        new CategoryResponse('id-2', 'Sport', 'Description sport', [
          new CategoryResponse('id-2', 'Sport', 'Description sport'),
        ]),
      ]),
      new CategoryResponse('id-2', 'Sport', 'Description sport'),
      new CategoryResponse('id-3', 'Sport', 'Description sport'),
    ];
    this._categories = defaultCategorys;
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this._categories = [];
  }

  constructor(private _categoryService: CategoryService, private _categoryMapper: CategoryMapper) {}

  public get getCategoryService(): CategoryService {
    return this._categoryService;
  }

  public get getCategoryMapper(): CategoryMapper {
    return this._categoryMapper;
  }

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getCategories(): CategoryResponse[] {
    return this._categories;
  }

  public set setCategories(categories: CategoryResponse[]) {
    this._categories = categories;
  }

  public get getNewCategory(): BaseCategoryResponse {
    return this._newCategory;
  }

  public set setNewCategory(newCategory: BaseCategoryResponse) {
    this._newCategory = newCategory;
  }

  public get getSelectedCategory(): BaseCategoryResponse | null {
    return this._selectedCategory;
  }

  public set setSelectedCategory(category: BaseCategoryResponse | null) {
    this._selectedCategory = category;
  }

  searchByName: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value;
      if (!value || value.length === 0) {
        this.loadCategories();
        return;
      }
      this.searchByName = value;
      this.setCategories = this._categories.filter((category) =>
        category.getName.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public loadCategories(): void {
    this._categoryService.getAllCategories().subscribe((response: CategoryResponseAPI[]) => {
      this.setCategories = response.map(
        (categoryResponseAPI: CategoryResponseAPI) => {
          return this._categoryMapper.deserialize(categoryResponseAPI)
        }) || [];
    });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public onCategoryCreated(): void {
    this.loadCategories();
  }

  public onCategoryUpdateClick(category: BaseCategoryResponse): void {
    this.setSelectedCategory = category;
    this.toggleDialog(DialogType.CategoryUpdate);
  }

  public onCategoryUpdated(): void {
    this.loadCategories();
  }

  public onCategoryDetailClick(category: BaseCategoryResponse): void {
    this.setSelectedCategory = category;
    this.toggleDialog(DialogType.CategoryDetail);
  }

  public onCategoryDeleteClick(category: BaseCategoryResponse): void {
    this.setSelectedCategory = category;
    this.toggleDialog(DialogType.CategoryDelete);
  }

  public onCategoryDeleted(): void {
    this.loadCategories();
  }

}
