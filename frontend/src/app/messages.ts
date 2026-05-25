import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import * as ServerAPITypings from '../types/server_api_typings';


@Injectable({
    providedIn: 'root',
})
export class Messages
{
    constructor()
    {
        this.ws$.subscribe((val) =>
        {
            this.messages$.next(val);
        });
    }


    private http = inject(HttpClient);
    private ws$ = webSocket<ServerAPITypings.ChatMessage>(`ws://${window.location.hostname}:8080`);

    public readonly messages$ = new ReplaySubject<ServerAPITypings.ChatMessage>();


    /** Constructor for new text message. */
    public newTextMessage(username: string, text: string, timestamp = Date.now()): ServerAPITypings.Message
    {
        return {
            type: 'message',
            timestamp,
            content: {
                user: username,
                text,
            },
        };
    }
    /** Constructor for new error message. */
    public newErrorMessage(text: string, timestamp = Date.now()): ServerAPITypings.Error
    {
        return {
            type: 'error',
            timestamp,
            content: {
                text,
            },
        };
    }


    public getMessages(): Observable<ServerAPITypings.ChatMessage[]>
    {
        return this.http.get<ServerAPITypings.ChatMessage[]>('/api/messages');
    }

    public sendMessage(message: ServerAPITypings.Message): Observable<null | boolean>
    {
        console.debug('Sending message...');

        let isSuccessful = new BehaviorSubject<null | boolean>(null);

        const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
        // http.post won't work unless subscribed ("cold" observable)
        this.http.post('/api/messages', JSON.stringify(message), { headers, }).subscribe({
            error: (err) =>
            {
                console.error(err);
                isSuccessful.next(false);
            },
            complete: () =>
            {
                isSuccessful.next(true);
            },
            next: (val) =>
            {
                console.log(val);
                isSuccessful.next(true);
            },
        });

        return isSuccessful;
    }

    public sendClientTestError()
    {
        this.messages$.next(
            this.newErrorMessage('test error')
        );
    }
}
