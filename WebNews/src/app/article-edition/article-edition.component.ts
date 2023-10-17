import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as _ from 'lodash';
import { Alert } from '../interfaces/alert';
import { Article } from '../interfaces/article';
import { LoginService } from '../services/login.service';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-article-edition',
  templateUrl: './article-edition.component.html',
  styleUrls: ['./article-edition.component.css'],
})
export class ArticleEditionComponent {
  alerts!: Alert[];
  articleList!: Article[];
  article!: Article;
  imageError!: string | null;
  isImageSaved: boolean = false;
  cardImageBase64!: string;
  idList: number[] = [];
  paramId!: number | null;
  idGiven: boolean = false;
  isLoading = true;
  public Editor = ClassicEditor;
  bodyHtmlContent!: SafeHtml;
  abstractHtmlContent!: SafeHtml;

  @ViewChild('articleForm') articleForm!: NgForm;

  constructor(
    private loginService: LoginService,
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.article = {
      id_user: 0,
      abstract: '',
      subtitle: '',
      update_date: '',
      category: '',
      title: '',
      image_data: '',
      image_media_type: '',
      body: '',
      username: 'placeholder_username',
    };
    this.alerts = [];
  }

  ngOnInit(): void {
    this.getArticleList();
    this.route.paramMap.subscribe((params) => {
      // this.mailId = params.get('id') ?? 'DefaultMailId';
      this.paramId = +params.get('id')! || null;
    });
    // Check for a numeric paramId
    if (this.paramId != null && !isNaN(+this.paramId)) {
      this.idGiven = true;
      this.newsService.getArticle(this.paramId).subscribe(
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
    } else {
      this.isLoading = false;
    }
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

  getArticleList() {
    this.newsService.getArticles().subscribe((list) => {
      this.articleList = list;
      console.log(list);
    });
  }

  // Alerts
  close(alert: Alert) {
    const index = this.alerts.indexOf(alert);
    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }

  showSuccess() {
    this.alerts.push({
      type: 'success',
      message: 'Successfully created article',
    });
  }
  showError(errorMessage: string) {
    this.alerts.push({
      type: 'danger',
      message: errorMessage,
    });
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const MAX_SIZE = 20971520;
      const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

      if (fileInput.target.files[0].size > MAX_SIZE) {
        this.imageError = 'Maximum size allowed is ' + MAX_SIZE / 1000 + 'Mb';
        return false;
      }
      if (!_.includes(ALLOWED_TYPES, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;

          this.article.image_media_type = fileInput.target.files[0].type;
          const head = this.article.image_media_type.length + 13;
          this.article.image_data = e.target.result.substring(
            head,
            e.target.result.length
          );
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return true;
  }

  save(): void {
    this.article.update_date = this.getCurrentDateTime();
    if (this.loginService.getUser()) {
      let user = this.loginService.getUser();
      if (user !== undefined) {
        this.article.username = user.username;
      }
    }
    // Update article
    if (this.idGiven) {
      this.newsService.updateArticle(this.article).subscribe(
        (article) => {
          this.showSuccess();
        },
        (error) => {
          this.showError('Could not update Article');
        }
      );
    }
    // New article
    else {
      this.newsService.createArticle(this.article).subscribe(
        (article) => {
          this.showSuccess();
        },
        (error) => {
          this.showError('Could not create Article');
        }
      );
    }
    //Update the list after creation
    this.getArticleList();
  }

  clean(): void {
    this.articleForm.resetForm();
    // Reset image-related properties
    this.article.image_data = '';
    this.article.image_media_type = '';
    this.cardImageBase64 = ''; // Clear the image display
    this.isImageSaved = false;
  }

  // Back to main page
  navigateToArticleList() {
    this.router.navigate(['/article-list']);
  }

  getCurrentDateTime(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
