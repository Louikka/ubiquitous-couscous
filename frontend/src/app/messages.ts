import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';


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
    private http = inject(HttpClient);

    public getData(): Observable<AppChatMessage[]>
    {
        return this.http.get<AppChatMessage[]>('/api/messages');
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
