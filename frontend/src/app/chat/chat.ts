import { Component } from '@angular/core';
import { ChatAside } from '../chat-aside/chat-aside';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-chat',
    imports: [ RouterOutlet, ChatAside ],
    templateUrl: './chat.html',
    styleUrl: './chat.css',
})
export class Chat
{
    //
}
