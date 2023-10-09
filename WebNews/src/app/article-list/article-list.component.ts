import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { Article } from '../interfaces/article';

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

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.getArticleList();
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
}
