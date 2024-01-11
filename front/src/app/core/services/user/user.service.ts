import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseUserResponse } from '../../models/user/http/response/base-user-response.model';
import { UserCreateRequest } from '../../models/user/http/request/user-create-request.model';
import { UserUpdateRequest } from '../../models/user/http/request/user-update-request.model';
import { UserResponseAPI } from '../../models/user/http/response/user-response-api.model';

/*
Pas d'injection dans le root level, l'injection se fait dans le providers afin 
de mieux comprendre les injections,
car si elles sont fait depuis le root level, elles sont alors disponible dans toutes
l'application et donc c'est pas très utile dans certains cas
@Injectable({
  providedIn: 'root',
})
*/
@Injectable()
export class UserService {
  private static _headers = { 'Content-Type': 'application/json' };
  private _apiUrl = environment.apiUrl + '/users';

  constructor(private _http: HttpClient) {}

  public static get getHeaders(): object {
    return UserService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllUsers(): Observable<UserResponseAPI[]> {
    const params = new HttpParams();
    return this.getHttpClient.get<UserResponseAPI[]>(this._apiUrl, { params });
  }

  public getUser(id: string): Observable<UserResponseAPI> {
    return this.getHttpClient.get<UserResponseAPI>(`${this._apiUrl}/${id}`);
  }

  public createUser(userRequest: UserCreateRequest): Observable<UserResponseAPI> {
    return this.getHttpClient.post<UserResponseAPI>(this._apiUrl, userRequest.serialize(), UserService.getHeaders);
  }

  public updateUser(publicId: string, userRequest: UserUpdateRequest): Observable<UserResponseAPI> {
    return this.getHttpClient.put<UserResponseAPI>(
      `${this._apiUrl}/${publicId}`,
      userRequest.serialize(),
      UserService.getHeaders,
    );
  }

  public deleteUser(id: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this._apiUrl}/${id}`);
  }
}
