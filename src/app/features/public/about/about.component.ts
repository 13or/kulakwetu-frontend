import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('À propos | Kulakwetu');
    this.meta.updateTag({ name: 'description', content: 'Page à propos du frontend Angular 20 connecté à l’API Spring Boot kulakwetu-api.' });
  }
}

