import { ClientsService } from 'src/app/services/clients/clients.service';
import { Client } from 'src/app/models/client.model';
import { TokenService } from './../../../services/token/token.service';
import { BarbersService } from './../../../services/barbers/barbers.service';
import { Barber } from '../../../models/barber.model';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DeleteDialogComponent } from '../../templates/delete-dialog/delete-dialog.component';
import Oauth2Service from 'src/app/services/oauth2/oauth2.service';

@Component({
    selector: 'app-barbers',
    templateUrl: './barbers.component.html',
    styleUrls: ['./barbers.component.css'],
})
export class BarbersComponent implements OnInit {
    selectedImage!: File;
    barbers!: Barber[];
    barber = new Barber;
    selecetedBarberToRate!: Barber;
    stars = [{ id: "star-1", class: "fa-regular" }, { id: "star-2", class: "fa-regular" }, { id: "star-3", class: "fa-regular" }, { id: "star-4", class: "fa-regular" }, { id: "star-5", class: "fa-regular" }];
    display = { id: "", class: "", boolean: false };
    formStates: { [barberId: string]: boolean } = {};
    submitType!: string;
    isLogged!: boolean;
    isAdmin!: boolean;
    rating!: number;
    isFaRegular = true;
    isFaSolid = false;
    loggedUserEmail!: string;
    client!: Client;

    @ViewChild('ratingForm') ratingForm!: ElementRef;

    constructor(
        private barberService: BarbersService,
        private deleteDialogComponent: DeleteDialogComponent,
        private tokenService: TokenService,
        private oAuth2Service: Oauth2Service,
        private clientsService: ClientsService,
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }

    ngOnInit(): void {
        this.loggedUserEmail = this.tokenService.getUserEmail()!;
        this.isLogged = this.tokenService.isLogged();
        this.isAdmin = this.tokenService.isAdmin();
        this.clientsService.getClientByEmail(this.loggedUserEmail).subscribe((client) => {
            this.client = client!;
        });
        this.barberService.getBarbers().subscribe((barbers) => {
            this.barbers = barbers;
        });
    }

    toggleRatingBox(barberId: string): void {
        this.stars.forEach((star, index) => {
            star.class = "fa-regular";
        })
        this.formStates[barberId] = !this.formStates[barberId];
    }

    getRating(event: any): void {
        const id: string = event.target.id;
        const rating = parseInt(id.split('-')[1]);

        this.stars.forEach((star, index) => {
            star.class = index < rating ? "fa-solid" : "fa-regular";
        });

        this.rating = rating;
    }

    rateBarber(barberID: string): void {
        if (this.loggedUserEmail) {
            this.barberService.rateBarber(barberID, { clientId: this.client!.id, rating: this.rating }).subscribe(data => {
                alert("Obrigado!");
                window.location.reload();
            })
        } else {
            this.oAuth2Service.onLogin();
        }

    }

    onSelectedImage(event: any) {
        this.selectedImage = event.target.files[0];
    }

    openForm(event: any, barber: Barber): void {
        const buttonName = event.currentTarget.getAttribute('name');

        if (buttonName == 'editBarber') {
            this.submitType = 'editBarber';
            $('h2').text('Editar Barbeiro');
            this.barber = barber;
            document.getElementById('myForm')!.style.display = 'block';
        } else if (buttonName == 'createBarber') {
            this.submitType = 'createBarber';
            $('h2').text('Criar Barbeiro');
            $("form[name='barberForm']")
                .find("[type='text'")
                .val('')
                .end()
                .find("[type='number']")
                .val('');
            document.getElementById('myForm')!.style.display = 'block';
        }
    }

    closeForm(): void {
        document.getElementById('myForm')!.style.display = 'none';
    }

    onSubmit(): void {
        const name = $('[name=name]').val()?.toString()!;
        const about = $('[name=about]').val()?.toString()!;
        const email = $('[name=email]').val()?.toString()!;

        if (this.submitType == 'createBarber') {
            this.barber.person.email = email;
            this.barber.person.name = name;
            this.barber.about = about;
            this.barber.image = this.selectedImage;

            let barber = new Barber(1, about, this.selectedImage, this.barber.person);

            this.barberService.createBarber(barber).subscribe((data) => {
                this.barberService.createOrUpdateResponse = data;
                barber.id = data.id;
            });

            this.uploadImage(this.selectedImage);
        } else if (this.submitType == 'editBarber') {
            this.barber.person.name = name;
            this.barber.person.email = email;

            if (!this.selectedImage) {
                const base64 = this.barber.profilePicture.data;
                const imageName = 'imageName';
                const imageBlob = this.dataURItoBlob(base64);
                const imageFile = new File([imageBlob], imageName, {
                    type: 'image/png',
                });
                this.selectedImage = imageFile;
            }

            let barber = new Barber(1, about, this.selectedImage, this.barber.person);
            barber.id = this.barber.id

            this.barberService.update(barber).subscribe((data) => {
                this.barberService.createOrUpdateResponse = data;
                this.uploadImage(this.selectedImage);
            });

        }
    }

    uploadImage(file: File): void {
        this.barberService.uploadImage(file).subscribe((data) => {
            alert(`Barbeiro salvo com sucesso!`);
            window.location.reload();
        });
    }

    dataURItoBlob(dataURI: any) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/png' });
        return blob;
    }

    openDeleteDialog(event: any, barber: Barber): void {
        this.deleteDialogComponent.openDialog(event);
        this.barberService.setBarberToDelete(barber);
    }
}
