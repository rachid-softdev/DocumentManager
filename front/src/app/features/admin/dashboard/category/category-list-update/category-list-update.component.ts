import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { CategoryUpdateRequest } from '../../../../../core/models/category/http/request/category-update-request.model';
import { BaseCategoryResponse } from '../../../../../core/models/category/http/response/base-category-response.model';
import { CategoryResponse } from '../../../../../core/models/category/http/response/category-response.model';
import { CategoryResponseAPI } from '../../../../../core/models/category/http/response/category-response-api.model';
import { CategoryMapper } from '../../../../../core/models/category/http/mapper/category-mapper.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list-update',
  templateUrl: './category-list-update.component.html',
  styleUrls: ['./category-list-update.component.css'],
  providers: [CategoryService],
})
export class CategoryListUpdateComponent implements OnInit, OnDestroy {
  private _category: BaseCategoryResponse | null = null;
  private _parentCategory: BaseCategoryResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  // https://www.tektutorialshub.com/angular/angular-reactive-forms-validation/
  private _updateCategoryForm: FormGroup;
  private _categoryUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateCategoryButtonLoading: boolean = false;
  private _categories: CategoryResponse[] = [];
  private _formattedCategories: { category: CategoryResponse; depth: number; parent: CategoryResponse | null }[] = [];
  private _selectedParentCategoryId: string | null = '';

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _categoryService: CategoryService,
    private readonly _categoryMapper: CategoryMapper,
    private readonly _toastrService: ToastrService,
  ) {
    this._updateCategoryForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(128)]),
      parentCategory: new FormControl('', [Validators.required]),
    });
    this._categories = [];
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupParentCategorySubscription();
  }

  ngOnDestroy(): void { }

  public get getOptionNameIndependentCategory() {
    return 'independent';
  }

  private setupParentCategorySubscription() {
    const parentCategoryControl = this._updateCategoryForm.get('parentCategory');
    parentCategoryControl?.valueChanges.subscribe((selectedValue) => {
      this.setSelectedCategoryId =
        selectedValue !== null && selectedValue !== this.getOptionNameIndependentCategory ? selectedValue : null;
    });
  }

  public get getCategory(): BaseCategoryResponse | null {
    return this._category;
  }

  @Input()
  public set setCategory(category: BaseCategoryResponse | null) {
    this._category = category;
    this._updateCategoryForm.get('name')?.setValue(this.getCategory?.getName);
    this._updateCategoryForm.get('description')?.setValue(this.getCategory?.getDescription);
    this._updateCategoryForm.get('parentCategory')?.setValue(this.getSelectedParentCategoryId);
  }

  public get getParentCategory(): BaseCategoryResponse | null {
    return this._parentCategory;
  }

  @Input()
  public set setParentCategory(parentCategory: BaseCategoryResponse | null) {
    this._parentCategory = parentCategory;
  }
  
  public get getSelectedParentCategoryId(): string | null {
    return this._selectedParentCategoryId;
  }

  public set setSelectedCategoryId(selectedParentCategoryId: string | null) {
    this._selectedParentCategoryId = selectedParentCategoryId;
  }

  public get getCategories(): CategoryResponse[] {
    return this._categories;
  }

  public set setCategories(categories: CategoryResponse[]) {
    this._categories = categories;
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getCategoryService(): CategoryService {
    return this._categoryService;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getCategoryUpdatedEvent(): EventEmitter<boolean> {
    return this._categoryUpdatedEvent;
  }

  public get getUpdateCategoryForm(): FormGroup {
    return this._updateCategoryForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateCategoryButtonLoading(): boolean {
    return this._isSubmitUpdateCategoryButtonLoading;
  }

  public set setIsSubmitUpdateCategoryButtonLoading(isSubmitUpdateCategoryButtonLoading: boolean) {
    this._isSubmitUpdateCategoryButtonLoading = isSubmitUpdateCategoryButtonLoading;
  }

  public get getFormattedCategories(): {
    category: CategoryResponse;
    depth: number;
    parent: CategoryResponse | null;
  }[] {
    return this._formattedCategories;
  }

  public set setFormattedCategories(
    formattedCategories: {
      category: CategoryResponse;
      depth: number;
      parent: CategoryResponse | null;
    }[],
  ) {
    this._formattedCategories = formattedCategories;
  }

  private flattenCategories(category: CategoryResponse, parent: CategoryResponse | null, depth: number): void {
    const categoryWithDepth = { category, depth, parent };
    this._formattedCategories.push(categoryWithDepth);
    if (category.getSubcategories) {
      category.getSubcategories.forEach((subcategory) => {
        this.flattenCategories(subcategory, category, depth + 1);
      });
    }
  }

  public getCategoryDepthPrefix(depth: number): string {
    return '-'.repeat(depth * 2);
  }

  private loadCategories() {
    this._categoryService.getAllCategories().subscribe((response: CategoryResponseAPI[]) => {
      this.setCategories =
        response.map((categoryResponseAPI: CategoryResponseAPI) => {
          return this._categoryMapper.deserialize(categoryResponseAPI);
        }) || [];
      this.getCategories.forEach((category) => {
        this.flattenCategories(category, null, 0);
      });
    });
  }
  
  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._updateCategoryForm.reset();
    this._updateCategoryForm.get('name')?.setValue(this.getCategory?.getName);
    this._updateCategoryForm.get('description')?.setValue(this.getCategory?.getDescription);
    this._updateCategoryForm.get('parentCategory')?.setValue(this.getSelectedParentCategoryId);
  }

  public onSubmitUpdateCategory(): void {
    this._isSubmitUpdateCategoryButtonLoading = true;
    if (this._updateCategoryForm.invalid) {
      this._isSubmitUpdateCategoryButtonLoading = false;
      return;
    }
    const updatedCategoryRequest: CategoryUpdateRequest = new CategoryUpdateRequest(
      this._updateCategoryForm.get('name')?.value,
      this._updateCategoryForm.get('description')?.value,
      !this.getSelectedParentCategoryId || this.getSelectedParentCategoryId.trim().length === 0
        ? null
        : this.getSelectedParentCategoryId,
    );
    this._categoryService.updateCategory(this.getCategory?.getId ?? "", updatedCategoryRequest).subscribe({
      next: () => {
        this._updateCategoryForm.reset();
        this._errorMessage = null;
        this._isSubmitUpdateCategoryButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success('Le categorie a été mis à jour avec succès', 'Mis à jour de la categorie');
        this._categoryUpdatedEvent.emit(true);
      },
      error: (error) => {
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la mis à jour de la catégorie : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateCategoryButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
        this._categoryUpdatedEvent.emit(false);
      },
    });
  }
}
