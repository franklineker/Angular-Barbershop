import Oauth2Service from 'src/app/services/oauth2/oauth2.service';
import { TokenService } from './../token/token.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    baseUrl = environment.resource_base_url + '/orders';

    createOrUpdateResponse!: any;

    data!: any;

    orderToDelete!: Order;

    token = '' + this.tokenService.getAccessToken();
    headers_object = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
    });
    httpOptions = { headers: this.headers_object };

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    getOrders(): Observable<Order[]> {
        console.log(this.httpOptions);
        return this.http.get<Order[]>(this.baseUrl);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(
            `${this.baseUrl}` + '/save',
            order,
            // this.httpOptions
        );
    }

    uploadImage(file: File): Observable<FormData> {
        const formData = new FormData();
        formData.append('file', file);

        const id = this.createOrUpdateResponse.id;

        return this.http.put<FormData>(
            `${this.baseUrl}` + `/updateImage/${id}`,
            formData,
            // this.httpOptions
        );
    }

    update(id: String, order: Order): Observable<Order> {
        return this.http.put<Order>(
            `${this.baseUrl}` + `/update/${id}`,
            order,
            // this.httpOptions
        );
    }

    delete(id: String): Observable<Order> {
        return this.http.delete<Order>(
            `${this.baseUrl}` + `/delete/${id}`,
            // this.httpOptions
        );
    }

    setOrderToDelete(order: Order): void {
        this.orderToDelete = order;
    }

    getOrderToDelete(): Order {
        return this.orderToDelete;
    }
}
