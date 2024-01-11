import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseDocumentResponse } from 'src/app/core/models/document/http/response/base-document-response.model';

@Component({
  selector: 'app-document-list-detail',
  templateUrl: './document-list-detail.component.html',
  styleUrls: ['./document-list-detail.component.css'],
})
export class DocumentListDetailComponent {
  private _document: BaseDocumentResponse | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();

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

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }
}
