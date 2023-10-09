import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/user';
import { NewsService } from '../services/news.service';

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
  }

  createArticle() {
    console.log('createArticle');
    // this.router.navigateByUrl('/articleCreate');
  }
}
