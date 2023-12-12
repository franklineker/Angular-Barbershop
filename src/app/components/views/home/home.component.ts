import { HomeService } from './../../../services/home/home.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    isLogged!: boolean;
    welcomeMessage = "";
    isEditMessageEnabled = false;
    isAdmin!: boolean;

    constructor(
        private tokenService: TokenService,
        private homeService: HomeService
    ) { }

    ngOnInit(): void {
        this.isLogged = this.tokenService.isLogged();
        this.isAdmin = this.tokenService.isAdmin();
        this.homeService.get().subscribe(data => {
            this.welcomeMessage = data.welcomeMessage;
        });
    }

    toogleTextArea() {
        this.isEditMessageEnabled = !this.isEditMessageEnabled;
    }

    setMessage() {
        const homeAttrs = { welcomeMessage: this.welcomeMessage, aboutBarbershop: null };
        const home = new Home();
        home.welcomeMessage = this.welcomeMessage;
        this.homeService.save(home).subscribe(data => {
            alert("Mensagem atualizada com sucesso!");
            window.location.reload();
        });
    }
}
