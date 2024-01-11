import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryDocumentResponse } from '../../models/category-document/response/category-document-response.model';
import { UserCategorySubscriptionResponseAPI } from '../../models/user-category-subscription/response/user-category-subscription-response-api.model';
import { UserCategorySubscriptionResponse } from '../../models/user-category-subscription/response/user-category-subscription-response.model';
import { UserCategorySubscriptionCreateRequest } from '../../models/user-category-subscription/request/user-category-subscription-create-request.model';
import { CategoryResponseAPI } from '../../models/category/http/response/category-response-api.model';
import { UserResponseAPI } from '../../models/user/http/response/user-response-api.model';

@Injectable()
export class UserCategorySubscriptionService {
  private static _headers = { 'Content-Type': 'application/json' };
  private readonly apiUrl = environment.apiUrl + '/users-categories-subscriptions';

  constructor(private readonly _http: HttpClient) {}

  public static get getHeaders(): object {
    return UserCategorySubscriptionService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllUsersCategoriesSubscriptions(): Observable<UserCategorySubscriptionResponseAPI[]> {
    const params = new HttpParams();
    return this.getHttpClient.get<UserCategorySubscriptionResponseAPI[]>(this.apiUrl, { params });
  }

  public getUserCategorySubscription(
    userId: string,
    categoryId: string,
  ): Observable<UserCategorySubscriptionResponseAPI> {
    return this.getHttpClient.get<UserCategorySubscriptionResponseAPI>(`${this.apiUrl}/${userId}/${categoryId}`);
  }

  public getAllUsersCategoriesSubscriptionsByUserId(userId: string): Observable<UserCategorySubscriptionResponseAPI[]> {
    return this.getHttpClient.get<UserCategorySubscriptionResponseAPI[]>(`${this.apiUrl}/user/${userId}`);
  }

  public getAllUsersCategoriesSubscriptionsByCategoryId(
    categoryId: string,
  ): Observable<UserCategorySubscriptionResponseAPI[]> {
    return this.getHttpClient.get<UserCategorySubscriptionResponseAPI[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  public getAllCategoriesByUserId(userId: string = ''): Observable<CategoryResponseAPI[]> {
    return this.getHttpClient.get<CategoryResponseAPI[]>(`${this.apiUrl}/${userId}/categories`);
  }

  public getAllUsersByCategoryId(categoryId: string): Observable<UserResponseAPI[]> {
    return this.getHttpClient.get<CategoryResponseAPI[]>(`${this.apiUrl}/${categoryId}/users`);
  }

  public createUserCategorySubscription(
    userCategorySubscriptionCreateRequest: UserCategorySubscriptionCreateRequest,
  ): Observable<UserCategorySubscriptionResponseAPI> {
    return this.getHttpClient.post<UserCategorySubscriptionResponseAPI>(
      this.apiUrl,
      userCategorySubscriptionCreateRequest.serialize(),
      UserCategorySubscriptionService.getHeaders,
    );
  }

  public deleteUserCategorySubscription(userId: string, categoryId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${userId}/${categoryId}`);
  }
}
