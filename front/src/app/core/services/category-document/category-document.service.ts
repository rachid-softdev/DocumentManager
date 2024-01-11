import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryDocumentResponse } from '../../models/category-document/response/category-document-response.model';
import { CategoryDocumentCreateRequest } from '../../models/category-document/request/category-document-create-request.model';
import { BaseCategoryDocumentResponseAPI } from '../../models/category-document/response/base-category-document-response-api.model';
import { CategoryResponseAPI } from '../../models/category/http/response/category-response-api.model';
import { UserResponseAPI } from '../../models/user/http/response/user-response-api.model';
import { BaseCategoryResponseAPI } from '../../models/category/http/response/base-category-response-api.model';

@Injectable()
export class CategoryDocumentService {
  private static _headers = { 'Content-Type': 'application/json' };
  private readonly apiUrl = environment.apiUrl + '/categories-documents';

  constructor(private readonly _http: HttpClient) {}

  public static get getHeaders(): object {
    return CategoryDocumentService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllCategoriesDocuments(): Observable<BaseCategoryDocumentResponseAPI[]> {
    const params = new HttpParams();
    return this.getHttpClient.get<BaseCategoryDocumentResponseAPI[]>(this.apiUrl, { params });
  }

  public getCategoryDocument(categoryId: string, documentId: string): Observable<BaseCategoryDocumentResponseAPI> {
    return this.getHttpClient.get<BaseCategoryDocumentResponseAPI>(`${this.apiUrl}/${categoryId}/${documentId}`);
  }

  public getAllCategoriesByDocumentId(documentId: string = ''): Observable<BaseCategoryResponseAPI[]> {
    return this.getHttpClient.get<CategoryResponseAPI[]>(`${this.apiUrl}/${documentId}/categories`);
  }

  public getAllDocumentsByCategoryId(categoryId: string): Observable<BaseCategoryResponseAPI[]> {
    return this.getHttpClient.get<CategoryResponseAPI[]>(`${this.apiUrl}/${categoryId}/documents`);
  }

  public createCategoryDocument(
    categoryDocumentCreateRequest: CategoryDocumentCreateRequest,
  ): Observable<CategoryDocumentResponse> {
    return this.getHttpClient.post<CategoryDocumentResponse>(
      this.apiUrl,
      categoryDocumentCreateRequest.serialize(),
      CategoryDocumentService.getHeaders,
    );
  }

  public deleteCategoryDocument(categoryId: string, documentId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${categoryId}/${documentId}`);
  }
}
