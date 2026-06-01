import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Auth } from '../auth';


@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login
{
    @ViewChild('loginUsername')
    loginUsername: ElementRef<HTMLInputElement> | null = null;
    @ViewChild('loginPassword')
    loginPassword: ElementRef<HTMLInputElement> | null = null;


    private readonly authService = inject(Auth);


    public onSubmit(ev: SubmitEvent)
    {
        ev.preventDefault();

        const username = this.loginUsername?.nativeElement.value;
        const password = this.loginUsername?.nativeElement.value;

        if (username !== undefined && password !== undefined)
        {
            this.authService.logIn(username, password);
        }
    }
}
