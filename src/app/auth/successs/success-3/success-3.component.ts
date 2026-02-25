import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-success-3',
  standalone: true,
  templateUrl: './success-3.component.html',
  styleUrl: './success-3.component.scss',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Success3Component {}
