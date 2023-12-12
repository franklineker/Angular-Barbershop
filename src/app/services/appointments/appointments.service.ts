import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';


@Injectable({
    providedIn: 'root',
})
export class AppointmentsService {

    baseUrl = environment.resource_base_url + '/appointments';
    appointmentToDelete!: Appointment;

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe
    ) { }

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
        this.appointmentToDelete = appointment;
    }

    delete(id: String): Observable<Appointment> {
        return this.http.delete<Appointment>(this.baseUrl + `/delete/${id}`);
    }

    getBestSellersOrders(appointments: Appointment[]): string[] {

        const orders = appointments.map(appointment => appointment.order.title);

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

        return groupedArrays;

    }

    sortedByDate(appointments: Appointment[]): Appointment[] {
        let result: Appointment[] = [];

        const sortedByDate = appointments.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const numA = dateA.getTime();
            const numB = dateB.getTime();

            return numA - numB;
        })
        return sortedByDate;
    }

    getCurrentMonthAppointments(appointments: Appointment[]): Appointment[] {
        const appointmentsMonth = appointments.filter(appointment => {
            const currentDate = new Date();
            const appointmentDate = new Date(appointment.date);

            return currentDate.getMonth() + 1 == appointmentDate.getMonth() + 1;
        })

        return appointmentsMonth;
    }

    getLastDaysAppointments(appointments: Appointment[], quantityOfDays: number): [Date, Appointment[]][] {
        const sortedByDate = this.sortedByDate(appointments);

        const lastDaysAppointments = sortedByDate.reduce((accumulator, current) => {

            let date = new Date(current.date).toString();
            date = this.datePipe.transform(date, "yyyy/MM/dd")!;

            if (!accumulator.has(date)) {
                accumulator.set(date, [current]);
            } else {
                accumulator.get(date)!.push(current);
            }


            return accumulator;

        }, new Map<string, Appointment[]>());

        let result = [];

        for (let item of lastDaysAppointments) {
            result.push(item)
        }

        const a = result.slice(0, quantityOfDays);

        return a.map(item => {
            const date = new Date(item[0]);

            return [date, item[1]]
        });

    }

    getMostChosenBarber(appointments: Appointment[]): string[] {

        const barbers = appointments.map(appointment => appointment.barber.person.name);

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

        return groupedArrays;

    }

    getDateAndPrice(appointments: Appointment[]): [string, number][] {

        const array = appointments.map(appointment => {
            const date = new Date(appointment.date);
            const customDate = this.datePipe.transform(date, "dd/MM/yyyy")!;
            const price = appointment.order.price;

            return { date: customDate, price: price };
        })

        const map = array.reduce((accumulator, current) => {
            const { date, price } = current;

            if (!accumulator.has(date)) {
                accumulator.set(date, price);
            } else {
                accumulator.set(date, accumulator.get(date)! + price)
            }

            return accumulator;

        }, new Map<string, number>())

        const arrayFormMap = Array.from(map);

        const withCustomDate = arrayFormMap.map(item => {

            const customDate = item[0].split("/")[0];
            item[0] = customDate;

            return item;
        })

        const dateAndPriceArray = withCustomDate.sort((a, b) => {
            const numA = parseInt(a[0], 10);
            const numB = parseInt(b[0], 10);

            return numA - numB;
        });

        return dateAndPriceArray;
    }

    getPickedHourByDate(appointments: Appointment[], date: Date): string[] {
        const customDate = this.datePipe.transform(date, "yyyy/MM/dd");
        const hoursByDate = appointments
            .filter(appointment => {
                const appointmentCustomDate = this.datePipe.transform(appointment.date, "yyyy/MM/dd");
                return customDate == appointmentCustomDate;
            })
            .map(appointment => {
                const date = new Date(appointment.date);
                const offSetMinutes = date.getTimezoneOffset();
                const hours = date.getHours() + offSetMinutes / 60;
                const minutes = date.getMinutes();
                const formatedHour = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes}`;

                return formatedHour;
            })
        return hoursByDate;
    }


}
