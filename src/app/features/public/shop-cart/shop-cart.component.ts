import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-shop-cart',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss',
})
export class ShopCartComponent {

}
