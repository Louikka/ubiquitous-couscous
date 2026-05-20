import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Messages } from '../messages';

import * as ServerAPITypings from '../../types/server_api_typings';


type DisplayableContentMessage = {
    type: 'message';
    content: ServerAPITypings.Message;
}
type DisplayableContentError = {
    type: 'error';
    content: {
        timestamp: number;
        text: string;
    };
}

type DisplayableContent = (
    | DisplayableContentMessage
    | DisplayableContentError
);


@Component({
  selector: 'app-chat-body',
  imports: [ FormsModule, ],
  templateUrl: './chat-body.html',
  styleUrl: './chat-body.css',
})
export class ChatBody
{
    constructor()
    {
        this.messagesService.messages$.subscribe((value) =>
        {
            this.displayContent.push({
                type: 'message',
                content: value,
            });
        });
    }


    @ViewChild('formInputText')
    formInputText: ElementRef<HTMLInputElement> | null = null;


    private readonly messagesService = inject(Messages);

    /** Currently displayed messages. */
    public displayContent: DisplayableContent[] = [];


    public onSubmit()
    {
        // FIXME : message got sent, but server not recieving it. why.

        if (this.formInputText !== null)
        {
            const input = this.formInputText.nativeElement;

            this.messagesService.sendMessage({
                timestamp: Date.now(),
                user: 'This User',
                text: input.value.trim(),
            });

            input.value = '';
        }
    }
}
