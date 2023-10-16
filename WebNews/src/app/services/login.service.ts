import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user: User | undefined;
  private logged = new BehaviorSubject<boolean>(false);
  isLogged$ = this.logged.asObservable();

  private loginUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/login';

  // private message: string;

  private httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'x-www-form-urlencoded'),
  };

  constructor(private http: HttpClient) {}

  isLogged() {
    return this.user != null;
  }

  login(name: string, pwd: string): Observable<User> {
    const usereq = new HttpParams().set('username', name).set('passwd', pwd);

    return this.http.post<User>(this.loginUrl, usereq).pipe(
      tap((user) => {
        this.user = user;
      })
      // catchError(this.handleError<User>('login'))
    );
  }

  getUser() {
    return this.user;
  }

  logout() {
    this.user = undefined;
    this.logged.next(false);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.user = undefined;
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
