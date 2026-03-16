import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concat, map, Observable, of, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';


export interface AppChatMessage {
    id: number;
    origin: 'left' | 'right';
    text: string;
}

@Injectable({
    providedIn : 'root',
})
export class Messages
{
    constructor()
    {
        this.remoteMessagesSubject.subscribe((val) =>
        {
            const newMsg = JSON.parse(val) as AppChatMessage;
            const existingMsgs = this.localMessagesSubject.getValue();
            this.localMessagesSubject.next([ ...existingMsgs, newMsg, ]);
        });
    }


    private http = inject(HttpClient);
    private remoteMessagesSubject = webSocket<string>('ws://localhost:8080');
    private localMessagesSubject = new BehaviorSubject<AppChatMessage[]>([]);

    public getData(): Observable<AppChatMessage[]>
    {
        this.http.get<AppChatMessage[]>('/api/messages').subscribe((val) =>
        {
            this.localMessagesSubject.next(val);
        });

        return this.localMessagesSubject.asObservable();
    }

    public sendMessage(message: string): Observable<boolean>
    {
        return this.http.post('/api/messages', message).pipe(
            catchError((err) =>
            {
                console.error(err);
                return of(false);
            }),
            map(() =>
            {
                return true;
            })
        )
    }
}
