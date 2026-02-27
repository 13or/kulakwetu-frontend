import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Services | Kulakwetu');
    this.meta.updateTag({ name: 'description', content: 'Explorez les services Kulakwetu pour la gestion agricole, la vente et la distribution.' });
  }
}
