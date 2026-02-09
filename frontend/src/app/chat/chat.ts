import { Component, OnInit, inject } from '@angular/core';
import { Message } from '../message/message';
import { MessageBox } from '../message-box/message-box';
import { Messages } from '../messages';


@Component({
  selector: 'app-chat',
  imports: [Message, MessageBox],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  private messagesService = inject(Messages);
  private messages: object[] = [];

  ngOnInit() {
    this.messagesService.getData().subscribe((val) => {
      this.messages = val;
      console.log(val);
    });
  }
}
