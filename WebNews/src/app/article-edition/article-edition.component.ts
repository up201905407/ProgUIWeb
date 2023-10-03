import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Article } from '../interfaces/article';


@Component({
  selector: 'app-article-edition',
  templateUrl: './article-edition.component.html',
  styleUrls: ['./article-edition.component.css']
})

export class ArticleEditionComponent {

  article!: Article
  imageError!: string|null;

  @ViewChild('articleForm') articleForm!: NgForm;

  constructor() { 
    this.article = {
      id: 0, 
      id_user: 0,
      abstract: '',
      subtitle: '',
      update_date: '',
      category: '',
      title: '',
      image_data: null, 
      image_media_type: '',
      body: ''
    };
  }

  ngOnInit(): void {
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // You can access the selected file here. You can also perform validation or other operations if needed.
      this.article.image_data = file;
    }
  }
  getObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  //TODO: ADD Image to form field and correct interpretation
  // this is copy paste code from the example in moodle for now

  // fileChangeEvent(fileInput: any) {
  //   this.imageError = null;
  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     // Size Filter Bytes
  //     const MAX_SIZE = 20971520;
  //     const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

  //     if (fileInput.target.files[0].size > MAX_SIZE) {
  //       this.imageError =
  //         'Maximum size allowed is ' + MAX_SIZE / 1000 + 'Mb';
  //       return false;
  //     }
  //     if (!_.includes(ALLOWED_TYPES, fileInput.target.files[0].type)) {
  //       this.imageError = 'Only Images are allowed ( JPG | PNG )';
  //       return false;
  //     }
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const image = new Image();
  //       image.src = e.target.result;
  //       image.onload = rs => {
  //         const imgBase64Path = e.target.result;
  //         this.cardImageBase64 = imgBase64Path;
  //         this.isImageSaved = true;

  //         this.article.image_media_type = fileInput.target.files[0].type;
  //         const head = this.article.image_media_type.length + 13;
  //         this.article.image_data = e.target.result.substring(head, e.target.result.length);

  //       };
  //     };
  //     reader.readAsDataURL(fileInput.target.files[0]);
  //   }
  //   return true;
  // }
  

  save(): void {
    
  }
  removeEmail(id: number) {
    
  }

  clean (): void {
    this.articleForm.resetForm();

  }
}
