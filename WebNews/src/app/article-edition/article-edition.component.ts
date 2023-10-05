import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Article } from '../interfaces/article';
import * as _ from 'lodash';
import { NewsService } from '../services/news.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';

interface Alert {
	type: string;
	message: string;
}


@Component({
  selector: 'app-article-edition',
  templateUrl: './article-edition.component.html',
  styleUrls: ['./article-edition.component.css'],
})

export class ArticleEditionComponent{
  alerts!: Alert[];
  
  articleList!: Article[];
  article!: Article
  imageError!: string|null;
  isImageSaved: boolean=false;
  cardImageBase64!: string; 
  idList: number[]=[];
  paramId!: string | null;
  idGiven: boolean=false;
  public Editor = ClassicEditor;

  @ViewChild('articleForm') articleForm!: NgForm;  
  

  constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router, ) { 
    this.article = {
      id: 0, 
      id_user: 0,
      abstract: '',
      subtitle: '',
      update_date: '',
      category: '',
      title: '',
      image_data: '', 
      image_media_type: '',
      body: '',
      username:"placeholder_username"
    };
    this.alerts=[];
  }

  ngOnInit(): void {
    this.getArticleList();
    this.route.queryParamMap.subscribe(queryParams => {
      this.paramId = queryParams.get("id");
    })
    
    
    if(this.paramId!=null){
      this.idGiven=true;
      // wait for api key
      this.newsService.getArticle(Number(this.paramId)).subscribe(
        (article) => {
        this.article = article;
      },
      (error)=>{
        console.log("error: "+error)
      });
    }
    
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

  showSuccess(){
    this.alerts.push({
      type: 'success',
      message: 'Successfully created article',
    })
  }
  showError(){
    this.alerts.push({
      type: 'danger',
      message: 'There was an error trying to create the article',
    })
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const MAX_SIZE = 20971520;
      const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

      if (fileInput.target.files[0].size > MAX_SIZE) {
        this.imageError =
          'Maximum size allowed is ' + MAX_SIZE / 1000 + 'Mb';
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
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;

          this.article.image_media_type = fileInput.target.files[0].type;
          const head = this.article.image_media_type.length + 13;
          this.article.image_data = e.target.result.substring(head, e.target.result.length);

        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return true;
  }

  //Find the smallest available id
  getNextAvailableId(): number {
    const usedIds = new Set(this.articleList.map(article => article.id));
    let id = 1; 
    while (usedIds.has(id)) {
      id++; 
    }
    return id;
  }

  save(): void {
    this.article.update_date=this.getCurrentDateTime();
    // Update article
    if(this.idGiven){
      this.newsService.updateArticle(this.article).subscribe(
        (article) => {
          this.showSuccess();
        },
        (error)=>{
          this.showError();
        });
    }
    // New article
    else{
      // check for a unique id
      this.article.id=this.getNextAvailableId();
      //TODO: Update article with current username
      this.article.username="placeholder_name"
      this.newsService.createArticle(this.article).subscribe(
        (article) => {
          this.showSuccess();
        },
        (error)=>{
          this.showError();
        });
      
    }
    //Update the list after creation
    this.getArticleList();

  }

  clean (): void {
    this.articleForm.resetForm();
    // Reset image-related properties
    this.article.image_data = '';
    this.article.image_media_type = '';
    this.cardImageBase64 = ''; // Clear the image display
    this.isImageSaved = false;
  }

  // Back to main page
  navigateToArticleList() {
    this.router.navigate(['/article-list']); // Replace '/article-list' with the actual route of your "article-list" page
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
