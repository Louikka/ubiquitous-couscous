import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Chats } from '../chats';


@Component({
    selector: 'app-chat-create',
    imports: [],
    templateUrl: './chat-create.html',
    styleUrl: './chat-create.css',
})
export class ChatCreate
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


        this.chatsService.addNewChat('abc123', chatName).subscribe((ok) =>
        {
            if (ok === null) return;

            if (ok)
            {
                //
            }
            else
            {
                //
            }
        });
    }
}
