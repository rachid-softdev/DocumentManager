import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../../../../../core/services/document/document.service';
import { CategoryDocumentService } from '../../../../../../core/services/category-document/category-document.service';
import { AuthenticationService } from '../../../../../../core/services/authentication/authentication.service';
import { DocumentUpdateRequest } from '../../../../../../core/models/document/http/request/document-update-request.model';
import { CategoryResponse } from '../../../../../../core/models/category/http/response/category-response.model';
import { CategoryResponseAPI } from '../../../../../../core/models/category/http/response/category-response-api.model';
import { CategoryService } from '../../../../../../core/services/category/category.service';
import { CategoryMapper } from '../../../../../../core/models/category/http/mapper/category-mapper.model';
import { DocumentMapper } from '../../../../../../core/models/document/http/mapper/document-mapper.model';
import { CategoryDocumentCreateRequest } from '../../../../../../core/models/category-document/request/category-document-create-request.model';
import { BaseCategoryResponse } from '../../../../../../core/models/category/http/response/base-category-response.model';
import { CategoryDocumentMapper } from '../../../../../../core/models/category-document/mapper/category-document-mapper.model';
import { CategoryDocumentResponse } from '../../../../../../core/models/category-document/response/category-document-response.model';
import { BaseDocumentResponse } from '../../../../../../core/models/document/http/response/base-document-response.model';
import { BaseUserResponse } from '../../../../../../core/models/user/http/response/base-user-response.model';
import { UserResponse } from '../../../../../../core/models/user/http/response/user-response.model';
import { BaseDocumentResponseAPI } from '../../../../../../core/models/document/http/response/base-document-response-api.model';
import { BaseCategoryDocumentResponseAPI } from '../../../../../../core/models/category-document/response/base-category-document-response-api.model';

@Component({
  selector: 'app-document-list-update',
  templateUrl: './document-list-update.component.html',
  styleUrls: ['./document-list-update.component.css'],
  providers: [DocumentService],
})
export class DocumentListUpdateComponent implements OnInit, OnDestroy {
  private _document: BaseDocumentResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  // https://www.tektutorialshub.com/angular/angular-reactive-forms-validation/
  private _updateDocumentForm: FormGroup;
  private _documentUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateDocumentButtonLoading: boolean = false;
  private _categories: CategoryResponse[] = [];
  private _formattedCategories: { category: CategoryResponse; depth: number; parent: CategoryResponse | null }[] = [];

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _documentService: DocumentService,
    private readonly _documentMapper: DocumentMapper,
    private readonly _categoryService: CategoryService,
    private readonly _categoryMapper: CategoryMapper,
    private readonly _categoryDocumentService: CategoryDocumentService,
    private readonly _categoryDocumentMapper: CategoryDocumentMapper,
    private readonly _authenticationService: AuthenticationService,
    private readonly _toastrService: ToastrService,
  ) {
    this._updateDocumentForm = this._fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      file: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {}

  public get getDocument(): BaseDocumentResponse | null {
    return this._document;
  }

  @Input()
  public set setDocument(document: BaseDocumentResponse | null) {
    this._document = document;
    this._updateDocumentForm.get('title')?.setValue(this.getDocument?.getTitle);
    this._updateDocumentForm.get('description')?.setValue(this.getDocument?.getDescription);
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getDocumentService(): DocumentService {
    return this._documentService;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDocumentUpdatedEvent(): EventEmitter<boolean> {
    return this._documentUpdatedEvent;
  }

  public get getUpdateDocumentForm(): FormGroup {
    return this._updateDocumentForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateDocumentButtonLoading(): boolean {
    return this._isSubmitUpdateDocumentButtonLoading;
  }

  public set setIsSubmitUpdateDocumentButtonLoading(isSubmitUpdateDocumentButtonLoading: boolean) {
    this._isSubmitUpdateDocumentButtonLoading = isSubmitUpdateDocumentButtonLoading;
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._updateDocumentForm.reset();
  }

  public get getCategories(): CategoryResponse[] {
    return this._categories;
  }

  public set setCategories(categories: CategoryResponse[]) {
    this._categories = categories;
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

  public getCategoryById(
    categoryId: string,
    categories: CategoryResponse[] = this.getCategories,
  ): CategoryResponse | null {
    const category: CategoryResponse | undefined = categories.find((category) => category.getId === categoryId);
    if (category) {
      return category;
    } else {
      for (const parentCategory of categories) {
        const subCategory = this.getCategoryById(categoryId, parentCategory.getSubcategories);
        if (subCategory) {
          return subCategory;
        }
      }
    }
    return null;
  }

  private _file!: File;

  public get getFile(): File {
    return this._file;
  }

  public set setFile(file: File) {
    this._file = file;
  }

  public onFileSelected(event: Event) {
    const element = (event.target as HTMLInputElement).files?.item(0);
    if (element) this.setFile = element;
  }

  public onSubmitUpdateDocument(): void {
    this._isSubmitUpdateDocumentButtonLoading = true;
    if (this._updateDocumentForm.invalid) {
      this._isSubmitUpdateDocumentButtonLoading = false;
      return;
    }
    const userResponse: UserResponse | null = this._authenticationService.getUser;
    const baseSenderUser = new BaseUserResponse(
      '',
      '',
      userResponse?.getId,
      userResponse?.getLastname,
      userResponse?.getFirstname,
      userResponse?.getEmail,
      userResponse?.getPassword,
    );
    const updatedDocumentRequest: DocumentUpdateRequest = new DocumentUpdateRequest(
      this._updateDocumentForm.get('title')?.value,
      this._updateDocumentForm.get('description')?.value,
      this.getFile,
      baseSenderUser,
      this.getDocument?.getIsValidated ?? false,
      this.getDocument?.getValidatorUser ?? null,
      this.getDocument?.getValidatedAt ?? '',
    );
    this._documentService.updateDocument(this.getDocument?.getId ?? "", updatedDocumentRequest).subscribe({
      next: (documentResponseAPI: BaseDocumentResponseAPI) => {
        const documentResponse: BaseDocumentResponse = this._documentMapper.deserialize(documentResponseAPI);
        const categoryId = this._updateDocumentForm.get('category')?.value;
        const categoryResponse: BaseCategoryResponse | null = this.getCategoryById(categoryId);

        // Vérification si la liaison existe
        this._categoryDocumentService.getCategoryDocument(categoryResponse?.getId ?? "", documentResponse?.getId ?? "").subscribe({
          next: (baseCategoryDocumentResponseAPI: BaseCategoryDocumentResponseAPI) => {
              // Supprime l'ancienne liaison dans le cas où il y a une déja existante
              this._categoryDocumentService.deleteCategoryDocument(categoryResponse?.getId ?? "", documentResponse?.getId ?? "").subscribe({
                next: (data: void) => {
                  const categoryDocumentUpdateRequest: CategoryDocumentCreateRequest = new CategoryDocumentCreateRequest(
                    categoryResponse,
                    documentResponse,
                  );
                  // Ajoute la nouvelle liaison
                  this._categoryDocumentService.createCategoryDocument(categoryDocumentUpdateRequest).subscribe({
                    next: (categoryDocumentResponse: CategoryDocumentResponse) => {
                      this._errorMessage = null;
                      this._isSubmitUpdateDocumentButtonLoading = false;
                      this.toggleDialog();
                      this._toastrService.success('Le document a été mis à jour avec succès', 'Mis à jour du document');
                      this._documentUpdatedEvent.emit(true);
                    },
                    error: (error) => {
                      console.log(error);
                      this._documentService.deleteDocument(documentResponse.getId).subscribe({
                        next: (value: void) => { },
                        error: (error: any) => { },
                      });
                      if (error.status === 404) {
                        this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
                      } else {
                        this._errorMessage =
                          "Une erreur s'est produite lors de la mis à jour du document : (" +
                          error?.status +
                          ') - ' +
                          error?.error?.message;
                      }
                      this._isSubmitUpdateDocumentButtonLoading = false;
                      this._toastrService.error(this._errorMessage, 'Erreur');
                      this._documentUpdatedEvent.emit(false);
                    },
                  });
                },
                error: (error) => {
                  console.log(error);
                  this._toastrService.error("Une erreur s'est produite lors de la suppresion de la liaison du document à la catégorie: " + error?.error?.message, 'Erreur');
                }
              });
          }, error: (error) => {
            // Aucune correspondance trouvé donc pas besoin de suppression de l'ancienne liaison
            if (error.status === 404 || error == "OK") {
              const categoryDocumentUpdateRequest: CategoryDocumentCreateRequest = new CategoryDocumentCreateRequest(
                categoryResponse,
                documentResponse,
              );
              // Ajoute la nouvelle liaison
              this._categoryDocumentService.createCategoryDocument(categoryDocumentUpdateRequest).subscribe({
                next: (categoryDocumentResponse: CategoryDocumentResponse) => {
                  this._errorMessage = null;
                  this._isSubmitUpdateDocumentButtonLoading = false;
                  this.toggleDialog();
                  this._toastrService.success('Le document a été mis à jour avec succès', 'Mis à jour du document');
                  this._documentUpdatedEvent.emit(true);
                },
                error: (error) => {
                  this._documentService.deleteDocument(documentResponse.getId).subscribe({
                    next: (value: void) => { },
                    error: (error: any) => { },
                  });
                  console.log(error);
                  if (error.status === 404) {
                    this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
                  } else {
                    this._errorMessage =
                      "Une erreur s'est produite lors de la mis à jour du document : (" +
                      error?.status +
                      ') - ' +
                      error?.error?.message;
                  }
                  this._isSubmitUpdateDocumentButtonLoading = false;
                  this._toastrService.error(this._errorMessage, 'Erreur');
                  this._documentUpdatedEvent.emit(false);
                },
              });
            }
          }
        })
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création du document : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateDocumentButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
        this._documentUpdatedEvent.emit(false);
      },
    });
  }
}
