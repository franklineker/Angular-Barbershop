import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    base_url = environment.resource_base_url + '/users';

    constructor(
        private http: HttpClient
    ) { }

    create(user: User): Observable<User> {
        return this.http.post<User>(`${this.base_url}` + '/save', user);
    }

    findAll(): Observable<User[]> {
        return this.http.get<User[]>(this.base_url);
    }
}
