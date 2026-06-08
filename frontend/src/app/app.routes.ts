import { Routes } from '@angular/router';
import { Chat } from './chat/chat';
import { Login } from './login/login';
import { loginGuard } from './login-guard';
import { Register } from './register/register';


export const routes: Routes = [
    {
        path: '',
        component: Chat,
        canActivate: [
            loginGuard,
        ],
    },
    {
        path: 'register',
        component: Register,
    },
    {
        path: 'login',
        component: Login,
    },
];
