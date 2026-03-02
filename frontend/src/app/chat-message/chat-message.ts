import { Component, Input } from '@angular/core';


@Component({
    selector : 'app-chat-message',
    imports : [],
    templateUrl : './chat-message.html',
    styleUrl : './chat-message.css',
})
export class ChatMessage
{
    constructor()
    {
        //
    }

    @Input()
    public message!: string;
}
