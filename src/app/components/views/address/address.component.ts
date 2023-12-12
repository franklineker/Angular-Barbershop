import { TokenService } from 'src/app/services/token/token.service';
import { Home } from 'src/app/models/home.model';
import { HomeService } from './../../../services/home/home.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

    lat = -23.59573620156333;
    lng = -46.679039847149035;
    home = new Home();
    isFormActive = false;
    isAdmin = false;


    constructor(
        private homeService: HomeService,
        private tokenService: TokenService
    ) { }

    ngOnInit(): void {
        this.homeService.get().subscribe(home => {
            const address = this.home.address;
            this.home = home;
            if (this.home.address == null) {
                this.home.address = address;
            }
            console.log(home)
        })
        this.isAdmin = this.tokenService.isAdmin();
    }

    setAddress() {
        console.log(this.home)
        this.homeService.save(this.home).subscribe(data => {
            alert("Endereço atualizado com sucesso!");
            window.location.reload();
        })
    }

    toggleForm() {
        this.isFormActive = !this.isFormActive;
    }

}

