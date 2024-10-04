import { Injectable } from '@angular/core';
import { Post } from '../../../models/post.model';

@Injectable()
export class TableFilterService {
  public filterPostsByTitle(posts: Post[], filterValue: string): Post[] {
    return posts.filter((post: Post) => {
      return post.title.toLowerCase().includes(filterValue.toLowerCase());
    })
  }
}
