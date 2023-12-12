import { Component, OnInit } from '@angular/core';
import { Client } from '../../../models/client.model';
import { Person } from '../../../models/person.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { BarbersService } from 'src/app/services/barbers/barbers.service';
import { Barber } from 'src/app/models/barber.model';
import { User } from 'src/app/models/user.model';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userEmail!: string;
    isLogged!: boolean;
    isAdmin!: boolean;
    isBarber!: boolean;
    isClient!: boolean;
    clients!: Client[];
    isImagePresent!: boolean;
    selectedImage!: File;
    client: Client = new Client();
    barber = new Barber;
    admin: User = {
        fullName: "",
        email: "",
        password: "",
        roles: []
    };
    imageURL = ``;
    imagePlaceHolder = '../../../assets/images/user-placeholder.png';

    constructor(
        private clientsService: ClientsService,
        private userService: UserService,
        private barberService: BarbersService,
        private tokenService: TokenService,
        private router: Router
    ) { }

    ngOnInit(): void {

        this.getLogged();
        this.getIsAdmin();
        this.getIsBarber();
        this.getIsClient();
        if (!this.isLogged) {
            this.router.navigate(['register']);
        } else {
            this.userEmail = this.tokenService.getUserEmail()!;
        }

        if (this.isAdmin) {
            this.userService.findAll().subscribe(users => {
                this.admin = users.filter(u => u.email == this.userEmail)[0];
            });
        }
        if (this.isBarber) {
            this.barberService.getBarbers().subscribe(barbers => {
                this.barber = barbers.filter(b => b.person.email == this.userEmail)[0];
                this.isImagePresent = this.barber.profilePicture ? true : false;
                this.imageURL = this.barber.profilePicture.data;
            })
        } else if (this.isClient || this.isAdmin) {

            console.log("entrou no asdfsa")
            this.clientsService.findClients().subscribe(clients => {
                if ((this.userEmail.split("@").length)! > 0) {
                    this.client = clients.filter(c => c.person.email == this.userEmail)[0];
                    this.isImagePresent = this.client.image ? true : false;
                    this.imageURL = this.client.image.data;
                    console.log("cliente com @", this.client)
                } else {
                    this.client = clients.filter(c => c.person.email == this.userEmail)[0];
                }
            });
        }

    }


    onSubmit(): void {

        if (this.selectedImage && this.selectedImage.size > 1048576) {
            alert("O arquivo que você anexou é muito grande. Por favor, selecione um arquivo menor.")
            this.selectedImage
            return;
        }
        const id = this.client.id;
        const barberID = this.barber.id;
        const name = $("[name=userName]").val()?.toString()!;
        const email = $("[name=userEmail]").val()?.toString()!;
        const phone = $("[name=userPhone]").val()?.toString()!;
        const address = $("[name=userAddress]").val()?.toString()!;
        const about = $("[name=about]").val()?.toString()!;
        const person: Person = {
            name: name,
            email: email,
            phone: phone,
            address: address
        };

        let client = new Client(3, person);
        client.id = id;

        let barber = new Barber(1, about, this.selectedImage, person)
        barber.id = barberID;

        if (this.isClient) {
            this.clientsService.update(client).subscribe(client => {
                console.log(client);
                this.updatePicture(client.id, this.selectedImage);
            });
        } else if (this.isBarber) {
            this.barberService.update(barber).subscribe(barber => {
                console.log(barber);
                this.updatePicture(barber.id, this.selectedImage);
            });

        } else if (this.isAdmin) {
            let id = "";
            this.clientsService.findClients().subscribe(clients => {
                const adminClient = clients.filter(c => c.person.email == this.admin.email)[0];
                let newAdminClient = new Client(3, adminClient.person);
                newAdminClient.id = adminClient.id
                id = adminClient.id
                this.clientsService.update(newAdminClient).subscribe(client => {
                    this.updatePicture(id, this.selectedImage);
                });
            });
        }
    }

    updatePicture(id: string, file: File): void {
        if (this.isClient || this.isAdmin) {
            this.clientsService.uploadImage(id, file).subscribe(data => {
                alert("Cliente salvo com sucesso");
                window.location.reload();
            })
        } else if (this.isBarber) {
            this.barberService.uploadImage(file).subscribe(data => {
                alert("Barbeiro salvo com sucesso");
                window.location.reload();
            })
        }
    }

    onSelectedImage(event: any): void {
        this.selectedImage = event.target.files[0];

        if (event.target.files) {
            let reader = new FileReader();
            reader.readAsDataURL(this.selectedImage);
            reader.onload = (e: any) => {
                const newImageURL = e.target.result;
                this.imagePlaceHolder = newImageURL;
                this.imageURL = newImageURL.split(",")[1];

            };
        }

        $(".file-container").removeAttr("hidden");

    }

    getLogged(): void {
        this.isLogged = this.tokenService.isLogged();
    }

    getIsAdmin(): void {
        this.isAdmin = this.tokenService.isAdmin();
    }
    getIsBarber(): void {
        this.isBarber = this.tokenService.isBarber();
    }
    getIsClient(): void {
        this.isClient = this.tokenService.isClient();
    }
}
