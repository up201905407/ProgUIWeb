import { HttpErrorResponse } from '@angular/common/http';
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
            this.showError('Login not successful');
          }
        },
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // Handle unauthorized (401) error
              this.showError(
                'Unauthorized access. Please check your credentials.'
              );
            } else if (err.status === 403) {
              // Handle forbidden (403) error
              this.showError(
                'Access forbidden. You do not have permission to access this resource.'
              );
            } else {
              // Handle other error status codes
              this.showError(
                'An error occurred during login. Please try again later.'
              );
            }
          } else {
            // Handle non-HTTP errors
            console.error(err);
            this.showError('Login not successful');
          }
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
