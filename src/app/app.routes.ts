import { Routes } from '@angular/router';
import { PostsRepositoryService } from './features/posts/services/posts-repository.service';
import { TableFilterService } from './features/posts/features/posts-table/services/table-filter.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts/table',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    loadComponent: () => import('./features/posts/components/posts-layout/posts-layout.component').then(m => m.PostsLayoutComponent),
    providers: [PostsRepositoryService],
    children: [
      {
        path: 'table',
        providers: [TableFilterService],
        loadComponent: () => import('./features/posts/features/posts-table/components/posts-table/posts-table.component').then(m => m.PostsTableComponent)
      },
      {
        path: 'table/:itemId',
        loadComponent: () => import('./features/posts/features/posts-table/components/posts-table-item/posts-table-item.component').then(m => m.PostsTableItemComponent)
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'posts/table',
  }
];
