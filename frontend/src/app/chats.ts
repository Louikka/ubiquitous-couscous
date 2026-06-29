import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { API } from '../types/server_api_typings';


@Injectable({
    providedIn: 'root',
})
export class Chats
{
    constructor()
    {
        //
    }


    private readonly http = inject(HttpClient);


    public addNewChat(name: string)
    {
        let isOk = new BehaviorSubject<null | boolean>(null);

        const body: API.chat.post.req.body = {
            chat_name: name,
        };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });

        // http.post won't work unless subscribed ("cold" observable)
        this.http.post(
            '/api/chat',
            JSON.stringify(body),
            { headers }
        ).subscribe({
            next: (val) =>
            {
                isOk.next(true);
            },
            error: (err) =>
            {
                console.error(err);
                isOk.next(false);
            },
            complete: () =>
            {
                isOk.next(true);
            },
        });

        return isOk.asObservable();
    }
}
