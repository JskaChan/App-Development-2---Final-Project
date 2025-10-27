import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cart: any[] = [];
  total: number = 0;
  shippingFee: number = 150;
  customerId = 1; 

  constructor(private cartService: CartService, private router:Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(this.customerId).subscribe({
      next: (data) => {
        this.cart = data;
        this.calculateTotal();
      },
      error: (err) => console.error('Error loading cart', err),
    });
  }

  calculateTotal(): void {
    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.total = subtotal + (this.cart.length > 0 ? this.shippingFee : 0);
  }

  increaseQuantity(index: number): void {
    const item = this.cart[index];
    item.quantity++;
    this.updateItem(item);
  }

  decreaseQuantity(index: number): void {
    const item = this.cart[index];
    if (item.quantity > 1) {
      item.quantity--;
      this.updateItem(item);
    }
  }

  removeItem(index: number): void {
    const item = this.cart[index];
    this.cartService.deleteItem(item.id).subscribe({
      next: () => {
        this.cart.splice(index, 1);
        this.calculateTotal();
      },
      error: (err) => console.error('Error removing item', err),
    });
  }

  clearCart(): void {
    const deleteCalls = this.cart.map((item) =>
      this.cartService.deleteItem(item.id)
    );
    Promise.all(deleteCalls.map((call) => call.toPromise())).then(() => {
        this.cart = []; 
        this.calculateTotal();
    });
  }

private updateItem(item: any): void {
  console.log('Updating item:', item);
  this.cartService.updateCartItem(item).subscribe({
    next: () => this.loadCart(), 
    error: (err) => console.error('Error updating item', err),
  });
}

  goToProducts() {
    this.router.navigate(['/product']);
  }

  showReceipt: boolean = false;
  showThankYou = false;
  purchaseDate: Date = new Date();

  checkout(): void {
    this.purchaseDate = new Date(); 
    this.showReceipt = true;
  }

  closeReceipt(): void {
    this.showReceipt = false;
  }

  confirmPurchase(): void {
    this.clearCart();     
    this.showReceipt = false;
    this.showThankYou = true; 
  }

  closeThankYou() {
    this.showThankYou = false;
  }

}
