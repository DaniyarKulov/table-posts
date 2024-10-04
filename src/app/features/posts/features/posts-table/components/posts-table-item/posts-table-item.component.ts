import { Component, input, OnInit, DestroyRef } from '@angular/core';
import { PostsRepositoryService } from '../../../../services/posts-repository.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post } from '../../../../models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts-table-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressSpinner
  ],
  templateUrl: './posts-table-item.component.html',
  styleUrl: './posts-table-item.component.css'
})
export class PostsTableItemComponent implements OnInit {
  public post: Post | null = null;
  public itemId = input.required<number>()

  constructor(
    private readonly postsRepositoryService: PostsRepositoryService,
    private readonly destroyRef: DestroyRef
  ) {
  }

  private get postById(): Observable<Post> {
    return this.postsRepositoryService.getPostById(this.itemId())
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
  }

  public ngOnInit() {
    this.postById.subscribe((post) => this.post = post)
  }
}
