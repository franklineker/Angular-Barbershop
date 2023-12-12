import { CommentsService } from './../../../services/comments/comments.service';
import { OrdersService } from './../../../services/orders/orders.service';
import * as $ from 'jquery';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { DeleteDialogService } from 'src/app/services/deleteDialog/delete-dialog.service';
import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { ChairsService } from 'src/app/services/chairs/chairs.service';


@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {


    constructor(
        private ordersService: OrdersService,
        private clientsService: ClientsService,
        private deleteDialogService: DeleteDialogService,
        private barbersService: BarbersService,
        private appointmentsService: AppointmentsService,
        private chairsService: ChairsService,
        private commentsService: CommentsService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {

    }

    cancel(): void {
        this.dialog.closeAll()
    }

    openDialog(event: any): void {

        const deleteType = event.currentTarget.getAttribute("name")
        this.deleteDialogService.setDeleteType(deleteType)

        console.log(this.deleteDialogService.getDeleteType())
        const baseString = "Tem certeza que deseja excluir este "

        this.dialog.open(DeleteDialogComponent, {
            width: '300px',
            height: '200px',
            position: { top: '100px' }
        })

        switch (this.deleteDialogService.getDeleteType()) {
            case "deleteClient":
                $("#deleteTitle").text("Excluir Cliente")
                $("#deleteQuestion").text(`${baseString}` + "cliente?")
                break

            case "deleteOrder":
                $("#deleteTitle").text("Excluir Corte")
                $("#deleteQuestion").text(`${baseString}` + "corte?")
                break

            case "deleteBarber":
                $("#deleteTitle").text("Excluir Barbeiro")
                $("#deleteQuestion").text(`${baseString}` + "barbeiro?")
                break

            case "deleteAppointment":
                $("#deleteTitle").text("Excluir Agendamento")
                $("#deleteQuestion").text(`${baseString}` + "agendamento?")
                break

            case "deleteChair":
                $("#deleteTitle").text("Excluir Cadeira")
                $("#deleteQuestion").text(`${baseString}` + "cadeira?")
                break

            case "deleteComment":
                $("#deleteTitle").text("Excluir Comentário")
                $("#deleteQuestion").text(`${baseString}` + "comentário?")
                break


        }
    }

    onDelete(): void {

        console.log(this.deleteDialogService.getDeleteType())

        switch (this.deleteDialogService.getDeleteType()) {

            case "deleteClient":

                const client = this.clientsService.getClientToDelete()
                console.log(client.id)

                if (client) {
                    this.clientsService.delete(client.id).subscribe(data => {
                        console.log(client)
                        alert(`Cliente "${client.person.name}" excluído com sucesso.`)
                        window.location.reload()
                    })
                } else {
                    alert("Não foi possível excluir este cliente.")
                    window.location.reload()
                }
                break

            case "deleteOrder":

                const order = this.ordersService.getOrderToDelete()

                console.log(order)
                if (order) {
                    this.ordersService.delete(order.id).subscribe(data => {
                        alert(`Corte "${order.title}" excluído com sucesso.`)
                        window.location.reload()
                    })
                } else {
                    alert("Não foi possível excluir este corte.")
                    window.location.reload()
                }
                break

            case "deleteBarber":

                const barber = this.barbersService.getBarberToDelete()

                if (barber) {
                    this.barbersService.delete(barber.id).subscribe(data => {
                        alert(`Barbeiro "${barber.person.name}" excluído com sucesso.`)
                        window.location.reload()
                    })
                } else {
                    alert("Não foi possível excluir este barbeiro.")
                    window.location.reload()
                }
                break

            case "deleteAppointment":

                const appointment = this.appointmentsService.getAppointmentToDelete();

                if (appointment) {
                    this.appointmentsService.delete(appointment.id!).subscribe(data => {
                        alert("Agendamento excluído com sucesso!");
                        window.location.reload();
                    }
                    )
                } else {
                    alert("Não foi possível excluir esse agendamento");
                    window.location.reload();
                }
                break

            case "deleteChair":

                const chair = this.chairsService.getChairToDelete();

                if (chair) {
                    this.chairsService.deleteChair(chair.id!).subscribe(data => {
                        alert("Cadeira excluída com sucesso!");
                        window.location.reload();
                    }
                    )
                } else {
                    alert("Não foi possível excluir essa cadeira");
                    window.location.reload();
                }
                break;

            case "deleteComment":

                const comment = this.commentsService.getCommentToDelete();
                console.log(comment)

                if (comment) {
                    this.commentsService.delete(comment.id!).subscribe(data => {
                        alert("Comentário excluído com sucesso!");
                        window.location.reload();
                    })
                } else {
                    alert("Não foi possível excluir este comentário.");
                    window.location.reload();
                }
                break;
        }
    }

}
