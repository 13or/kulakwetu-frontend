import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-shop-detail',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-detail.component.html',
  styleUrl: './shop-detail.component.scss',
})
export class ShopDetailComponent {

}
