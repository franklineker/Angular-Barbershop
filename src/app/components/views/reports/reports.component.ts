import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Barber } from 'src/app/models/barber.model';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

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
    lastDaysAppointments!: [Date, Appointment[]][];
    dateAndPriceArray!: [string, number][];
    barberNumber1!: Barber;
    barberNumber2!: Barber;
    barberNumber3!: Barber;
    isTypeCollapsed = true;
    isMonthCollapsed = true;
    isBestOrdersSelected!: boolean;
    isBestBarbersSelected!: boolean;
    isBestRatedBarberSelected!: boolean;
    isIncomePerDaySeleceted!: boolean;
    isActivityOfLastSevenDaysSelected!: boolean;
    months = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    constructor(
        private barbersService: BarbersService,
        private appointmentsService: AppointmentsService,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.appointmentsService.get().subscribe(appointments => {
            const currentMonthAppointments = this.appointmentsService.getCurrentMonthAppointments(appointments)
            this.bestSellersOrders = this.appointmentsService.getBestSellersOrders(currentMonthAppointments);
            this.mostChosenBarbers = this.appointmentsService.getMostChosenBarber(currentMonthAppointments);
            this.appointments = appointments;
        })
        this.barbersService.getBarbers().subscribe(barbers => {
            const bestRatedBarbers = barbers.sort((a, b) => b.currentRating - a.currentRating);
            this.barberNumber1 = bestRatedBarbers[0];
            this.barberNumber2 = bestRatedBarbers[1];
            this.barberNumber3 = bestRatedBarbers[2];
        })

    }

    getQuantityByArrayIndex(index: number): number {
        return this.bestSellersOrders[index].length;
    }


    switchMonth(event: any) {
        this.isMonthCollapsed = !this.isMonthCollapsed;
    }

    getLastDaysAppointments(): void {
        this.lastDaysAppointments = this.appointmentsService.getLastDaysAppointments(this.appointments, 7);
    }

    getDateAndPrice(): void {
        this.dateAndPriceArray = this.appointmentsService.getDateAndPrice(this.appointments);
    }

    exportXlsx(): void {
        const date = new Date();

        let json = [];

        const currentMonthAppointments = this.appointmentsService.getCurrentMonthAppointments(this.appointments);
        for (let appointment of currentMonthAppointments) {
            const date = new Date(appointment.date);
            const offSetMinutes = date.getTimezoneOffset();
            const hours = date.getHours() + offSetMinutes / 60;
            const minutes = date.getMinutes();
            const formatedHour = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes}`;

            const jsonInstace = {
                Cliente: appointment.client.person.name,
                Barbeiro: appointment.barber.person.name,
                Corte: appointment.order.title,
                Preço: appointment.order.price.toFixed(2).replace(".", ","),
                Data: this.datePipe.transform(appointment.date, "dd/MM/yyyy")!,
                Hora: formatedHour
            }

            json.push(jsonInstace);

        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        const fileName = "atendimentos-" + this.datePipe.transform(date, "dd-MM-yyyyTHH:mm:ss")! + ".xlsx";
        console.log(fileName)
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, fileName)

    }

    switchReportType(event: any): void {

        this.isTypeCollapsed = !this.isTypeCollapsed;
        const reportType = event.target.getAttribute("id");
        $("#report-title").text(event.target.textContent);

        switch (reportType) {
            case "best-orders":
                this.isBestOrdersSelected = true;
                this.isBestBarbersSelected = false;
                this.isBestRatedBarberSelected = false;
                this.isIncomePerDaySeleceted = false;
                this.isActivityOfLastSevenDaysSelected = false
                break;

            case "best-barbers":
                this.isBestOrdersSelected = false;
                this.isBestBarbersSelected = true;
                this.isBestRatedBarberSelected = false;
                this.isIncomePerDaySeleceted = false;
                this.isActivityOfLastSevenDaysSelected = false
                break;

            case "best-rated-barbers":
                this.isBestOrdersSelected = false;
                this.isBestBarbersSelected = false;
                this.isBestRatedBarberSelected = true;
                this.isIncomePerDaySeleceted = false;
                this.isActivityOfLastSevenDaysSelected = false
                break;
            case "incomesPerDay":
                this.isBestOrdersSelected = false;
                this.isBestBarbersSelected = false;
                this.isBestRatedBarberSelected = false;
                this.isIncomePerDaySeleceted = true;
                this.isActivityOfLastSevenDaysSelected = false
                break;
            case "activityOfLastSevenDays":
                this.isBestOrdersSelected = false;
                this.isBestBarbersSelected = false;
                this.isBestRatedBarberSelected = false;
                this.isIncomePerDaySeleceted = false;
                this.isActivityOfLastSevenDaysSelected = true;
                break;

            default:
                break;
        }
    }
}
