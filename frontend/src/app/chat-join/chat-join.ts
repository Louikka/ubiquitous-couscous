import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Chats } from '../chats';


@Component({
    selector: 'app-chat-join',
    imports: [],
    templateUrl: './chat-join.html',
    styleUrl: './chat-join.css',
})
export class ChatJoin
{
    @ViewChild('chatName')
    private chatName: ElementRef<HTMLInputElement> | null = null;


    private readonly chatsService = inject(Chats);


    public onSubmit(ev: SubmitEvent)
    {
        ev.preventDefault();

        const chatName = this.chatName?.nativeElement.value;
        if (chatName === undefined)
        {
            console.error('Undefined chat name.');
            return;
        }
    }
}
