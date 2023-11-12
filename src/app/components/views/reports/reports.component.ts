import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { OrdersService } from './../../../services/orders/orders.service';
import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Barber } from 'src/app/models/barber.model';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

    appointments!: Appointment[];
    bestSellersOrders!: string[];
    bestRatedBarbers!: Barber[];
    mostChosenBarbers!: string[];
    barberNumber1!: Barber;
    barberNumber2!: Barber;
    barberNumber3!: Barber;
    isBestOrdersSelected!: boolean;
    isBestBarbersSelected!: boolean;
    isBestRatedBarberSelected!: boolean;
    isIncomePerDaySeleceted!: boolean;

    constructor(
        private ordersService: OrdersService,
        private barbersService: BarbersService,
        private appointmentsService: AppointmentsService
    ) { }

    ngOnInit(): void {
        this.appointmentsService.get().subscribe(appointments => {
            this.bestSellersOrders = this.appointmentsService.getBestSellersOrders(appointments);
            this.mostChosenBarbers = this.appointmentsService.getMostChosenBarber(appointments);
        })
        this.barbersService.getBarbers().subscribe(barbers => {
            const bestRatedBarbers = barbers.sort((a, b) => b.rating - a.rating);
            this.barberNumber1 = bestRatedBarbers[0];
            this.barberNumber2 = bestRatedBarbers[1];
            this.barberNumber3 = bestRatedBarbers[2];
            console.log(barbers)
        })
        console.log(this.mostChosenBarbers)

    }

    getQuantityByArrayIndex(index: number): number {
        return this.bestSellersOrders[index].length;
    }

    switchReportType(event: any): void {

        const reportType = event.target.value;

        switch (reportType) {
            case "best-orders":
                this.isBestOrdersSelected = true;
                this.isBestBarbersSelected = false;
                this.isBestRatedBarberSelected = false;
                break;

            case "best-barbers":
                this.isBestOrdersSelected = false;
                this.isBestBarbersSelected = true;
                this.isBestRatedBarberSelected = false;
                break;

            case "best-rated-barbers":
                this.isBestOrdersSelected = false;
                this.isBestBarbersSelected = false;
                this.isBestRatedBarberSelected = true;
                break;

            default:
                break;
        }
    }

}
