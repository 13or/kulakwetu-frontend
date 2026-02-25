export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  qty: number;
  category: string;
  subcategory: string;
}
