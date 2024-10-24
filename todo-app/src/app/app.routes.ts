import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    { 
        path: 'auth',
        children: [
            {
                path: 'registration',
                title: 'Registration',
                loadComponent:() => import('./auth/pages/registration/registration.component').then(mod => mod.RegistrationComponent),
            },
            { 
                path: 'login',
                title: 'Login',
                loadComponent:() => import('./auth/pages/login/login.component').then(mod => mod.LoginComponent)
            }
        ]
    },
    { 
        path: 'home',
        children: [
            {
                path: 'tasks',
                title: 'Tasks',
                loadComponent:() => import('./home/pages/tasks-page/tasks-page.component').then(mod => mod.TasksPageComponent),
            }
        ],
        canMatch: [authGuard]
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'auth/login' 
    }
];
