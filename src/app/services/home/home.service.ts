import { Home } from './../../models/home.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    baseUrl = environment.resource_base_url + "/home";

    constructor(private http: HttpClient) { }

    save(home: Home): Observable<Home> {
        console.log(home)
        return this.http.post<Home>(this.baseUrl + "/save", home);
    }

    get(): Observable<Home> {
        return this.http.get<Home>(this.baseUrl);
    }
}
