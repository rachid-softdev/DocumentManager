import { Component, OnDestroy, OnInit } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DocumentService } from 'src/app/core/services/document/document.service';
import { BaseDocumentResponse } from 'src/app/core/models/document/http/response/base-document-response.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentMapper } from '../../../../core/models/document/http/mapper/document-mapper.model';
import { UserService } from '../../../../core/services/user/user.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { DocumentResponseAPI } from '../../../../core/models/document/http/response/document-response-api.model';
import { BaseUserResponse } from '../../../../core/models/user/http/response/base-user-response.model';
import { CategoryResponse } from '../../../../core/models/category/http/response/category-response.model';
import { CategoryMapper } from '../../../../core/models/category/http/mapper/category-mapper.model';
import { UserMapper } from '../../../../core/models/user/http/mapper/user-mapper.model';
import { CategoryResponseAPI } from '../../../../core/models/category/http/response/category-response-api.model';
import { UserResponseAPI } from '../../../../core/models/user/http/response/user-response-api.model';
import { ToastrService } from 'ngx-toastr';
import { DocumentFilters } from '../../../../core/models/document/http/request/document-filters.model';
import { FileInformation, extractFileNameFromUrl, fetchFile, formatFileSize, generateRandomFileName, getFileExtension } from '../../../../core/utils/file-utils';

enum DialogType {
  AddDocument,
  DocumentDetail,
}

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentService],
})
export class DocumentListComponent implements OnInit, OnDestroy {
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
    [DialogType.DocumentDetail]: false,
  };

  private _documents: BaseDocumentResponse[] = [];
  private _selectedDocument: BaseDocumentResponse | null = null;
  private _newDocument: BaseDocumentResponse = new BaseDocumentResponse();
  private _searchForm: FormGroup = new FormGroup({});
  private _categories: CategoryResponse[] = [];
  private _formattedCategories: { category: CategoryResponse; depth: number; parent: CategoryResponse | null }[] = [];
  private _users: BaseUserResponse[] = [];

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _documentService: DocumentService,
    private readonly _documentMapper: DocumentMapper,
    private readonly _categoryService: CategoryService,
    private readonly _categoryMapper: CategoryMapper,
    private readonly _userService: UserService,
    private readonly _userMapper: UserMapper,
    private readonly _toastrService: ToastrService,
  ) {
    this.initiliazeSearchForm();
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this._documents = [];
  }

  public get getOptionNameIndependentCategory() {
    return 'independent';
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

  public get getSearchForm(): FormGroup {
    return this._searchForm;
  }

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getDocuments(): BaseDocumentResponse[] {
    return this._documents;
  }

  public set setDocuments(documents: BaseDocumentResponse[]) {
    this._documents = documents;
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
      this.setDocuments = this._documents.filter((document) =>
        document.getTitle.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public initiliazeSearchForm(): void {
    this._searchForm = this._fb.group({
      category: null,
      title: '',
      description: '',
      author: null,
    });
    this.loadCategories();
    this.loadUsers();
  }

  public submitSearchForm(): void {
    const documentFilters: DocumentFilters = {
      category_id: this._searchForm.get('category')?.value || undefined,
      title: this._searchForm.get('title')?.value || undefined,
      description: this._searchForm.get('description')?.value || undefined,
      author_id: this._searchForm.get('author')?.value || undefined,
    };
    documentFilters.category_id = documentFilters.category_id && documentFilters.category_id.localeCompare(this.getOptionNameIndependentCategory) === 0 ? undefined : documentFilters.category_id;
    this._documentService.getAllDocuments(documentFilters).subscribe((response: DocumentResponseAPI[]) => {
      this.setDocuments =
        response.map((documentResponseAPI: DocumentResponseAPI) => {
          return this._documentMapper.deserialize(documentResponseAPI);
        }) || [];
    });
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

  public get getUsers(): BaseUserResponse[] {
    return this._users;
  }

  public set setUsers(users: BaseUserResponse[]) {
    this._users = users;
  }

  private loadUsers() {
    this._userService.getAllUsers().subscribe((response: UserResponseAPI[]) => {
      this.setUsers =
        response.map((userResponseAPI: UserResponseAPI) => {
          return this._userMapper.deserialize(userResponseAPI);
        }) || [];
    });
  }

  public loadDocuments(): void {
    this._documentService.getAllDocuments().subscribe((response: DocumentResponseAPI[]) => {
      this.setDocuments =
        response.map((documentResponseAPI: DocumentResponseAPI) => {
          return this._documentMapper.deserialize(documentResponseAPI);
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

  public onDocumentDetailClick(document: BaseDocumentResponse): void {
    this.setSelectedDocument = document;
    this.toggleDialog(DialogType.DocumentDetail);
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
