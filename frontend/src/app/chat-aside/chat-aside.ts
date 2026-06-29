import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';


@Component({
  selector: 'app-chat-aside',
  imports: [],
  templateUrl: './chat-aside.html',
  styleUrl: './chat-aside.css',
})
export class ChatAside
{
    private readonly router = inject(Router);
    public readonly auth = inject(Auth);


    public toCreate(ev: Event)
    {
        this.router.navigate([ '/chat/create' ]);
    }

    public toJoin(ev: Event)
    {
        this.router.navigate([ '/chat/join' ]);
    }
}
