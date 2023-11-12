import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Person } from 'src/app/models/person.model';
import { User } from 'src/app/models/user.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { UserService } from 'src/app/services/user/user.service';
import { HeaderComponent } from '../../templates/header/header.component';
import Oauth2Service from 'src/app/services/oauth2/oauth2.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    name!: string;
    email!: string;
    password!: string;
    confirmPassword!: string;

    constructor(
        private userService: UserService,
        private router: Router,
        private clientsService: ClientsService,
        private oauth2sevice: Oauth2Service
    ) { }

    ngOnInit(): void {

    }

    onLogin(): void {
        this.oauth2sevice.onLogin();
    }

    onSubmit(): void {

        let user = new User(this.name, this.email, this.password, ["CLIENT"]);
        console.log(user);
        if (this.password != this.confirmPassword) {
            alert("Senhas não conferem.");
            return;
        }

        const person = new Person(this.name, "", this.email, "");
        const client = new Client(3, person);


        this.userService.create(user).subscribe(data => {
            this.clientsService.create(client).subscribe(data => console.log("cliente criado."));
            alert("Usuário criado com sucesso!");
            this.router.navigate(['']);
        })

    }

}
