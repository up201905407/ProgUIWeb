import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../interfaces/article';

@Pipe({
  name: 'filterArticles'
})
export class FilterArticlesPipe implements PipeTransform {

  transform(articles: Article[], filterText: string): Article[] {
    return articles.filter((article) => {
      if (filterText === '') {
        return true;
      }

      return article.title.toLowerCase().includes(filterText) || article.subtitle.toLowerCase().includes(filterText) || article.abstract.toLowerCase().includes(filterText);
    }
    );
  }

}
