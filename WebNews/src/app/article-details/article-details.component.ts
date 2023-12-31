import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../interfaces/alert';
import { Article } from '../interfaces/article';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css'],
})
export class ArticleDetailsComponent {
  article!: Article;
  paramId: number | undefined;
  idGiven: boolean = false;
  alerts!: Alert[];
  isLoading = true;
  bodyHtmlContent!: SafeHtml;
  abstractHtmlContent!: SafeHtml;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.alerts = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')! || null;
      this.newsService.getArticle(id!).subscribe(
        (article) => {
          this.article = article;
          this.isLoading = false; // Set loading to false when API request is resolved
        },
        (error) => {
          this.showError('Please provide a valid article id');
        },
        () => {
          this.updateAbstractHtmlContent();
          this.updateBodyHtmlContent();
        }
      );
    });
  }

  updateAbstractHtmlContent() {
    this.abstractHtmlContent = this.sanitizer.bypassSecurityTrustHtml(
      this.article.abstract
    );
  }

  updateBodyHtmlContent() {
    this.bodyHtmlContent = this.sanitizer.bypassSecurityTrustHtml(
      this.article.body
    );
  }

  // Alerts
  close(alert: Alert) {
    const index = this.alerts.indexOf(alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }
  showError(errorMessage: string) {
    this.alerts.push({
      type: 'danger',
      message: errorMessage,
    });
  }

  // Back to main page
  navigateToArticleList() {
    this.router.navigate(['/article-list']); // Replace '/article-list' with the actual route of your "article-list" page
  }
}
