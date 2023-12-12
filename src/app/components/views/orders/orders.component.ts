import { OrdersService } from './../../../services/orders/orders.service';
import * as $ from 'jquery';
import { Order } from '../../../models/order.model';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../templates/delete-dialog/delete-dialog.component';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
    orders!: Order[];

    order: Order = {
        id: '',
        title: '',
        description: '',
        price: 0.0,
        image: { data: '', type: 0 },
    };

    selectedFile!: File;
    selectedOrder!: Order;
    deletedOrder!: Order;
    submitType!: string;
    isAdmin!: boolean;
    isLogged!: boolean;

    constructor(
        private orderService: OrdersService,
        private deleteDialogComponent: DeleteDialogComponent,
        private tokenService: TokenService
    ) { }

    ngOnInit(): void {
        this.orderService.getOrders().subscribe((orders) => {
            this.orders = orders;
        });
        this.getAdmin();
    }

    openForm(event: any, order?: Order): void {
        const buttonName = event.currentTarget.getAttribute('name');

        if (buttonName == 'editOrder') {
            this.submitType = 'editOrder';
            $('h2').text('Editar Corte');
            this.order = order!;
            document.getElementById('myForm')!.style.display = 'block';
        } else if (buttonName == 'createOrder') {
            this.submitType = 'createOrder';
            $('h2').text('Criar Corte');
            $("form[name='orderForm']")
                .find("[type='text'")
                .val('')
                .end()
                .find("[type='number']")
                .val('');
            document.getElementById('myForm')!.style.display = 'block';
        }
    }

    closeForm(): void {
        document.getElementById('myForm')!.style.display = 'none';
    }

    onSelectedImage(event: any) {
        this.selectedFile = event.target.files[0];
    }

    onSubmit() {
        const title = $('[name=title]').val()?.toString()!;
        const price = +$('[name=price]').val()!;
        const description = $('[name=description]').val()?.toString()!;

        if (this.submitType == 'createOrder') {
            this.order = new Order(title, price, description, this.selectedFile);
            this.orderService.createOrder(this.order).subscribe((data) => {
                this.orderService.createOrUpdateResponse = data;
            });

            this.uploadImage(this.selectedFile);
        } else if (this.submitType == 'editOrder') {
            const id = this.order.id;

            const order = new Order(title, price, description, this.selectedFile);

            this.orderService.update(id, order).subscribe((data) => {
                this.orderService.createOrUpdateResponse = data;
                this.uploadImage(this.selectedFile);
            });

        }
    }

    uploadImage(file: File): void {
        this.orderService.uploadImage(file).subscribe((data) => {
            alert(`Corte salvo com sucesso!`);
            window.location.reload();
        });
    }

    openDeleteDialog(event: any, order: Order): void {
        this.deleteDialogComponent.openDialog(event);
        this.orderService.setOrderToDelete(order);
    }

    getLogged(): void {
        this.isLogged = this.tokenService.isLogged();
    }

    getAdmin(): void {
        this.isAdmin = this.tokenService.isAdmin();
    }
}
