import { Comment } from './../../models/comments.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {

    baseUrl = environment.resource_base_url + "/comments";
    commentToDelete!: Comment;

    constructor(
        private http: HttpClient
    ) { }

    findAll(): Observable<Comment[]> {
        return this.http.get<Comment[]>(this.baseUrl);
    }

    findByClientId(id: string): Observable<Comment> {
        return this.http.get<Comment>(this.baseUrl + "/id");
    }

    save(comment: Object): Observable<Comment> {
        return this.http.post<Comment>(this.baseUrl + "/save", comment);
    }

    update(comment: Comment): Observable<Comment> {
        return this.http.put<Comment>(this.baseUrl + "/update/" + comment.id, comment);
    }

    delete(id: string): Observable<Comment> {
        return this.http.delete<Comment>(this.baseUrl + "/delete/" + id)
    }

    setCommentToDelete(comment: Comment): void {
        this.commentToDelete = comment;
    }

    getCommentToDelete(): Comment {
        return this.commentToDelete;
    }

}
