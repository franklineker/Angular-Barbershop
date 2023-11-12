import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chair } from 'src/app/models/chair.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChairsService {

    baseUrl = environment.resource_base_url + '/chairs';
    chairToDelete!: Chair;

    constructor(
        private http: HttpClient
    ) { }

    findChairs(): Observable<Chair[]> {
        return this.http.get<Chair[]>(this.baseUrl);
    }

    createChair(chair: Chair): Observable<Chair> {
        return this.http.post<Chair>(this.baseUrl + "/save", chair);
    }

    updateChair(chair: Chair): Observable<Chair> {
        return this.http.put<Chair>(this.baseUrl + `/update/${chair.id}`, chair);
    }

    deleteChair(id: string): Observable<Chair> {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
        })
        return this.http.delete<Chair>(this.baseUrl + `/delete/${id}`, { headers });
    }

    setChairToDelete(chair: Chair): void {
        this.chairToDelete = chair;
    }

    getChairToDelete(): Chair {
        return this.chairToDelete;
    }
}
