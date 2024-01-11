import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseDocumentResponse } from '../../../../../../core/models/document/http/response/base-document-response.model';
import { DocumentService } from '../../../../../../core/services/document/document.service';


@Component({
  selector: 'app-document-list-delete',
  templateUrl: './document-list-delete.component.html',
  styleUrls: ['./document-list-delete.component.css'],
  providers: [DocumentService],
})
export class DocumentListDeleteComponent {
  private _document: BaseDocumentResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _documentDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteDocumentButtonLoading: boolean = false;

  constructor(private readonly documentService: DocumentService, private readonly _toastrService: ToastrService) {}

  public get getDocument(): BaseDocumentResponse | null {
    return this._document;
  }

  @Input()
  public set setDocument(document: BaseDocumentResponse | null) {
    this._document = document;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getDocumentDeletedEvent(): EventEmitter<boolean> {
    return this._documentDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteDocumentButtonLoading(): boolean {
    return this._isSubmitDeleteDocumentButtonLoading;
  }

  public set setIsSubmitDeleteDocumentButtonLoading(isSubmitDeleteDocumentButtonLoading: boolean) {
    this._isSubmitDeleteDocumentButtonLoading = isSubmitDeleteDocumentButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (!this._document) {
      return;
    }
    this._isSubmitDeleteDocumentButtonLoading = true;
    this.documentService.deleteDocument(this._document.getId).subscribe({
      next: () => {
        this._errorMessage = null;
        this._isSubmitDeleteDocumentButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success('Le document a été supprimé avec succès', 'Suppression du document');
        this._documentDeletedEvent.emit(true);
      },
      error: (error) => {
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la suppression du document : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitDeleteDocumentButtonLoading = false;
        this._toastrService.error(this._errorMessage, 'Erreur');
        this._documentDeletedEvent.emit(false);
      },
    });
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
