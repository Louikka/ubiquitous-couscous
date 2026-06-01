import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LoginResponseInterface } from '../types/server_api_typings';


@Injectable({
    providedIn: 'root',
})
export class Auth
{
    private http = inject(HttpClient);

    private jwtToken: string | null = null;


    public logIn(username: string, password: string)
    {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
        this.http.post<LoginResponseInterface>('/api/login', JSON.stringify({ username, password, }), { headers, }).subscribe((res) =>
        {
            this.jwtToken = res.token;
            console.log(res.token);
        });
    }

    public logOut()
    {
        //
    }

    public isLoggedIn(): boolean
    {
        return false;
    }
}
