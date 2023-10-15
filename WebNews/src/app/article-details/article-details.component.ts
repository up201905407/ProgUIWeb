import { Component } from '@angular/core';
import { Article } from '../interfaces/article';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../services/news.service';
import { Alert } from '../interfaces/alert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent {

  article!: Article;
  paramId!: string | null;
  idGiven: boolean = false;
  alerts!: Alert[];
  isLoading = true;

  constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router) {
    this.alerts = [];
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.paramId = queryParams.get("id");
    })

    // Check for a numeric paramId
    if (this.paramId != null && !isNaN(+this.paramId)) {
      this.idGiven = true;
      this.newsService.getArticle(Number(this.paramId)).subscribe(
        (article) => {
          this.article = article;
          this.isLoading = false // Set loading to false when API request is resolved
        },
        (error) => {
          this.showError('Please provide a valid article id');
        });
    }
    else {
      this.showError('Please provide a numeric id');
    }
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
    })
  }

  // Back to main page
  navigateToArticleList() {
    this.router.navigate(['/article-list']); // Replace '/article-list' with the actual route of your "article-list" page
  }
}
