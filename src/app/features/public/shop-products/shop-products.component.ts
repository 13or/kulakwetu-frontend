import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-shop-products',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-products.component.html',
  styleUrl: './shop-products.component.scss',
})
export class ShopProductsComponent {

}
