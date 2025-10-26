// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-shopping-cart',
// //   templateUrl: './shopping-cart.component.html',
// //   styleUrls: ['./shopping-cart.component.css']
// // })
// // export class ShoppingCartComponent {

// // }

// import { Component, OnInit } from '@angular/core';
// import { CommonModule, DecimalPipe } from '@angular/common';
// import { CartService } from '../service/cart.service';

// @Component({
//   selector: 'app-shopping-cart',
//   standalone: true,
//   imports: [CommonModule, DecimalPipe],
//   templateUrl: './shopping-cart.component.html',
//   styleUrls: ['./shopping-cart.component.css']
// })
// export class ShoppingCartComponent implements OnInit {

//   cart: any[] = [];
//   shippingFee: number = 150;
//   total: number = 0;

//   ngOnInit(): void {
//     this.loadCart();
//     this.calculateTotal();
//   }

//   loadCart(): void {
//     const storedCart = localStorage.getItem('cart');
//     this.cart = storedCart ? JSON.parse(storedCart) : [];
//   }

//   saveCart(): void {
//     localStorage.setItem('cart', JSON.stringify(this.cart));
//     this.calculateTotal();
//   }

//   increaseQuantity(index: number): void {
//     this.cart[index].quantity++;
//     this.saveCart();
//   }

//   decreaseQuantity(index: number): void {
//     if (this.cart[index].quantity > 1) {
//       this.cart[index].quantity--;
//       this.saveCart();
//     }
//   }

//   removeItem(index: number): void {
//     this.cart.splice(index, 1);
//     this.saveCart();
//   }

//   calculateTotal(): void {
//     const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     this.total = subtotal + (this.cart.length > 0 ? this.shippingFee : 0);
//   }

//   clearCart(): void {
//     this.cart = [];
//     this.saveCart();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../service/cart.service';

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
  shippingFee: number = 100;
  customerId = 1; // temporary hardcoded until login exists

  constructor(private cartService: CartService) {}

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

  // ✅ increase quantity
  increaseQuantity(index: number): void {
    const item = this.cart[index];
    item.quantity++;
    this.updateItem(item);
  }

  // ✅ decrease quantity
  decreaseQuantity(index: number): void {
    const item = this.cart[index];
    if (item.quantity > 1) {
      item.quantity--;
      this.updateItem(item);
    }
  }

  // ✅ remove single item
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

  // ✅ clear entire cart (loop through all items)
  clearCart(): void {
    const deleteCalls = this.cart.map((item) =>
      this.cartService.deleteItem(item.id)
    );
    Promise.all(deleteCalls.map((call) => call.toPromise())).then(() => {
      this.cart = [];
      this.calculateTotal();
    });
  }

  // helper: update quantity or price
  private updateItem(item: any): void {
    this.cartService.addToCart(item).subscribe({
      next: () => this.calculateTotal(),
      error: (err) => console.error('Error updating item', err),
    });
  }
}
