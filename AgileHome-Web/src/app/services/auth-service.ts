import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { JwtResponse } from '../auth/jwt-response';
import { AuthLoginInfo } from '../model/login-info';
import { map, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/login';//Api de logar no sistema
  public login:boolean

  constructor(private http: HttpClient) {
  } 

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {//envia a tentativa de login como requisição
    const url = `${this.apiUrl}/signin`;
    return this.http.post<JwtResponse>(url, credentials, httpOptions)
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } 
    else 
    {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }// return an observable with a user-facing error message
    if(`${error.error}`=='Fail -> Email is already in use!')    
        return throwError('Já existe alguém cadastrado com esse e-mail!');
    return throwError('E-mail ou senha incorretos!');
  }

  extractData(res: Response) {
    let body = res;
    return body || { };
  }

  recEmail(data): Observable<any> {
    const url = `${this.apiUrl}/recemail`;
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  
  }

}
