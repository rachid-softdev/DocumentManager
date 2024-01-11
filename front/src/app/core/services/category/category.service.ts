import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryResponse } from '../../models/category/http/response/category-response.model';
import { CategoryCreateRequest } from '../../models/category/http/request/category-create-request.model';
import { CategoryUpdateRequest } from '../../models/category/http/request/category-update-request.model';
import { CategoryResponseAPI } from '../../models/category/http/response/category-response-api.model';
import { BaseCategoryResponse } from '../../models/category/http/response/base-category-response.model';

@Injectable()
export class CategoryService {
  private static _headers = { 'Content-Type': 'application/json' };
  private readonly apiUrl = environment.apiUrl + '/categories';

  constructor(private readonly _http: HttpClient) {}

  public static get getHeaders(): object {
    return CategoryService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllCategories(): Observable<CategoryResponseAPI[]> {
    const params = new HttpParams();
    return this.getHttpClient.get<CategoryResponseAPI[]>(this.apiUrl, { params });
  }

  public getCategory(id: string): Observable<CategoryResponseAPI> {
    return this.getHttpClient.get<CategoryResponseAPI>(`${this.apiUrl}/${id}`);
  }

  public createCategory(categoryCreateRequest: CategoryCreateRequest): Observable<CategoryResponse> {
    return this.getHttpClient.post<CategoryResponse>(
      this.apiUrl,
      categoryCreateRequest.serialize(),
      CategoryService.getHeaders,
    );
  }

  public updateCategory(id: string, categoryUpdateRequest: CategoryUpdateRequest): Observable<CategoryResponse> {
    return this.getHttpClient.put<CategoryResponse>(
      `${this.apiUrl}/${id}`,
      categoryUpdateRequest.serialize(),
      CategoryService.getHeaders,
    );
  }

  public deleteCategory(id: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  public findParentCategory(
    subcategory: BaseCategoryResponse | null,
    categories: CategoryResponse[] | null,
  ): BaseCategoryResponse | null {
    if (!subcategory || !categories) return null;
    for (const category of categories) {
      if (category.getSubcategories && category.getSubcategories.length > 0) {
        // Vérification pour savoir si la sous-catégorie est une sous-catégorie directe de la catégorie actuelle
        if (category.getSubcategories.some((sub) => sub.getId === subcategory.getId)) {
          return category;
        }

        const parentCategory = this.findParentCategory(subcategory, category.getSubcategories);
        if (parentCategory) {
          return parentCategory;
        }
      }
    }
    return null;
  }
}
