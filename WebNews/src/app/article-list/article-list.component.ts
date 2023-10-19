import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Article } from '../interfaces/article';
import { LoginService } from '../services/login.service';
import { NewsService } from '../services/news.service';
import { Alert } from '../interfaces/alert';

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
  alerts!: Alert[];

  constructor(
    private newsService: NewsService,
    private loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {
    this.alerts = [];
  }

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
    if (id != undefined) {
      this.newsService.deleteArticle(id).subscribe({
        next: (resp) => {
          this.getArticleList();
          this.alerts.push({
            type: 'success',
            message: 'Article removed successfully',
          });
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

  close(alert: Alert) {
    const index = this.alerts.indexOf(alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }
}
