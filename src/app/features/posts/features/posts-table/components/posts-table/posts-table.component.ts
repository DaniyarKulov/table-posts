import { Component, OnInit, DestroyRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router, ActivatedRoute, Params } from '@angular/router';
import { PostsRepositoryService } from '../../../../services/posts-repository.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../../../models/post.model';
import { displayColumns } from '../../constants/display-columns';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap, take } from 'rxjs';
import { TableFilterService } from '../../services/table-filter.service';

@Component({
  selector: 'app-posts-table',
  standalone: true,
  imports: [
    RouterOutlet,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './posts-table.component.html',
  styleUrl: './posts-table.component.css'
})
export class PostsTableComponent implements OnInit {
  public filterForm: FormControl<string> = new FormControl<string>('', { nonNullable: true })
  public displayedColumns: string[] = displayColumns
  public posts: Array<Post> = []
  private initialPosts: Array<Post> = []

  constructor(
    private readonly postsRepositoryService: PostsRepositoryService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroyRef: DestroyRef,
    private readonly tableFilterService: TableFilterService,
  ) {
  }

  private get queryParams(): Observable<Array<Post>> {
    return this.activatedRoute.queryParams
      .pipe(
        take(1),
        switchMap((params) => this.getPosts(params))
      )
  }

  private get filterFormValueChanged(): Observable<string> {
    return this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((filterValue) => filterValue && filterValue.trim()),
        takeUntilDestroyed(this.destroyRef),
      )
  }

  public ngOnInit() {
    this.queryParams.subscribe((posts) => this.posts = posts)

    this.filterFormValueChanged.subscribe((filterValue) => this.updateQueryParamsAndFilterPosts(filterValue))
  }

  private getPosts(params: Params): Observable<Array<Post>> {
    return this.postsRepositoryService.getPosts()
      .pipe(
        map((posts) => this.filterPostsByParams(params, posts)),
        takeUntilDestroyed(this.destroyRef)
      )
  }

  private filterPostsByParams(params: Params, posts: Array<Post>): Array<Post> {
    this.initialPosts = posts
    const filterPamars = params['filter']

    if (filterPamars) {
      this.handleQueryParams(filterPamars)
      return this.posts
    }

    return posts
  }

  private handleQueryParams(queryParam: string): void {
    this.filterForm.setValue(queryParam);
    this.filterPostsByTitle(queryParam)
  }

  private updateQueryParamsAndFilterPosts(filterValue: string): void {
    this.router.navigate([], {
      queryParams: { filter: filterValue },
      queryParamsHandling: 'merge'
    }).then();

    if (filterValue) {
      return this.filterPostsByTitle(filterValue);
    }

    this.posts = this.initialPosts;
  }

  private filterPostsByTitle(filterValue: string): void {
    this.posts = this.tableFilterService.filterPostsByTitle(this.initialPosts, filterValue);
  }

  // 1. Сделал бы virtual scroll
  // 2. Добавил кэширование на фронте что бы данные доставать из словаря по id,
  // благодаря чему оптимизируется поиск значения и не нужно будет постоянно отправлять запросы и если данные не найдутся в словаре, то пойдет запрос на бэк
  // 3. Вынес бы всю бизнес логику в отдельный сервис, что бы скрыть логику от компонента для дальнейшей поддержки, масштабируемости и простоты тестирования
}
