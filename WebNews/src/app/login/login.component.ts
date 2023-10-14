import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/user';
import { NewsService } from '../services/news.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(
      (value: boolean) => {
        this.loggedIn = value;
      },
      (error: any) => {
        console.error('Error:', error);
      },
      () => {
        console.log('Observable complete');
      }
    );
  }

  @ViewChild('userForm')
  userForm!: NgForm;

  user: User | undefined;
  public username: string = '';
  public password: string = '';
  isLoggedIn$ = this.loginService.isLogged$;
  loggedIn: boolean = false;

  login() {
    this.loginService.login(this.username, this.password).subscribe((user) => {
      if (user != undefined) {
        this.newsService.setUserApiKey(user.apikey);
        this.user = user;
      } else {
        console.log('User is undefined!');
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.newsService.setAnonymousApiKey();
    this.userForm.reset();
  }

  createArticle() {
    console.log('createArticle');
    // this.router.navigateByUrl('/articleCreate');
  }
}
