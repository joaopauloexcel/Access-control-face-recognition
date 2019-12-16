import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { JwtResponse } from '../auth/jwt-response';
import { AuthLoginInfo } from '../model/login';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

const apiUrl = 'http://localhost:3000/api/login';//Api de logar no sistema

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  public login:boolean

  constructor(private http: HttpClient) {
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
    return throwError(error.error);
  }

  extractData(res: Response) {
    let body = res;
    return body || { };
  }

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {//envia a tentativa de login como requisição
    const url = `${apiUrl}/signin`;
    return this.http.post<JwtResponse>(url, credentials, httpOptions)
  }

  recEmail(data): Observable<any> {
    const url = `${apiUrl}/recemail`;
    return this.http.post(url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  
  }
}
