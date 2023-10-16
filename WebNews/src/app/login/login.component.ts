import { Component, OnInit } from '@angular/core';
import { Alert } from '../interfaces/alert';
import { User } from '../interfaces/user';
import { LoginService } from '../services/login.service';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  alerts!: Alert[];
  constructor(
    private loginService: LoginService,
    private newsService: NewsService
  ) {
    this.alerts = [];
  }

  ngOnInit(): void {
    this.loggedIn = this.loginService.isLogged();
    this.user = this.loginService.getUser();
  }

  user: User | undefined;
  public username: string = '';
  public password: string = '';
  loggedIn: boolean = false;

  login() {
    try {
      this.loginService.login(this.username, this.password).subscribe({
        next: (user) => {
          if (user != undefined) {
            this.showSuccess();
            this.loggedIn = true;
            this.user = user;
            this.newsService.setUserApiKey(user.apikey);
          } else {
            this.showError('Login not successful');
            this.username = '';
            this.password = '';
          }
        },
        error: (err) => {
          console.log('HTTP Error', err);
          this.showError('Login not successful');
        },
        complete: () => console.log('HTTP request completed.'),
      });
    } catch (error) {
      console.error(error);
      this.showError('Login not successful');
    }
  }

  logout() {
    try {
      this.username = '';
      this.password = '';
      this.loginService.logout();
      this.loggedIn = false;
      this.newsService.setAnonymousApiKey();
    } catch (error) {
      console.log(error);
    }
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
      message: 'Login successful',
    });
  }
  showError(errorMessage: string) {
    this.alerts.push({
      type: 'danger',
      message: errorMessage,
    });
  }
}
