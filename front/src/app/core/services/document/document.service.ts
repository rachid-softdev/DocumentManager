import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseDocumentResponse } from '../../models/document/http/response/base-document-response.model';
import { DocumentUpdateRequest } from '../../models/document/http/request/document-update-request.model';
import { DocumentCreateRequest } from '../../models/document/http/request/document-create-request.model';
import { DocumentResponseAPI } from '../../models/document/http/response/document-response-api.model';
import { DocumentFilters } from '../../models/document/http/request/document-filters.model';
import { BaseDocumentResponseAPI } from '../../models/document/http/response/base-document-response-api.model';

@Injectable()
export class DocumentService {
  private static _headers = { 'Content-Type': 'application/json' };
  private readonly _apiUrl = environment.apiUrl + '/documents';

  constructor(private readonly _http: HttpClient) {}

  public static get getHeaders(): object {
    return DocumentService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllDocuments(filters?: DocumentFilters): Observable<DocumentResponseAPI[]> {
    const params = new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(filters || {}).filter(([_, value]) => value !== undefined && value !== null),
      ),
    });
    return this.getHttpClient.get<DocumentResponseAPI[]>(this._apiUrl, { params });
  }

  public getDocument(id: string): Observable<DocumentResponseAPI> {
    return this.getHttpClient.get<DocumentResponseAPI>(`${this._apiUrl}/${id}`);
  }

  public createDocument(documentCreateRequest: DocumentCreateRequest): Observable<BaseDocumentResponseAPI> {
    const formData = new FormData();
    formData.append('title', documentCreateRequest.getTitle);
    formData.append('description', documentCreateRequest.getDescription);
    if (documentCreateRequest.getFile) formData.append('file', documentCreateRequest.getFile);
    if (documentCreateRequest.getSenderUser) {
      formData.append('sender_user.id', documentCreateRequest.getSenderUser.getId ?? '');
      formData.append('sender_user.firstname', documentCreateRequest.getSenderUser.getFirstname ?? '');
      formData.append('sender_user.email', documentCreateRequest.getSenderUser.getEmail ?? '');
      formData.append('sender_user.lastname', documentCreateRequest.getSenderUser.getLastname ?? '');
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    const options = { headers };
    return this.getHttpClient.post<BaseDocumentResponseAPI>(this._apiUrl, formData, options);
  }

  public updateDocument(id: string, documentUpdateRequest: DocumentUpdateRequest): Observable<BaseDocumentResponseAPI> {
    const formData = new FormData();
    formData.append('title', documentUpdateRequest.getTitle);
    formData.append('description', documentUpdateRequest.getDescription);
    if (documentUpdateRequest.getFile) formData.append('file', documentUpdateRequest.getFile);
    if (documentUpdateRequest.getSenderUser) {
      formData.append('sender_user.id', documentUpdateRequest.getSenderUser.getId ?? '');
      formData.append('sender_user.firstname', documentUpdateRequest.getSenderUser.getFirstname ?? '');
      formData.append('sender_user.email', documentUpdateRequest.getSenderUser.getEmail ?? '');
      formData.append('sender_user.lastname', documentUpdateRequest.getSenderUser.getLastname ?? '');
    }
    if (documentUpdateRequest.getValidatorUser) {
      formData.append('validator_user.id', documentUpdateRequest.getValidatorUser.getId ?? '');
      formData.append('validator_user.firstname', documentUpdateRequest.getValidatorUser.getFirstname ?? '');
      formData.append('validator_user.email', documentUpdateRequest.getValidatorUser.getEmail ?? '');
      formData.append('validator_user.lastname', documentUpdateRequest.getValidatorUser.getLastname ?? '');
    }
    formData.append('is_validated', JSON.stringify(documentUpdateRequest.getIsValidated));
    formData.append('validated_at', documentUpdateRequest.getValidatedAt);
    return this.getHttpClient.put<BaseDocumentResponseAPI>(
      `${this._apiUrl}/${id}`,
      formData,
      DocumentService.getHeaders,
    );
  }

  public deleteDocument(id: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this._apiUrl}/${id}`);
  }
}
