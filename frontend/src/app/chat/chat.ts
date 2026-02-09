import { Component } from '@angular/core';
import { Message } from '../message/message';
import { MessageBox } from '../message-box/message-box';

@Component({
  selector: 'app-chat',
  imports: [Message, MessageBox],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {}
