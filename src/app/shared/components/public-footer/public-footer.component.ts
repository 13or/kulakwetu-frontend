import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicFooterComponent {

  readonly year = new Date().getFullYear();
}
