import { HttpParams } from '@angular/common/http';
import { OrdersService } from './../../../services/orders/orders.service';
import { BarbersService } from './../../../services/barbers/barbers.service';
import { AgendaService } from './../../../services/agenda/agenda.service';
import { Appointment } from '../../../models/appointment.model';
import { ContentChildren, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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
import { Router } from '@angular/router';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';

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
    appointments!: Appointment[];
    clients!: Client[];
    selectedOrderTitle!: string;
    selectedOrderPrice: any | undefined;
    selectedOrder!: Order;
    selectedDate!: Date;
    selectedHour!: any;
    selectedBarberName!: string;
    selectedBarber!: Barber;
    selectedClientName!: string;
    selectedClient!: Client;
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
        private oauth2Service: Oauth2Service,
        private router: Router,
        private appointmentsService: AppointmentsService,
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }

    ngOnInit(): void {
        this.getLogged();
        this.getAdmin();
        if (!this.isLogged) {
            const code_verifier = this.oauth2Service.generateCodeVerifier();
            this.tokenService.setVerifier(code_verifier);
            this.params.code_challenge = this.oauth2Service.generateCodeChallenge(code_verifier);
            const httpParams = new HttpParams({ fromObject: this.params });
            const codeUrl = this.authorize_uri + httpParams.toString();
            location.href = codeUrl;
        }
        this.appointmentsService.get().subscribe(appointments => {
            this.appointments = appointments;
        })

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
        console.log(this.selectedHour = $(`#${id}`).val()?.toString())
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
        } catch (error) { console.log(error) }
    }

    setBarberImage(imageURI: string = ''): void {
        try {
            var barber = this.barbers.filter(
                (barber) => barber.person.name == this.selectedBarberName
            )[0];
            this.selectedBarber = barber;
            imageURI = this.selectedBarber.profilePicture.data;
            $(`#barberImage`).attr('src', function () {
                return 'data:image/png;base64,' + imageURI;
            });
        } catch (error) {
            console.log(error);
        }
    }

    setClientImage(imageURI: string = ''): void {
        try {
            var client = this.clients.filter(
                (client) => client.person.name == this.selectedClientName
            )[0];
            this.selectedClient = client;
            imageURI = this.selectedClient.image.data;
            $(`#clientImage`).attr('src', function () {
                return 'data:image/png;base64,' + imageURI;
            });
        } catch (error) {
            console.log(error);
        }
    }

    setOrderImage(imageURI: string = ''): void {
        try {
            var order = this.orders.filter(
                (order) => order.title == this.selectedOrderTitle
            )[0];
            this.selectedOrder = order;
            imageURI = this.selectedOrder.image.data;
            $(`#orderImage`).attr('src', function () {
                return 'data:image/png;base64,' + imageURI;
            });
        } catch (error) {
            console.log(error);
        }

    }
    onSelectedDate(): void {
        const hours = this.appointmentsService.getPickedHourByDate(this.appointments, this.selectedDate);
        const buttons = this.el.nativeElement.querySelectorAll('button[disabled]');
        buttons.forEach((button: any) => {
            this.renderer2.removeAttribute(button, 'disabled');
            this.renderer2.removeClass(button, 'button-disabled');
        });

        for (let hour of hours) {
            const element = this.el.nativeElement.querySelector(`[value='${hour}']`);
            this.renderer2.addClass(element, 'button-disabled');
            this.renderer2.setAttribute(element, 'disabled', 'disabled');
        }
    }

    bookAppointment(): void {
        if (!this.selectedDate) {
            alert("Por favor, selecione uma data para continuar.");
            return;
        } else if (!this.selectedHour) {
            alert("Por favor, selecione um horário para continuar.");
            return;
        } else if (this.isAdmin && !this.selectedClientName) {
            alert("Por favor, selecione um cliente para continuar");
            return;
        }
        else if (!this.selectedBarber) {
            alert("Por favor, selecione um barbeiro para continuar.");
            return;
        } else if (!this.selectedOrder) {
            alert("Por favor, selecione um corte para continuar.");
            return;
        }

        const barber = this.barbers.filter(
            (barber) => barber.person.name == this.selectedBarber.person.name
        )[0];
        const order = this.orders.filter(
            (order) => order.title == this.selectedOrderTitle
        )[0];
        let client;

        if (this.isAdmin) {
            client = this.clients.filter(client => client.person.name == this.selectedClientName)[0]
        } else {
            client = this.clients.filter(
                (client) => client.person.email == this.tokenService.getUserEmail())[0];
        }


        const date = this.selectedDate;
        const offSetMinutes = date.getTimezoneOffset();
        console.log("offset => ", offSetMinutes);
        const hours = parseInt(this.selectedHour.split(":")[0]);
        const minutes = parseInt(this.selectedHour.split(":")[1]);
        date.setHours(hours - offSetMinutes / 60);
        date.setMinutes(minutes);
        const dateResult = new Date(date);


        const appointment = {
            barberId: barber.id,
            orderId: order.id,
            clientId: client.id,
            date: dateResult,
        }

        this.agendaService.setAppointment(appointment).subscribe(() => {
            alert('Agendamento realizado com sucesso!');
            this.router.navigate(['']);
        });
    }

    getAdmin(): void {
        this.isAdmin = this.tokenService.isAdmin();
    }

    getLogged(): void {
        this.isLogged = this.tokenService.isLogged();
    }

}
