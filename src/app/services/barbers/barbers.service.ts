import { TokenService } from './../token/token.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Barber } from 'src/app/models/barber.model';
import { Appointment } from 'src/app/models/appointment.model';

@Injectable({
    providedIn: 'root',
})
export class BarbersService {
    baseUrl = environment.resource_base_url + '/barbers';
    createOrUpdateResponse!: any;
    barberToDelete!: Barber;
    data!: any;
    appointments!: Appointment[];

    token = '' + this.tokenService.getAccessToken();
    headers_object = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
    });
    httpOptions = { headers: this.headers_object };

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    getBarbers(): Observable<Barber[]> {
        return this.http.get<Barber[]>(`${this.baseUrl}`);
    }

    findBarberByEmail(email: string, callback: (barber: Barber) => void): void {

        this.getBarbers().subscribe(barbers => {
            const barber = barbers.filter(barber => barber.person.email == email)[0];
            callback(barber);
        });

    }

    createBarber(barber: Barber): Observable<Barber> {
        return this.http.post<Barber>(`${this.baseUrl}` + '/save', barber);
    }

    setBarberToDelete(barber: Barber): void {
        this.barberToDelete = barber;
    }

    getBarberToDelete(): Barber {
        return this.barberToDelete;
    }

    uploadImage(file: File): Observable<FormData> {
        const formData = new FormData();
        formData.append('file', file);

        const id = this.createOrUpdateResponse.id;

        return this.http.put<FormData>(
            this.baseUrl + `/updatePicture/${id}`,
            formData
        );
    }

    update(barber: Barber): Observable<Barber> {
        return this.http.put<Barber>(`${this.baseUrl}` + `/update/${barber.id}`, barber);
    }

    delete(id: String): Observable<Barber> {
        return this.http.delete<Barber>(`${this.baseUrl}` + `/delete/${id}`);
    }

    getBestRatedBarbers(barbers: Barber[]): Barber[] {

        return barbers.sort((a, b) => b.currentRating - a.currentRating);

    }

    rateBarber(id: string, rating: { clientId: string, rating: number }): Observable<Barber> {
        return this.http.put<Barber>(this.baseUrl + `/rating/${id}`, rating);
    }

}
