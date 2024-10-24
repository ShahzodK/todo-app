import { Routes } from '@angular/router';

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
        path: '**',
        pathMatch: 'full',
        redirectTo: 'auth/login' 
    }
];
