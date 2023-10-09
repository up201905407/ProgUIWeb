import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private loginService: LoginService) {}

  user: User | undefined;
  public username: string = '';
  public password: string = '';
  isLogged: boolean = this.loginService.isLogged();

  login() {
    console.log('Username: ', this.username);
    console.log('Password: ', this.password);
    this.loginService.login(this.username, this.password);

    this.user = this.loginService.getUser();
    console.log(this.user);
    this.username = this.user?.surname ?? '';
  }
  logout() {
    this.loginService.logout();
  }
  createArticle() {
    console.log('createArticle');
    // this.router.navigateByUrl('/articleCreate');
  }
}
