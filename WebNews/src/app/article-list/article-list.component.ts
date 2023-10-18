import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Article } from '../interfaces/article';
import { LoginService } from '../services/login.service';
import { NewsService } from '../services/news.service';

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
  loggedIn: boolean = true;
  search: string = '';
  showCategories = false;

  constructor(
    private newsService: NewsService,
    private loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getArticleList();
    this.loginService.isLoggedIn$.subscribe((state) => {
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
  removeSanitizing(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  removeArticle(id: number | undefined) {
    console.log(id);
    if (id != undefined) {
      this.newsService.deleteArticle(id).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getArticleList();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  openMobileNavigation() {
    this.showCategories = true;
  }

  closeMobileNavigation(event: Event) {
    event.stopPropagation();
    this.showCategories = false;
  }
}
