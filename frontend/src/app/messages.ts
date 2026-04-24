import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';


@Injectable({
    providedIn : 'root',
})
export class Messages
{
    constructor()
    {
        this.ws$.subscribe((val) =>
        {
            const d = JSON.parse(val) as WSSendData;
            const existingMsgs = this.localMessages$.getValue();
            this.localMessages$.next([ ...existingMsgs, d.content, ]);
        });
    }


    private http = inject(HttpClient);
    private ws$ = webSocket<string>('ws://localhost:8080');
    private localMessages$ = new BehaviorSubject<AppChatMessage[]>([]);

    public getData(): Observable<AppChatMessage[]>
    {
        this.http.get<AppChatMessage[]>('/api/messages').subscribe((val) =>
        {
            this.localMessages$.next(val);
        });

        return this.localMessages$.asObservable();
    }

    public sendMessage(s: string): Observable<boolean>
    {
        return this.http.post('/api/messages', s).pipe(
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
