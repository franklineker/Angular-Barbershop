import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ClientsService {
    baseUrl = environment.resource_base_url + '/clients';
    createOrUpdateResponse: any;
    clientToDelete!: Client;
    clientToEdit!: Client;

    constructor(private http: HttpClient) { }

    findClients(): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.baseUrl}`);
    }

    findClientByEmail(email: string, callback: (client: Client) => void): void {

        this.findClients().subscribe(clients => {
            const client = clients.filter(c => c.person.email == email)[0];
            callback(client);
        });

    }

    setClientToDelete(client: Client): void {
        this.clientToDelete = client;
    }

    getClientToDelete(): Client {
        return this.clientToDelete;
    }

    setClientToEdit(client: Client): void {
        this.clientToEdit = client;
    }


    create(client: Client): Observable<Client> {
        return this.http.post<Client>(`${this.baseUrl}` + '/save', client);
    }

    update(client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.baseUrl}` + `/update/${client.id}`, client);
    }

    uploadImage(id: string, file: File): Observable<FormData> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.put<FormData>(
            `${this.baseUrl}` + `/updateImage/${id}`,
            formData
        );
    }

    delete(id: String): Observable<Client> {
        return this.http.delete<Client>(`${this.baseUrl}` + `/delete/${id}`);
    }
}
