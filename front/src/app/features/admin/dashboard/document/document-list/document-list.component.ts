import { Component, OnDestroy, OnInit } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DocumentService } from '../../../../../core/services/document/document.service';
import { BaseDocumentResponse } from '../../../../../core/models/document/http/response/base-document-response.model';
import { DocumentResponseAPI } from '../../../../../core/models/document/http/response/document-response-api.model';
import { DocumentMapper } from '../../../../../core/models/document/http/mapper/document-mapper.model';
import { FileInformation, extractFileNameFromUrl, fetchFile, formatFileSize, generateRandomFileName, getFileExtension } from '../../../../../core/utils/file-utils';

enum DialogType {
  AddDocument,
  DocumentUpdate,
  DocumentDetail,
  DocumentDelete,
}

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentService],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  private _collapsing: boolean = false;

  public get getCollapsing(): boolean { return this._collapsing; }
  public set setCollapsing(collapsing: boolean) { this._collapsing = collapsing; }

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

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.documents = [];
  }

  constructor(private _documentService: DocumentService, private _documentMapper: DocumentMapper) {}

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getDocuments(): BaseDocumentResponse[] {
    return this.documents;
  }

  public set setDocuments(documents: BaseDocumentResponse[]) {
    this.documents = documents;
  }

  public get getNewDocument(): BaseDocumentResponse {
    return this._newDocument;
  }

  public set setNewDocument(newDocument: BaseDocumentResponse) {
    this._newDocument = newDocument;
  }

  public get getSelectedDocument(): BaseDocumentResponse | null {
    return this._selectedDocument;
  }

  public set setSelectedDocument(document: BaseDocumentResponse | null) {
    this._selectedDocument = document;
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
    this._documentService.getAllDocuments().subscribe((response: DocumentResponseAPI[]) => {
      this.setDocuments = response.map(
        (documentResponseAPI: DocumentResponseAPI) => {
          return this._documentMapper.deserialize(documentResponseAPI)
        }) || [];
      this.getDocuments.map((document) => {
        this.getFileData(document.getFileUrl)
      });
    });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public onDocumentCreated(): void {
    this.loadDocuments();
  }

  public onDocumentUpdateClick(document: BaseDocumentResponse): void {
    this.setSelectedDocument = document;
    this.toggleDialog(DialogType.DocumentUpdate);
  }

  public onDocumentUpdated(): void {
    this.loadDocuments();
  }

  public onDocumentDetailClick(document: BaseDocumentResponse): void {
    this.setSelectedDocument = document;
    this.toggleDialog(DialogType.DocumentDetail);
  }

  public onDocumentDeleteClick(document: BaseDocumentResponse): void {
    this.setSelectedDocument = document;
    this.toggleDialog(DialogType.DocumentDelete);
  }

  public onDocumentDeleted(): void {
    this.loadDocuments();
  }

  public onDownloadDocument(url: string): void {
    window.open(url, '_blank');
    fetchFile(url).then((arrayBuffer: ArrayBuffer) => {
      const blob = new Blob([arrayBuffer]);
      const fileName = extractFileNameFromUrl(url);
      saveAs(blob, fileName);
    });
  }

  public onDownloadAllDocumentsClick(): void {
    const zip = new JSZip();
    this.getDocuments.forEach((document, index) => {
      const documentUrl = document.getFileUrl;
      const fileName = extractFileNameFromUrl(documentUrl);
      // Ajoute le fichier à l'archive zip
      zip.file(fileName, fetchFile(documentUrl), { binary: true });
    });
    // Génère le fichier zip
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      // Télécharge l'archive zip
      const fileName = generateRandomFileName('documents');
      saveAs(blob, fileName + '.zip');
    });
  }

  public fileInfoMap: Map<string, FileInformation> = new Map();

  public getFileData(url: string) {
    fetchFile(url).then((arrayBuffer: ArrayBuffer) => {
      const blob = new Blob([arrayBuffer]);
      const fileName = extractFileNameFromUrl(url);
      const fileLength = blob.size;
      const fileInfo: FileInformation = {
        fileName: fileName,
        fileSize: fileLength,
        fileExtension: getFileExtension(url)
      }
      this.fileInfoMap.set(url, fileInfo);
    });
  }

  public formatFileSize(size: number) {
    return formatFileSize(size);
  }

}
