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
  loggedIn: boolean = false;
  search: string = '';

  constructor(
    private newsService: NewsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getArticleList();
    this.loginService.isLogged$.subscribe((state) => {
      this.loggedIn = state;
    });
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

  removeArticle(id: number | undefined) {
    console.log('remove article');
    console.log(id);
    if (id != undefined) {
      this.newsService.deleteArticle(id).subscribe(
        (resp) => {
          console.log(resp);
          this.getArticleList();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
