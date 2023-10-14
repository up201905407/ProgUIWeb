import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { Article } from '../interfaces/article';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent implements OnInit {
  articleList!: Article[];
  isLoading = true;
  selectedCategory: string = 'All';
  filterText: string = '';
  isLoggedIn$ = this.loginService.isLogged$;
  loggedIn: boolean = false;
  search: string = '';

  constructor(
    private newsService: NewsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getArticleList();
    this.isLoggedIn$.subscribe(
      (value: boolean) => {
        this.loggedIn = value;
      },
      (error: any) => {
        console.error('Error:', error);
      },
      () => {
        console.log('Observable complete');
      }
    );
  }

  // The service capture the error and the controller ignores it
  getArticleList() {
    this.newsService.getArticles().subscribe((list) => {
      this.articleList = list;
      this.isLoading = false; // Set loading to false when API request is resolved
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  removeArticle(id: number) {
    this.newsService.deleteArticle(id);
  }
}
