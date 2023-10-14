import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditionComponent } from './article-edition/article-edition.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'article-edition', component: ArticleEditionComponent },
  { path: 'article/:id', component: ArticleDetailsComponent },
  { path: 'article-list', component: ArticleListComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/article-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
