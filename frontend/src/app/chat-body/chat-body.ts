import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ChatDisplayContent, Messages } from '../messages';
import { Auth } from '../auth';


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
    }


    @ViewChild('formInputText')
    formInputText: ElementRef<HTMLInputElement> | null = null;


    private readonly authService = inject(Auth);
    private readonly messagesService = inject(Messages);

    private _messagesState = [] as ChatDisplayContent[];
    public messages$ = new Subject<ChatDisplayContent[]>();


    public onSubmit()
    {
        if (this.formInputText !== null)
        {
            const input = this.formInputText.nativeElement;

            const inputValue = input.value.trim();
            if (inputValue.length <= 0) return;

            const username = this.authService.username;
            if (username === null)
            {
                console.error(`???`);
                return;
            }

            this.messagesService.sendMessage({
                username,
                text: inputValue,
                timestamp: Date.now(),
            });

            input.value = '';
        }
    }
}
