import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:3000/api/access';


@Injectable({
  providedIn: 'root'
})
export class AccessService {
  
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
    return throwError('Algum erro não identificado ocorreu!');
  }
  
  extractData(res: Response) {
    let body = res;
    return body || { };
  }

  _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/pdf',
      responseType : 'binary',
      Accept : 'application/pdf',
      observe : 'response',
      connection:'keep-alive'
    })
  };

  exportPDF(status, search?, dateNow?):any{
    const url=`${apiUrl}/report?status=${status}&&search=${search}&&dateNow=${dateNow}`
    window.open(url)
  }
  
  getAccess(status, search?, dateNow?): Observable<any> {
    const url=`${apiUrl}?status=${status}&&search=${search}&&dateNow=${dateNow}`
    console.log(url)
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData))
  }

  deleteAccess(id): Observable<{}> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}

