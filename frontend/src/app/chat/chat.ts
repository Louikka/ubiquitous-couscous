import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { Messages } from '../messages';

import { ChatEnter } from '../chat-enter/chat-enter';
import { ChatHeader } from '../chat-header/chat-header';
import { ChatMessage } from '../chat-message/chat-message';
import { Observable } from 'rxjs';


@Component({
    selector : 'app-chat',
    imports : [ AsyncPipe,  ChatEnter, ChatHeader, ChatMessage ],
    templateUrl : './chat.html',
    styleUrl : './chat.css',
})
export class Chat// implements OnInit
{
    constructor()
    {
        this.messages = this.messagesService.getData();
    }

    private messagesService = inject(Messages);

    public messages: Observable<AppChatMessage[]>;

    /*
    public ngOnInit()
    {
        this.messagesService.getData().subscribe((val) =>
        {
            this.messages = structuredClone(val);
            console.log(`Got data from (Chat).messagesService : `, val);
        });
    }
    */

    public sendMessage(message: string)
    {
        this.messagesService.sendMessage(message).subscribe((succsess) =>
        {
            console.log(succsess);
        });
    }
}
