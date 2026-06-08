import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Auth } from '../auth';
import { BehaviorSubject, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
    selector: 'app-register',
    imports: [ AsyncPipe ],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register
{
    @ViewChild('registerUsername')
    private registerUsername: ElementRef<HTMLInputElement> | null = null;
    @ViewChild('registerPassword1')
    private registerPassword1: ElementRef<HTMLInputElement> | null = null;
    @ViewChild('registerPassword2')
    private registerPassword2: ElementRef<HTMLInputElement> | null = null;


    private readonly authService = inject(Auth);
    private readonly router = inject(Router);

    public errorMessage$ = new BehaviorSubject<null | string>(null);


    public onSubmit(ev: SubmitEvent)
    {
        ev.preventDefault();

        const username = this.registerUsername?.nativeElement.value;

        const password1 = this.registerPassword1?.nativeElement.value;
        const password2 = this.registerPassword2?.nativeElement.value;

        if (username === undefined || password1 === undefined || password2 === undefined)
        {
            this.errorMessage$.next('Undefined username of password.');
            return;
        }

        if (password1 !== password2)
        {
            this.errorMessage$.next('Passwords are not matching.');
            return;
        }

        this.authService.signIn(username, password1).subscribe((res) =>
        {
            console.debug(res);

            if (!res.ok)
            {
                this.errorMessage$.next(res.message ?? 'An error occured.');
            }
            else
            {
                this.router.navigate([ '/' ]);
                this.errorMessage$.next(null);
            }
        });
    }
}
