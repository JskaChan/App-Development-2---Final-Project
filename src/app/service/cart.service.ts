// import { Injectable } from '@angular/core';
// import { BaseHttpService } from './base-http.service';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService extends BaseHttpService{

//   constructor(protected override http: HttpClient) { 
//     // super(http, '/api/cart')
//     super(http, '/api/orderitem')
//   }

//   // ✅ Explicit endpoint methods
//   getByCustomer(customerId: number, status: number): Observable<any> {
//     return this.http.get(`${environment.apiBaseUrl}/api/orderitem/${customerId}?status=${status}`);
//   }

//   addItem(item: any): Observable<any> {
//     return this.http.put(`${environment.apiBaseUrl}/api/orderitem`, item);
//   }

// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/api/orderitem`;

  constructor(private http: HttpClient) {}

  addToCart(item: any): Observable<any> {
    return this.http.put(this.apiUrl, item);
  }

  getCart(customerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${customerId}?status=0`);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateCartItem(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${item.id}`, item);

  }

}
