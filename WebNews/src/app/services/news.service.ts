import { Injectable } from '@angular/core';
import { Article } from '../interfaces/article';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private newsUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/articles'; // URL to web api
  private articleUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/article'; // URL to web api

  constructor(private http: HttpClient) {}

  // Set the corresponding APIKEY accordig to the received by email
  private APIKEY: string | undefined;
  private APIKEY_ANON = 'ANON06_340';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'PUIRESTAUTH apikey=' + this.APIKEY_ANON,
    }),
  };

  // Modifies the APIKEY with the received value
  setUserApiKey(apikey: string) {
    this.APIKEY = apikey;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'PUIRESTAUTH apikey=' + this.APIKEY,
      }),
    };
    console.log('Apikey successfully changed ' + this.APIKEY);
  }

  setAnonymousApiKey() {
    this.setUserApiKey(this.APIKEY_ANON);
  }

  // Returns the list of news contain elements with the following fields:
  // {"id":...,
  //  "id_user":...,
  //  "abstract":...,
  //  "subtitle":...,
  //  "update_date":...,
  //  "category":...,
  //  "title":...,
  //  "thumbnail_image":...,
  //  "thumbnail_media_type":...}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.newsUrl, this.httpOptions);
  }

  deleteArticle(article_id: number): Observable<Article> {
    const url = `${this.articleUrl}/${article_id}`;
    return this.http.delete<Article>(url, this.httpOptions);
  }

  getArticle(id: number): Observable<Article> {
    console.log('Requesting article id=' + id);
    const url = `${this.articleUrl}/${id}`;
    return this.http.get<Article>(url, this.httpOptions);
  }

  updateArticle(article: Article): Observable<Article> {
    console.log('Updating article id=' + article.id);
    return this.http.post<Article>(this.articleUrl, article, this.httpOptions);
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articleUrl, article, this.httpOptions);
  }
}
