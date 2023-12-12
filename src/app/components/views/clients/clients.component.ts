import { DeleteDialogComponent } from '../../templates/delete-dialog/delete-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Client } from '../../../models/client.model';
import { ClientsService } from 'src/app/services/clients/clients.service';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

    clients!: Client[];
    client: Client = new Client();
    submitType!: any;
    collapsedClients!: boolean[];

    constructor(
        private clientsService: ClientsService,
        private deleteDialogCommponent: DeleteDialogComponent
    ) { }

    ngOnInit(): void {
        this.clientsService.findClients().subscribe(clients => {
            this.clients = clients;
            this.collapsedClients = new Array(this.clients.length).fill(true);
        });
    }

    editClient(client: Client): void {
        this.clientsService.setClientToEdit(client);
    }

    openForm(event: any, client?: Client): void {

        const buttonName = event.currentTarget.getAttribute("name");

        if (buttonName == "editClient") {
            this.submitType = "editClient";
            $("#form-title").text("Editar Cliente");
            this.client = client!;
            document.getElementById("myForm")!.style.display = "block";

        } else if (buttonName == "createClient") {
            this.client = new Client();
            this.submitType = "createClient";
            $("#form-title").text("Criar Cliente");
            $("form[name='clientForm']")
                .find("[type='text'").val("").end()
                .find("[type='number']").val("");
            document.getElementById("myForm")!.style.display = "block";
        }

    }

    closeForm(): void {
        document.getElementById('myForm')!.style.display = 'none';
    }

    onSubmit(): void {

        // if (this.submitType == 'createClient') {
        //     const client = new Client(3, this.client.person);
        //     this.clientsService.create(this.client).subscribe(data => {
        //         alert("Cliente criado com sucesso!");
        //         window.location.reload();
        //     });

        // } else
        if (this.submitType == 'editClient') {
            let client = new Client(3, this.client.person);
            client.id = this.client.id;

            this.clientsService.update(client).subscribe(data => {
                alert("Cliente atualizado com sucesso!");
                window.location.reload();
            })
        }
    }

    openDeleteDialog(event: any, client: Client): void {
        this.deleteDialogCommponent.openDialog(event);
        this.clientsService.setClientToDelete(client);
    }

    toggleCollapse(index: number) {
        this.collapsedClients[index] = !this.collapsedClients[index];
    }
}
