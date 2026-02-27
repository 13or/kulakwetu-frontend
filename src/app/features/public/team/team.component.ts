import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-team',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Équipe | Kulakwetu');
    this.meta.updateTag({ name: 'description', content: 'Rencontrez l’équipe Kulakwetu qui construit la plateforme digitale agricole.' });
  }
}
