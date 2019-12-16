import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrlcrm = 'http://localhost:3000/api/peoplecrm';
const _httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers':
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PeopleCrmService {
  
  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error('erro status: ',error.status, 'err: ',JSON.stringify(error.error))
    }
    if(`${error.error}`=='Fail -> Email is already in use!')    
        return throwError('Já existe alguém cadastrado com esse e-mail!');
    return throwError('Algum erro não identificado ocorreu!');
  }
  
  extractData(res: Response) {
    let body = res;
    return body || { };
  }
 
  sendMsg(id: string, data): Observable<any> {
    const url = `${apiUrlcrm}/messages/${id}`;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMsg(email, status?, search?): Observable<any> {
    const url = `${apiUrlcrm}/messages?email=${email}&&status=${status}&&search=${search}`;
    console.log(url)
    return this.http.get(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

 markSeenMessage(id: any): Observable<any> {
    let data={status:true}
    const url = `${apiUrlcrm}/messages/${id}`;
    console.log(url)
    return this.http.patch(url, data, _httpOptions)
      .pipe(
        catchError(this.handleError)
      );
}

getPostFilter(email, status, search): Observable<any>
  {
    const url = `${apiUrlcrm}/messages?email=${email}&&status=${status}&&search=${search}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError))
  }

  sendEmail(data): Observable<any> {
    const url = `${apiUrlcrm}/email`;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
