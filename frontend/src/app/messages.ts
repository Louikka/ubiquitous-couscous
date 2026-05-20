import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import * as ServerAPITypings from '../types/server_api_typings';


@Injectable({
    providedIn: 'root',
})
export class Messages
{
    constructor()
    {
        this.ws$.subscribe((d) =>
        {
            this.messages$.next(d.content);
        });
    }


    private http = inject(HttpClient);
    private ws$ = webSocket<ServerAPITypings.WSSendData>('ws://localhost:8080');

    public readonly messages$ = new ReplaySubject<ServerAPITypings.Message>();


    public getMessages(): Observable<ServerAPITypings.Message[]>
    {
        return this.http.get<ServerAPITypings.Message[]>('/api/messages');
    }

    public sendMessage(message: ServerAPITypings.Message): Observable<boolean>
    {
        console.debug('Sending message...');

        return this.http.post('/api/messages', JSON.stringify(message)).pipe(
            catchError((err) =>
            {
                console.error(err);
                return of(false);
            }),
            map(() =>
            {
                console.debug('Message sent successfully.');
                return true;
            }),
        )
    }
}
