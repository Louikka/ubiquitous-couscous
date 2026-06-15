import { Routes } from '@angular/router';
import { Chat } from './chat/chat';
import { Login } from './login/login';
import { loginGuard } from './login-guard';
import { Register } from './register/register';
import { Home } from './home/home';
import { ChatBody } from './chat-body/chat-body';
import { ChatCreate } from './chat-create/chat-create';
import { ChatJoin } from './chat-join/chat-join';


export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'register',
        component: Register,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'chat',
        component: Chat,
        canActivate: [
            loginGuard,
        ],
        children: [
            {
                path: 'create',
                component: ChatCreate,
            },
            {
                path: 'join',
                component: ChatJoin,
            },
            {
                path: ':chatId',
                component: ChatBody,
            },
        ],
    },
];
