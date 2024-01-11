import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class EmailService {
  private static _headers = { 'Content-Type': 'application/json' };
  private readonly _apiUrl = environment.apiUrl + '/mail';

  constructor(private readonly _http: HttpClient) {}

  public static get getHeaders(): object {
    return EmailService._headers;
  }

  sendEmail(to: string | null = '', subject: string | null = '', template: string | null = ''): Observable<any> {
    const emailRequest = { to, subject, template };
    return this._http.post<any>(this._apiUrl + '/send', emailRequest, EmailService.getHeaders);
  }
}
