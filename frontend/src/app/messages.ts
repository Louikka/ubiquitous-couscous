import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


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
        /*
        return this.http.get('/api/messages').pipe(
            map((val) =>
            {
                console.log(val);
                return val as AppChatMessage[];
            })
        );
        */
    }
}
