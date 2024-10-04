import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable()
export class PostsRepositoryService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public getPosts(): Observable<Array<Post>> {
    return this.http.get<Array<Post>>('/posts');
  }

  public getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`/posts/${id}`);
  }
}
