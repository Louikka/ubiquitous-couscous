import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Auth } from '../auth';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    imports: [ AsyncPipe ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login
{
    @ViewChild('loginUsername')
    private loginUsername: ElementRef<HTMLInputElement> | null = null;
    @ViewChild('loginPassword')
    private loginPassword: ElementRef<HTMLInputElement> | null = null;


    private readonly authService = inject(Auth);
    private readonly router = inject(Router);

    public errorMessage$ = new BehaviorSubject<null | string>(null);


    public onSubmit(ev: SubmitEvent)
    {
        ev.preventDefault();

        const username = this.loginUsername?.nativeElement.value;
        const password = this.loginPassword?.nativeElement.value;

        if (username === undefined || password === undefined)
        {
            this.errorMessage$.next('Undefined username of password.');
            return;
        }

        this.authService.logIn(username, password).subscribe((ok) =>
        {
            if (ok)
            {
                this.router.navigate([ '/chat' ]);
                this.errorMessage$.next(null);
            }
            else
            {
                this.errorMessage$.next('An error occured.');
            }
        });
    }
}
