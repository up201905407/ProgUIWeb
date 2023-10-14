import { Component, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/user';
import { NewsService } from '../services/news.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private newsService: NewsService
  ) {}

  @ViewChild('userForm')
  userForm!: NgForm;

  user: User | undefined;
  public username: string = '';
  public password: string = '';
  isLogged: boolean | undefined;

  login() {
    this.loginService.login(this.username, this.password).subscribe((user) => {
      if (user != undefined) {
        this.newsService.setUserApiKey(user.apikey);
        this.user = user;
        this.isLogged = this.loginService.isLogged();
      } else {
        console.log('User is undefined!');
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.isLogged = this.loginService.isLogged();
    this.newsService.setAnonymousApiKey();
    this.userForm.reset();
  }

  createArticle() {
    console.log('createArticle');
    // this.router.navigateByUrl('/articleCreate');
  }
}
