import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-posts-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './posts-layout.component.html',
  styleUrl: './posts-layout.component.css'
})
export class PostsLayoutComponent {

}
