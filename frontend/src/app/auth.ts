import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { API } from '../types/server_api_typings';


@Injectable({
    providedIn: 'root',
})
export class Auth
{
    private http = inject(HttpClient);

    private jwtToken: string | null = null;
    public username: string | null = null;


    public signIn(username: string, password: string): Observable<boolean>
    {
        const isOk = new Subject<boolean>();

        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
        this.http.post<API.register.post.res.body>(
            '/api/register',
            JSON.stringify({ username, password }),
            { headers }
        ).subscribe({
            next: (res) =>
            {
                this.jwtToken = res.token;
                this.username = username;

                isOk.next(true);
            },
            error: (err) =>
            {
                console.error(err);

                isOk.next(false);
            },
            complete: () =>
            {
                //
            },
        });


        return isOk.asObservable();
    }


    public logIn(username: string, password: string): Observable<boolean>
    {
        const isOk = new Subject<boolean>();

        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
        this.http.post<API.login.post.res.body>(
            '/api/login',
            JSON.stringify({ username, password }),
            { headers }
        ).subscribe({
            next: (res) =>
            {
                this.jwtToken = res.token;
                this.username = username;

                isOk.next(true);
            },
            error: (err) =>
            {
                console.error(err);

                isOk.next(false);
            },
            complete: () =>
            {
                //
            },
        });


        return isOk.asObservable();
    }

    public logOut()
    {
        //
    }

    public isLoggedIn(): boolean
    {
        return this.jwtToken !== null;
    }
}
