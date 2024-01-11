import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentService } from '../../../../../core/services/document/document.service';
import { BaseDocumentResponse } from '../../../../../core/models/document/http/response/base-document-response.model';
import { RoleManager } from 'src/app/core/constants/ERole';
import { DocumentResponseAPI } from '../../../../../core/models/document/http/response/document-response-api.model';
import { DocumentMapper } from '../../../../../core/models/document/http/mapper/document-mapper.model';
import { DocumentUpdateRequest } from '../../../../../core/models/document/http/request/document-update-request.model';
import { extractFileNameFromUrl, fetchFileWithAuthentication } from '../../../../../core/utils/file-utils';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../../../../core/services/mail/email.service';
import { CategoryDocumentService } from '../../../../../core/services/category-document/category-document.service';
import { CategoryDocumentMapper } from '../../../../../core/models/category-document/mapper/category-document-mapper.model';
import { BaseUserResponseAPI } from '../../../../../core/models/user/http/response/base-user-response-api.model';
import { BaseUserResponse } from '../../../../../core/models/user/http/response/base-user-response.model';
import { UserMapper } from '../../../../../core/models/user/http/mapper/user-mapper.model';
import { UserCategorySubscriptionService } from '../../../../../core/services/user-category-subscription/user-category-subscription.service';
import { UserCategorySubscriptionMapper } from '../../../../../core/models/user-category-subscription/mapper/user-category-subscription-mapper.model';
import { BaseCategoryResponseAPI } from '../../../../../core/models/category/http/response/base-category-response-api.model';
import { CategoryMapper } from '../../../../../core/models/category/http/mapper/category-mapper.model';
import { CategoryResponse } from '../../../../../core/models/category/http/response/category-response.model';
import { UserResponse } from '../../../../../core/models/user/http/response/user-response.model';
import {
  EmailTemplateStorageService,
  EmailTemplateVariable,
} from '../../../../../core/services/mail/email-storage.service';
import { AuthenticationService } from '../../../../../core/services/authentication/authentication.service';
import { BaseRoleResponse } from '../../../../../core/models/role/http/response/base-role-response.model';
import { BaseDocumentResponseAPI } from '../../../../../core/models/document/http/response/base-document-response-api.model';

enum DialogType {
  AddDocument,
  DocumentUpdate,
  DocumentDetail,
  DocumentDelete,
}

@Component({
  selector: 'app-document-list-validation',
  templateUrl: './document-list-validation.component.html',
  styleUrls: ['./document-list-validation.component.css'],
  providers: [DocumentService],
})
export class DocumentListValidationComponent implements OnInit, OnDestroy {
  public RoleManager = RoleManager;

  private _collapsing: boolean = false;

  public get getCollapsing(): boolean {
    return this._collapsing;
  }
  public set setCollapsing(collapsing: boolean) {
    this._collapsing = collapsing;
  }

  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddDocument]: false,
    [DialogType.DocumentUpdate]: false,
    [DialogType.DocumentDetail]: false,
    [DialogType.DocumentDelete]: false,
  };

  private documents: BaseDocumentResponse[] = [];

  private _selectedDocument: BaseDocumentResponse | null = null;

  private _newDocument: BaseDocumentResponse = new BaseDocumentResponse();

  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _documentService: DocumentService,
    private readonly _documentMapper: DocumentMapper,
    private readonly _categoryDocumentService: CategoryDocumentService,
    private readonly _categoryDocumentMapper: CategoryDocumentMapper,
    private readonly _userCategorySubscriptionService: UserCategorySubscriptionService,
    private readonly _userCategorySubscriptionMapper: UserCategorySubscriptionMapper,
    private readonly _categoryMapper: CategoryMapper,
    private readonly _userMapper: UserMapper,
    private readonly _emailService: EmailService,
    private readonly _emailTemplateStorageService: EmailTemplateStorageService,
    private readonly _toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.documents = [];
  }

  public get getDocuments(): BaseDocumentResponse[] {
    return this.documents;
  }

  public set setDocuments(documents: BaseDocumentResponse[]) {
    this.documents = documents;
  }

  public get getSelectedDocument(): BaseDocumentResponse | null {
    return this._selectedDocument;
  }

  public set setSelectedDocument(document: BaseDocumentResponse | null) {
    this._selectedDocument = document;
  }

  public get getUser(): UserResponse | null {
    return this._authenticationService.getUser;
  }

  searchByName: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value;
      if (!value || value.length === 0) {
        this.loadDocuments();
        return;
      }
      this.searchByName = value;
      this.setDocuments = this.documents.filter((document) =>
        document.getTitle.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public loadDocuments(): void {
    this._documentService.getAllDocuments({ is_validated: false }).subscribe((response: DocumentResponseAPI[]) => {
      this.setDocuments =
        response.map((documentResponseAPI: DocumentResponseAPI) => {
          return this._documentMapper.deserialize(documentResponseAPI);
        }) || [];
    });
  }

  public hasAdminRole(roles: BaseRoleResponse[] | null | undefined): boolean {
    return !!roles && roles.some((role) => role?.getName === RoleManager.ADMINISTRATOR.getName);
  }

  public onDocumentValidClick(document: BaseDocumentResponse): void {
    this.setSelectedDocument = document;
    const validatedAt: string = new Date().toISOString().toString();
    let file: File;
    const token: string | null = this._authenticationService.getTokenStorageService.getToken();
    /**
     * Récupération du fichier sous forme binaire
     * L'url du fichier est protégé par une authentification avec rôle donc il faut envoyer le token
     */
    fetchFileWithAuthentication(this.getSelectedDocument?.getFileUrl ?? '', token ?? "").then((arrayBuffer: ArrayBuffer) => {
      const blob = new Blob([arrayBuffer]);
      const fileName = extractFileNameFromUrl(this.getSelectedDocument?.getFileUrl ?? '');
      file = new File([blob], fileName);
      const isValidated = true;
      const validatorUser: BaseUserResponse = new BaseUserResponse('', '', this.getUser?.getId, this.getUser?.getLastname, this.getUser?.getFirstname, this.getUser?.getEmail, this.getUser?.getPassword);
      const updateDocumentRequest: DocumentUpdateRequest = new DocumentUpdateRequest(
        this.getSelectedDocument?.getTitle,
        this.getSelectedDocument?.getDescription,
        file,
        this.getSelectedDocument?.getSenderUser,
        isValidated,
        validatorUser,
        validatedAt,
      );
      this._documentService.updateDocument(this.getSelectedDocument?.getId ?? '', updateDocumentRequest).subscribe({
        next: (baseDocumentResponseAPI: BaseDocumentResponseAPI) => {
          const baseDocumentResponse: BaseDocumentResponse = this._documentMapper.deserialize(baseDocumentResponseAPI);
          // Pas besoin d'effectuer la liaison sur la table de jointure, car il s'agit juste de valider un document
          // Récupération des catégories du document
          let categoriesResponses: CategoryResponse[] = [];
          this._categoryDocumentService.getAllCategoriesByDocumentId(baseDocumentResponse.getId).subscribe({
            next: (response: BaseCategoryResponseAPI[]) => {
              // Traitement en cas de réponse réussie
              categoriesResponses =
                response.map((categoryResponse: BaseCategoryResponseAPI) => {
                  return this._categoryMapper.deserialize(categoryResponse);
                }) || [];

              // Informe à tous les abonnés que un document a été publié
              // Récupere toutes les catégories appartenant aux documents
              for (const categoryResponse of categoriesResponses) {
                this._userCategorySubscriptionService.getAllUsersByCategoryId(categoryResponse.getId).subscribe({
                  next: (response: BaseUserResponseAPI[]) => {
                    const usersResponses: UserResponse[] =
                      response.map((userResponseAPI: BaseUserResponseAPI) => {
                        return this._userMapper.deserialize(userResponseAPI);
                      }) || [];
                    // Envoie du mail à tous les abonnés de la catégorie
                    let template = this._emailTemplateStorageService.getEmailTemplate();
                    // Remplaces les variables
                    template = template?.replace(
                      this._emailTemplateStorageService.variableFormat(EmailTemplateVariable.URL),
                      baseDocumentResponse.getFileUrl,
                    ) ?? "";
                    template = template?.replace(
                      this._emailTemplateStorageService.variableFormat(EmailTemplateVariable.TITLE),
                      baseDocumentResponse.getTitle,
                    ) ?? "";
                    template = template?.replace(
                      this._emailTemplateStorageService.variableFormat(EmailTemplateVariable.DESCRIPTION),
                      baseDocumentResponse.getDescription,
                    ) ?? "";
                    console.log(template)
                    for (const user of usersResponses) {
                      this._emailService.sendEmail(user.getEmail, 'Nouveau document validé', template).subscribe({
                        next: (data) => {},
                        error: (error) => {},
                      });
                    }
                  },
                  error: (error) => {},
                });
              }

              this._documentService
                .getAllDocuments({ is_validated: false })
                .subscribe((response: DocumentResponseAPI[]) => {
                  this.setDocuments =
                    response.map((documentResponseAPI: DocumentResponseAPI) => {
                      return this._documentMapper.deserialize(documentResponseAPI);
                    }) || [];
                });

              this.loadDocuments();
              this._toastr.success(
                `Le document ${this.getSelectedDocument?.getTitle ?? ''} a été validé.`,
                'Validation du document',
              );
            },
            error: (error) => {
              // En cas d'erreur, réinitiliase la validation du document
              updateDocumentRequest.setIsValidated = false;
              this._documentService
                .updateDocument(this.getSelectedDocument?.getId ?? '', updateDocumentRequest)
                .subscribe({
                  next: (baseDocumentResponseAPI: BaseDocumentResponseAPI) => {},
                  error: (error) => {},
                });
            },
          });
        },
        error: (error) => {
          this._toastr.error(
            `Une erreur survenue, lors de la validation du document ${this.getSelectedDocument?.getTitle ?? ''}.`,
            'Validation du document',
          );
        },
      });
    });
  }
}
