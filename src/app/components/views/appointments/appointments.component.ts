import { AppointmentsService } from './../../../services/appointments/appointments.service';
import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../models/appointment.model';
import { Barber } from '../../../models/barber.model';
import { TokenService } from 'src/app/services/token/token.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Client } from 'src/app/models/client.model';
import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { DeleteDialogComponent } from '../../templates/delete-dialog/delete-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
    appointments!: Appointment[];
    barber!: Barber;
    isAdmin!: boolean;
    isClient!: boolean;
    isBarber!: boolean;
    collapsedAppointments!: boolean[];

    constructor(
        private appointmentsService: AppointmentsService,
        private clientsService: ClientsService,
        private tokenService: TokenService,
        private barbersService: BarbersService,
        private deleteDialogComponent: DeleteDialogComponent,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.getIsAdmin();
        this.getIsClient();
        this.getIsBarber();

        this.appointmentsService.get().subscribe((appointments) => {
            this.appointments = appointments.map(appointment => {
                const date = new Date(appointment.date);
                const offSetMinutes = date.getTimezoneOffset();
                const hours = parseInt(date.getHours().toString());
                const minutes = parseInt(date.getMinutes().toString());
                date.setHours(hours + offSetMinutes / 60);
                date.setMinutes(minutes);
                appointment.date = date.toString();
                console.log(appointment.date)
                appointment.formatedDate = this.datePipe.transform(appointment.date, "dd/MM/yyyy")!;
                appointment.formatedHour = this.datePipe.transform(appointment.date, "HH:mm:ss")!;
                return appointment;
            });
            if (this.isAdmin) {
            } else if (this.isClient) {
                const email = this.tokenService.getUserEmail()!;
                const handleClient = (client: Client) => {
                    this.appointments = this.getAppointmentsByClientId(client.id);
                    if (this.appointments.length < 1) {
                        alert("Você não possui nenhum agendamento.");
                    }
                };
                this.clientsService.findClientByEmail(email, handleClient);
            } else if (this.isBarber) {
                const email = this.tokenService.getUserEmail()!;
                const handleBarber = (barber: Barber) => {
                    this.appointments = this.getAppointmentsByBarberId(barber.id);
                    if (this.appointments.length < 1) {
                        alert("Você não possui nenhum agendamento.");
                    }
                };
                this.barbersService.findBarberByEmail(email, handleBarber);
            }

            this.collapsedAppointments = new Array(this.appointments.length).fill(true);
        });
    }

    toggleCollapse(index: number) {
        this.collapsedAppointments[index] = !this.collapsedAppointments[index];
    }

    openDeleteDialog(event: any, appointment: Appointment): void {
        this.deleteDialogComponent.openDialog(event);
        this.appointmentsService.setAppointmentToDelete(appointment);
    }

    getIsAdmin(): void {
        this.isAdmin = this.tokenService.isAdmin();
    }

    getIsClient(): void {
        this.isClient = this.tokenService.isClient();
    }

    getIsBarber(): void {
        this.isBarber = this.tokenService.isBarber();
    }

    getAppointmentsByClientId(id: string): Appointment[] {
        const clientAppointments = this.appointments.filter(appointment => appointment.client.id == id);
        return clientAppointments;
    }

    getAppointmentsByBarberId(id: string): Appointment[] {
        const barberAppointments = this.appointments.filter(appointment => appointment.barber.id == id);
        return barberAppointments;
    }
}
