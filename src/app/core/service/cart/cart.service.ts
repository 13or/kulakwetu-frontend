import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from './cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items.asObservable();

  readonly count$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.qty, 0))
  );

  readonly total$ = this.items$.pipe(
    map(items => items.reduce((acc, it) => acc + it.qty * it.price, 0))
  );

  add(item: Omit<CartItem, 'qty'>, qty = 1): void {
    const current = this._items.getValue();
    const idx = current.findIndex(x => x.id === item.id);

    if (idx >= 0) {
      const next = [...current];
      next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      this._items.next(next);
      return;
    }

    this._items.next([...current, { ...item, qty }]);
  }

  remove(id: string): void {
    this._items.next(this._items.getValue().filter(x => x.id !== id));
  }

  clear(): void {
    this._items.next([]);
  }
}
