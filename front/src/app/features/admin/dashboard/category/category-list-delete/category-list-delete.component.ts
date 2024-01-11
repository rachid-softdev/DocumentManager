import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { BaseCategoryResponse } from '../../../../../core/models/category/http/response/base-category-response.model';

@Component({
  selector: 'app-category-list-delete',
  templateUrl: './category-list-delete.component.html',
  styleUrls: ['./category-list-delete.component.css'],
  providers: [CategoryService],
})
export class CategoryListDeleteComponent {
  private _category: BaseCategoryResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _categoryDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteCategoryButtonLoading: boolean = false;

  constructor(private categoryService: CategoryService, private _toastrService: ToastrService) {}

  public get getCategory(): BaseCategoryResponse | null {
    return this._category;
  }

  @Input()
  public set setCategory(category: BaseCategoryResponse | null) {
    this._category = category;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getCategoryDeletedEvent(): EventEmitter<boolean> {
    return this._categoryDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteCategoryButtonLoading(): boolean {
    return this._isSubmitDeleteCategoryButtonLoading;
  }

  public set setIsSubmitDeleteCategoryButtonLoading(isSubmitDeleteCategoryButtonLoading: boolean) {
    this._isSubmitDeleteCategoryButtonLoading = isSubmitDeleteCategoryButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (!this._category) {
      return;
    }
    this._isSubmitDeleteCategoryButtonLoading = true;
    this.categoryService.deleteCategory(this._category.getId).subscribe({
      next: () => {
        this._errorMessage = null;
        this._isSubmitDeleteCategoryButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success('La catégorie a été supprimé avec succès', 'Suppression de la catégorie');
        this._categoryDeletedEvent.emit(true);
      },
      error: (error) => {
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la suppression de la catégorie : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitDeleteCategoryButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
        this._categoryDeletedEvent.emit(false);
      },
    });
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
