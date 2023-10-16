import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/user';
import { NewsService } from '../services/news.service';
import { Alert } from '../interfaces/alert';

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
    this.loggedIn = false;
    this.user = this.loginService.getUser();
  }

  user: User | undefined;
  public username: string = '';
  public password: string = '';
  loggedIn: boolean = false;

  login() {
    try {
      this.loginService.login(this.username, this.password).subscribe({
        next: (response) => {
          if (response.user) {
            this.newsService.setUserApiKey(response.apikey);
            this.user = response;
            this.loggedIn = true;
            this.showSuccess();
          } else {
            // Handle other status codes if needed
            this.showError('Login not successful');
          }
        },
        error: (error) => {
          // Handle error response from the server
          console.error(error);
          this.showError('Login not successful');
        },
      });
    } catch (error) {
      console.error(error);
      this.showError('Login not successful');
    }
  }

  logout() {
    this.username = '';
    this.password = '';
    this.loginService.logout();
    this.loggedIn = false;
    this.newsService.setAnonymousApiKey();
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
