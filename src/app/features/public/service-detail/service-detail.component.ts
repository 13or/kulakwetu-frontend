import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-service-detail',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Détail service | Kulakwetu');
    this.meta.updateTag({ name: 'description', content: 'Consultez le détail d’un service Kulakwetu et ses bénéfices pour votre activité.' });
  }
}
