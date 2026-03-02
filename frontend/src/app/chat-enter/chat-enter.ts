import { Component, EventEmitter, Output } from '@angular/core';


@Component({
    selector : 'app-chat-enter',
    imports : [],
    templateUrl : './chat-enter.html',
    styleUrl : './chat-enter.css',
})
export class ChatEnter
{
    @Output()
    public evEmitter = new EventEmitter<string>();

    public sendMessage(message: string)
    {
        let isMessageCanBeSended = message.trim().length > 0;

        if (isMessageCanBeSended)
        {
            this.evEmitter.emit(message);
        }
        else
        {
            console.log(`Cannot send message : input is empty.`);
        }
    }

    public sendMessageFromElement(e: HTMLInputElement)
    {
        this.sendMessage(e.value);
        e.value = '';
    }
}
