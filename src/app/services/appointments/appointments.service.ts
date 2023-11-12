import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { environment } from 'src/environments/environment';
import { Barber } from 'src/app/models/barber.model';

@Injectable({
    providedIn: 'root',
})
export class AppointmentsService {

    baseUrl = environment.resource_base_url + '/appointments';
    appointmentToDelete!: Appointment;

    constructor(private http: HttpClient) { }

    get(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}`);
    }

    getByClientId(id: string): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}` + `/user/${id}`);
    }

    getAppointmentToDelete(): Appointment {
        return this.appointmentToDelete;
    }

    setAppointmentToDelete(appointment: Appointment): void {
        {
            this.appointmentToDelete = appointment;
        }
    }

    delete(id: String): Observable<Appointment> {
        return this.http.delete<Appointment>(this.baseUrl + `/delete/${id}`);
    }

    getBestSellersOrders(appointments: Appointment[]): string[] {

        const orders = appointments.map(appointment => appointment.orderTitle);

        const groupedElements = new Map();

        for (const order of orders) {
            if (groupedElements.has(order)) {
                groupedElements.get(order).push(order);
            } else {
                groupedElements.set(order, [order]);
            }
        }

        const groupedArrays = [...groupedElements.values()];
        groupedArrays.sort((a, b) => b.length - a.length);

        console.log(groupedArrays)
        return groupedArrays;

    }

    getMostChosenBarber(appointments: Appointment[]): string[] {

        const barbers = appointments.map(appointment => appointment.barberName);

        const groupedElements = new Map();

        for (const barber of barbers) {
            if (groupedElements.has(barber)) {
                groupedElements.get(barber).push(barber);
            } else {
                groupedElements.set(barber, [barber]);
            }
        }

        const groupedArrays = [...groupedElements.values()];
        groupedArrays.sort((a, b) => b.length - a.length);

        console.log(groupedArrays)
        return groupedArrays;

    }


}
