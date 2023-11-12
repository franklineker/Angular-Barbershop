import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

    lat = -23.59573620156333;
    lng = -46.679039847149035;

    constructor() { }

    ngOnInit(): void {

    }

}

