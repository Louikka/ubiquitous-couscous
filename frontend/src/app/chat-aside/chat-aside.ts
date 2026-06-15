import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat-aside',
  imports: [],
  templateUrl: './chat-aside.html',
  styleUrl: './chat-aside.css',
})
export class ChatAside
{
    private readonly router = inject(Router);


    public toCreate(ev: Event)
    {
        this.router.navigate([ '/chat/create' ]);
    }

    public toJoin(ev: Event)
    {
        this.router.navigate([ '/chat/join' ]);
    }
}
