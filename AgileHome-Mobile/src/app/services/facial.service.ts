import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiDetection = 'http://localhost:3000/api/detection';
const apiRecognition = 'http://localhost:3000/api/recognition';
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
export class FacialService {
  
  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      //console.error('erro status: ',error.status, 'err: ',JSON.stringify(error.error))
    }
    if(`${error.error.text}`=='Status of recognition modify!')    
        return throwError('Detecção habilitada!');
    if(`${error.error.text}`=='Face of recognition modify!')    
        return throwError('Face Excluida com sucesso!');
        
    return throwError('Algum erro não identificado ocorreu!');
  }
  
  extractData(res: Response) {
    let body = res;
    return body || { };
  }
  
  addFace(identify): Observable<any> {
    const url = `${apiDetection}/1?identify=${identify}`;
    console.log(url)
    return this.http.put(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  deleteFace(id): Observable<any> {
    const url = `${apiRecognition}/${id}`;
    console.log(url)
    return this.http.patch(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
}
  