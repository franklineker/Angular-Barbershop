import { HomeService } from './../../../services/home/home.service';
import { CommentsService } from './../../../services/comments/comments.service';
import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import Oauth2Service from 'src/app/services/oauth2/oauth2.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Comment } from 'src/app/models/comments.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Home } from 'src/app/models/home.model';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    client!: Client;
    imageURL!: string;
    isLogged!: boolean;
    isAdmin!: boolean;
    content: string = "";
    lastCommentContent: string = "";
    comments!: Comment[];
    loggedClientEmail!: string;
    aboutBarbershop = "";
    isEditMessageEnabled = false;


    constructor(
        private clientsService: ClientsService,
        private tokenService: TokenService,
        private oauth2Service: Oauth2Service,
        private commentsService: CommentsService,
        private deleteDialog: DeleteDialogComponent,
        private homeService: HomeService
    ) { }

    ngOnInit(): void {
        this.isLogged = this.tokenService.isLogged();
        this.isAdmin = this.tokenService.isAdmin();

        this.homeService.get().subscribe(data => {
            this.aboutBarbershop = data.aboutBarbershop;
        })

        if (this.isLogged) {
            this.loggedClientEmail = this.tokenService.getUserEmail()!;
        }

        this.commentsService.findAll().subscribe(comments => {
            this.comments = comments.reverse();
        })

        this.clientsService.findClients().subscribe(clients => {
            const userEmail = this.tokenService.getUserEmail();
            const loggedClient = clients.find(client => client.person.email == userEmail)

            if (loggedClient) {
                this.client = loggedClient;
                this.imageURL = loggedClient.image.data;
            } else {
                this.imageURL = "../../../../assets/images/user-placeholder.png"
            }
        })
    }

    createComment(): void {
        if (!this.isLogged) {
            this.oauth2Service.onLogin();
            return;
        }
        const commentRequest = {
            clientID: this.client.id,
            content: this.content
        }
        this.commentsService.save(commentRequest).subscribe(comment => {
            alert("Comentário enviado com sucesso!");
            window.location.reload();
        });
    }

    deleteComment(event: any, comment: Comment): void {
        this.deleteDialog.openDialog(event);
        this.commentsService.setCommentToDelete(comment)
    }

    setAboutBarbershop() {
        const home = new Home()
        home.aboutBarbershop = this.aboutBarbershop;
        const about = { welcomeMessage: null, aboutBarbershop: this.aboutBarbershop }
        this.homeService.save(home).subscribe(data => {
            alert("Texto atualizado com sucesso!");
            window.location.reload();
        })
    }

    toogleTextArea() {
        this.isEditMessageEnabled = !this.isEditMessageEnabled;
    }
}
