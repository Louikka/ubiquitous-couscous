import { Component, OnInit, SimpleChanges, inject } from '@angular/core';

import { AppChatMessage, Messages } from '../messages';

import { ChatEnter } from '../chat-enter/chat-enter';
import { ChatHeader } from '../chat-header/chat-header';
import { ChatMessage } from '../chat-message/chat-message';


@Component({
    selector : 'app-chat',
    imports : [ ChatEnter, ChatHeader, ChatMessage ],
    templateUrl : './chat.html',
    styleUrl : './chat.css',
})
export class Chat// implements OnInit
{
    constructor()
    {
        this.messagesService.getData().subscribe((val) =>
        {
            this.messages = structuredClone(val);
            console.log(`Got data from (Chat).messagesService : `, val);
        });
    }

    private messagesService = inject(Messages);

    public messages: AppChatMessage[] = [];

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

    public receiveMessage(message: string)
    {
        console.log(`(Chat) recieved new message : "${message}".`);

        this.messages.push({
            id : this.messages.length + 1,
            origin : 'right',
            text : message,
        });

        console.log(`(Chat).messages has been updated : `, this.messages);
    }
}
