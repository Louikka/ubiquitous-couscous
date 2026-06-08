import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LoginResponseInterface } from '../types/server_api_typings';
import { catchError, EMPTY, Observable, Subject, Subscription, timeout } from 'rxjs';


interface LogInResponse {
    ok: boolean;
    message?: string;
}


@Injectable({
    providedIn: 'root',
})
export class Auth
{
    private http = inject(HttpClient);

    private jwtToken: string | null = null;


    public signIn(username: string, password: string)
    {
        const r = new Subject<LogInResponse>();

        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
        this.http.post<LoginResponseInterface>(
            '/api/register',
            JSON.stringify({ username, password }),
            { headers }
        ).subscribe({
            error: (err) =>
            {
                console.error(err);

                r.next({
                    ok: false,
                    message: 'Username or password is invalid.',
                });
            },
            complete: () =>
            {
                //
            },
            next: (res) =>
            {
                this.jwtToken = res.token;

                r.next({
                    ok: true,
                });
            },
        });


        return r.asObservable();
    }


    public logIn(username: string, password: string): Observable<LogInResponse>
    {
        const r = new Subject<LogInResponse>();

        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
        this.http.post<LoginResponseInterface>(
            '/api/login',
            JSON.stringify({ username, password }),
            { headers }
        ).subscribe({
            error: (err) =>
            {
                console.error(err);

                r.next({
                    ok: false,
                    message: 'Username or password is invalid.',
                });
            },
            complete: () =>
            {
                //
            },
            next: (res) =>
            {
                this.jwtToken = res.token;

                r.next({
                    ok: true,
                });
            },
        });


        return r.asObservable();
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
