import { Component } from '@angular/core';
import { ChatAside } from '../chat-aside/chat-aside';
import { ChatBody } from '../chat-body/chat-body';


@Component({
    selector: 'app-chat',
    imports: [ ChatAside, ChatBody, ],
    templateUrl: './chat.html',
    styleUrl: './chat.css',
})
export class Chat
{
    //
}
