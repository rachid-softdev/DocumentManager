import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../../../../core/services/document/document.service';
import { AuthenticationService } from '../../../../../core/services/authentication/authentication.service';
import { CategoryDocumentService } from '../../../../../core/services/category-document/category-document.service';
import { CategoryResponse } from '../../../../../core/models/category/http/response/category-response.model';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { DocumentMapper } from '../../../../../core/models/document/http/mapper/document-mapper.model';
import { CategoryMapper } from '../../../../../core/models/category/http/mapper/category-mapper.model';
import { CategoryDocumentMapper } from '../../../../../core/models/category-document/mapper/category-document-mapper.model';
import { CategoryResponseAPI } from '../../../../../core/models/category/http/response/category-response-api.model';
import { DocumentCreateRequest } from '../../../../../core/models/document/http/request/document-create-request.model';
import { BaseDocumentResponse } from '../../../../../core/models/document/http/response/base-document-response.model';
import { BaseCategoryResponse } from '../../../../../core/models/category/http/response/base-category-response.model';
import { CategoryDocumentResponse } from '../../../../../core/models/category-document/response/category-document-response.model';
import { CategoryDocumentCreateRequest } from '../../../../../core/models/category-document/request/category-document-create-request.model';
import { BaseUserResponse } from '../../../../../core/models/user/http/response/base-user-response.model';
import { UserResponse } from '../../../../../core/models/user/http/response/user-response.model';
import { BaseDocumentResponseAPI } from '../../../../../core/models/document/http/response/base-document-response-api.model';

@Component({
  selector: 'app-document-list-create',
  templateUrl: './document-list-create.component.html',
  styleUrls: ['./document-list-create.component.css'],
  providers: [DocumentService],
})
export class DocumentListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  // https://www.tektutorialshub.com/angular/angular-reactive-forms-validation/
  private _createDocumentForm: FormGroup;
  private _documentCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateDocumentButtonLoading: boolean = false;
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
    this._createDocumentForm = this._fb.group({
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
  public get getDocumentCreatedEvent(): EventEmitter<boolean> {
    return this._documentCreatedEvent;
  }

  public get getCreateDocumentForm(): FormGroup {
    return this._createDocumentForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateDocumentButtonLoading(): boolean {
    return this._isSubmitCreateDocumentButtonLoading;
  }

  public set setIsSubmitCreateDocumentButtonLoading(isSubmitCreateDocumentButtonLoading: boolean) {
    this._isSubmitCreateDocumentButtonLoading = isSubmitCreateDocumentButtonLoading;
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._createDocumentForm.reset();
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
      console.log(response);
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

  public onSubmitCreateDocument(): void {
    this._isSubmitCreateDocumentButtonLoading = true;
    if (this._createDocumentForm.invalid) {
      this._isSubmitCreateDocumentButtonLoading = false;
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
    const newDocumentRequest: DocumentCreateRequest = new DocumentCreateRequest(
      this._createDocumentForm.get('title')?.value,
      this._createDocumentForm.get('description')?.value,
      this.getFile,
      baseSenderUser,
      false,
      null,
      '',
    );
    this._documentService.createDocument(newDocumentRequest).subscribe({
      next: (documentResponseAPI: BaseDocumentResponseAPI) => {
        const documentResponse: BaseDocumentResponse = this._documentMapper.deserialize(documentResponseAPI);
        const categoryId = this._createDocumentForm.get('category')?.value;
        const categoryResponse: BaseCategoryResponse | null = this.getCategoryById(categoryId);
        const categoryDocumentCreateRequest: CategoryDocumentCreateRequest = new CategoryDocumentCreateRequest(
          categoryResponse,
          documentResponse,
        );
        this._categoryDocumentService.createCategoryDocument(categoryDocumentCreateRequest).subscribe({
          next: (categoryDocumentResponse: CategoryDocumentResponse) => {
            this._createDocumentForm.reset();
            this._errorMessage = null;
            this._isSubmitCreateDocumentButtonLoading = false;
            this.toggleDialog();
            this._toastrService.success('Le document a été crée avec succès', 'Nouveau document');
            this._documentCreatedEvent.emit(true);
          },
          error: (error) => {
            this._documentService.deleteDocument(documentResponse.getId).subscribe({
              next: (value: void) => {},
              error: (error: any) => {},
            });
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
            this._isSubmitCreateDocumentButtonLoading = false;
            this._toastrService.error(this._errorMessage, 'Erreur');
            this._documentCreatedEvent.emit(false);
          },
        });
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
        this._isSubmitCreateDocumentButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
        this._documentCreatedEvent.emit(false);
      },
    });
  }
}
