import { HttpParams } from '@angular/common/http';
import { OrdersService } from './../../../services/orders/orders.service';
import { BarbersService } from './../../../services/barbers/barbers.service';
import { AgendaService } from './../../../services/agenda/agenda.service';
import { Appointment } from '../../../models/appointment.model';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as $ from 'jquery';
import { Barber } from '../../../models/barber.model';
import { Order } from '../../../models/order.model';
import { Client } from '../../../models/client.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { TokenService } from 'src/app/services/token/token.service';
import { environment } from 'src/environments/environment';
import Oauth2Service from 'src/app/services/oauth2/oauth2.service';

L10n.load({
    pt: {
        calendar: {
            today: 'hoje',
        },
    },
});

setCulture('pt');

@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
    barbers!: Barber[];
    orders!: Order[];
    clients!: Client[];
    selectedOrderTitle!: String;
    selectedOrderPrice: any | undefined;
    selectedOrder!: Order;
    selectedDate!: Date;
    selectedHour!: any;
    selectedBarberName!: String;
    selectedBarber!: Barber;
    isAdmin!: boolean;
    isLogged!: boolean;
    authorize_uri = environment.authorize_uri;
    params: any = {
        client_id: environment.client_id,
        redirect_uri: environment.redirect_uri,
        scope: environment.scope,
        response_type: environment.response_type,
        response_mode: environment.response_mode,
        code_challenge_method: environment.code_challenge_method,
    };

    constructor(
        private agendaService: AgendaService,
        private clientesService: ClientsService,
        private barbersService: BarbersService,
        private ordersService: OrdersService,
        private tokenService: TokenService,
        private oauth2Service: Oauth2Service
    ) { }

    ngOnInit(): void {
        this.getLogged();
        if (!this.isLogged) {
            const code_verifier = this.oauth2Service.generateCodeVerifier();
            this.tokenService.setVerifier(code_verifier);
            this.params.code_challenge = this.oauth2Service.generateCodeChallenge(code_verifier);
            const httpParams = new HttpParams({ fromObject: this.params });
            const codeUrl = this.authorize_uri + httpParams.toString();
            location.href = codeUrl;
        }

        this.barbersService.getBarbers().subscribe((barbers) => {
            this.barbers = barbers;
        });

        this.ordersService.getOrders().subscribe((orders) => {
            this.orders = orders;
        });

        this.clientesService.findClients().subscribe((clients) => {
            this.clients = clients;
        });
    }

    hourButtonSelected(id: string): void {
        $(`.hour-button`).removeAttr('is-selected');
        $(`#${id}`).attr('is-selected', function () {
            return $(this).attr('is-selected') === 'true' ? 'false' : 'true';
        });

        this.selectedHour = $(`#${id}`).val()?.toString();
    }

    getOrderPrice(): void {
        this.selectedOrderPrice = '';
        try {
            var priceWithTwoDecimal = this.orders
                .filter((order) => order.title == this.selectedOrderTitle)[0]
                .price.toFixed(2);
            this.selectedOrderPrice = priceWithTwoDecimal
                .toString()
                .replace('.', ',');
        } catch (error) { }
    }

    setBarberImage(imageURI: String = ''): void {
        try {
            var barber = this.barbers.filter(
                (barber) => barber.person.name == this.selectedBarberName
            )[0];
            this.selectedBarber = barber;
            imageURI = this.selectedBarber.profilePicture.data;
            $(`#barberImage`).attr('src', function () {
                return 'data:image/png;base64,' + imageURI;
            });
        } catch (error) { }
    }

    setOrderImage(imageURI: String = ''): void {
        try {
            var order = this.orders.filter(
                (order) => order.title == this.selectedOrderTitle
            )[0];
            this.selectedOrder = order;
            imageURI = this.selectedOrder.image.data;
            $(`#orderImage`).attr('src', function () {
                return 'data:image/png;base64,' + imageURI;
            });
        } catch (error) { }
    }

    bookAppointment(): void {
        let barber = this.barbers.filter(
            (barber) => barber.person.name == this.selectedBarber.person.name
        )[0];
        let order = this.orders.filter(
            (order) => order.title == this.selectedOrderTitle
        )[0];
        let client = this.clients.filter(
            (client) =>
                client.person.email == this.tokenService.getUserEmail()
        )[0];


        let day = this.selectedDate.getDate().toString();
        let month = (this.selectedDate.getMonth() + 1).toString();
        let year = this.selectedDate.getFullYear().toString();
        let date = `${day}/${month}/${year}`;
        let hour = this.selectedHour;

        let appointment: Appointment = {
            clientName: client.person.name,
            clientID: client.id,
            barberName: barber.person.name,
            barberID: barber.id,
            orderTitle: order.title,
            date: date,
            hour: hour,
        };


        this.agendaService.setAppointment(appointment).subscribe(() => {
            alert('Agendamento realizado com sucesso!');
        });
    }

    getAdmin(): void {
        this.isAdmin = this.tokenService.isAdmin();
    }

    getLogged(): void {
        this.isLogged = this.tokenService.isLogged();
    }
}
