import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../interfaces/article';

@Pipe({
  name: 'filterArticles'
})
export class FilterArticlesPipe implements PipeTransform {

  transform(articles: Article[], filterText: string, selectedCategory: string): Article[] {
      return articles.filter(article => {
        const textMatch = !filterText ||
          article.title.toLowerCase().includes(filterText.toLowerCase()) ||
          (article.subtitle && article.subtitle.toLowerCase().includes(filterText.toLowerCase())) ||
          (article.abstract && article.abstract.toLowerCase().includes(filterText.toLowerCase()));

        const categoryMatch = selectedCategory === 'All' || article.category === selectedCategory;
  
        return textMatch && categoryMatch;
      });
    }

}
