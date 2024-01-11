import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { CategoryCreateRequest } from '../../../../../core/models/category/http/request/category-create-request.model';
import { CategoryResponse } from '../../../../../core/models/category/http/response/category-response.model';
import { CategoryResponseAPI } from '../../../../../core/models/category/http/response/category-response-api.model';
import { CategoryMapper } from '../../../../../core/models/category/http/mapper/category-mapper.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list-create',
  templateUrl: './category-list-create.component.html',
  styleUrls: ['./category-list-create.component.css'],
  providers: [CategoryService],
})
export class CategoryListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  // https://www.tektutorialshub.com/angular/angular-reactive-forms-validation/
  private _createCategoryForm: FormGroup;
  private _categoryCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateCategoryButtonLoading: boolean = false;
  private _categories: CategoryResponse[] = [];
  private _formattedCategories: { category: CategoryResponse; depth: number; parent: CategoryResponse | null }[] = [];
  private _selectedParentCategoryId: string | null = '';

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _categoryService: CategoryService,
    private readonly _categoryMapper: CategoryMapper,
    private readonly _toastrService: ToastrService,
  ) {
    this._createCategoryForm = this._fb.group({
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

  ngOnDestroy(): void {}

  public get getOptionNameIndependentCategory() {
    return 'independent';
  }

  private setupParentCategorySubscription() {
    const parentCategoryControl = this._createCategoryForm.get('parentCategory');
    parentCategoryControl?.valueChanges.subscribe((selectedValue) => {
      this.setSelectedCategoryId =
        selectedValue !== null && selectedValue !== this.getOptionNameIndependentCategory ? selectedValue : null;
    });
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
  public get getCategoryCreatedEvent(): EventEmitter<boolean> {
    return this._categoryCreatedEvent;
  }

  public get getCreateCategoryForm(): FormGroup {
    return this._createCategoryForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateCategoryButtonLoading(): boolean {
    return this._isSubmitCreateCategoryButtonLoading;
  }

  public set setIsSubmitCreateCategoryButtonLoading(isSubmitCreateCategoryButtonLoading: boolean) {
    this._isSubmitCreateCategoryButtonLoading = isSubmitCreateCategoryButtonLoading;
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
    this._createCategoryForm.reset();
  }

  public onSubmitCreateCategory(): void {
    this._isSubmitCreateCategoryButtonLoading = true;
    if (this._createCategoryForm.invalid) {
      this._isSubmitCreateCategoryButtonLoading = false;
      return;
    }
    const newCategoryRequest: CategoryCreateRequest = new CategoryCreateRequest(
      this._createCategoryForm.get('name')?.value,
      this._createCategoryForm.get('description')?.value,
      !this.getSelectedParentCategoryId || this.getSelectedParentCategoryId.trim().length === 0
        ? null
        : this.getSelectedParentCategoryId,
    );
    this._categoryService.createCategory(newCategoryRequest).subscribe({
      next: () => {
        this._createCategoryForm.reset();
        this._errorMessage = null;
        this._isSubmitCreateCategoryButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success('Le categorie a été crée avec succès', 'Nouvelle categorie');
        this._categoryCreatedEvent.emit(true);
      },
      error: (error) => {
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création de la catégorie : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitCreateCategoryButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
        this._categoryCreatedEvent.emit(false);
      },
    });
  }
}
