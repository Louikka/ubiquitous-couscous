import { Routes } from '@angular/router';
import { Chat } from './chat/chat';
import { Login } from './login/login';
import { loginGuard } from './login-guard';


export const routes: Routes = [
    {
        path: '',
        component: Chat,
        canActivate: [
            loginGuard,
        ],
    },
    {
        path: 'login',
        component: Login,
    },
];
