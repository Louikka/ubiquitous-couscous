import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { Messages } from '../messages';

import * as ServerAPITypings from '../../types/server_api_typings';


@Component({
  selector: 'app-chat-body',
  imports: [ AsyncPipe, FormsModule, ],
  templateUrl: './chat-body.html',
  styleUrl: './chat-body.css',
})
export class ChatBody
{
    constructor()
    {
        this.messagesService.messages$.subscribe((val) =>
        {
            this._messagesState.push(val);
            this.messages$.next(this._messagesState);
        });

        this.messagesService.sendClientTestError();
    }


    @ViewChild('formInputText')
    formInputText: ElementRef<HTMLInputElement> | null = null;


    private readonly messagesService = inject(Messages);

    private _messagesState = [] as ServerAPITypings.ChatMessage[];
    public messages$ = new Subject<ServerAPITypings.ChatMessage[]>();


    public onSubmit()
    {
        if (this.formInputText !== null)
        {
            const input = this.formInputText.nativeElement;

            let inputValue = input.value.trim();
            if (inputValue.length <= 0) return;

            this.messagesService.sendMessage(
                this.messagesService.newTextMessage(
                    'This User',
                    inputValue,
                )
            );

            input.value = '';
        }
    }
}
