import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { ProductService } from '../service/product.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
  providers: [ProductService, CartService],
})
export class ProductCategoryComponent implements OnInit {
  public productsCategory: ProductCategory[] = [];
  public selectedProduct: Product | null = null;


  constructor(private productService: ProductService, 
              private cartService: CartService,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.productService.getData().subscribe((data) => {
      this.productsCategory = data;
    });
  }

  addToCart(product: Product): void {
  const cartItem = {
    productId: product.id,
    productName: product.name,
    productDescription: product.description,
    productCategoryName: product.categoryName,
    productUnitOfMeasure: product.unitOfMeasure,
    productImageFile: product.imageFile,
    price: parseFloat(product.price),
    quantity: 1,
    status: 'Created',
    customerId: 1 
  };

  this.cartService.addToCart(cartItem).subscribe({
    next: (res) => {
      alert(`${product.name} has been added to your cart.`);
      this.router.navigate(['/cart']);
    },
    error: (err) => {
      console.error('Error adding to cart', err);
      alert('Failed to add item. Check backend logs.');
    }
  });
}

unlockScroll(): void {
  document.body.style.overflow = '';
}

openProductModal(product: Product): void {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden'; 
  }

closeProductModal(event?: MouseEvent): void {
  const target = event?.target as HTMLElement;
  if (!event || target.classList.contains('modal')) {
    this.selectedProduct = null;
    this.unlockScroll();
  }
}

onCloseClick(): void {
  this.selectedProduct = null;
  this.unlockScroll();
}

// onAddToCart(product: Product): void {
//   this.selectedProduct = null;
//   this.unlockScroll();

//   this.addToCart(product);
// }

onAddToCart(product?: Product | null): void {
  if (!product) return;
  this.selectedProduct = null;
  this.unlockScroll();
  this.addToCart(product);
}

zoomActive = false;

onImageHover(event: MouseEvent, img: HTMLImageElement): void {
  if (!this.zoomActive) return;

  const rect = img.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
}

toggleZoom(img: HTMLImageElement): void {
  this.zoomActive = !this.zoomActive;
  if (this.zoomActive) {
    img.classList.add('zoomed');
  } else {
    img.classList.remove('zoomed');
    img.style.transformOrigin = 'center center';
  }
}

resetZoom(img: HTMLImageElement): void {
  if (!this.zoomActive) {
    img.classList.remove('zoomed');
    img.style.transformOrigin = 'center center';
  }
}



}
