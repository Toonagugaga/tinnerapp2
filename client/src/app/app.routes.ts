import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { authGuard } from './_guard/auth.guard'

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {
                path: 'members',
                loadComponent: () => import('./member/member.component').then(c => c.MemberComponent)
            },
            {
                path: 'members-profile/:username',
                loadComponent: () => import('./member/member-profile/member-profile.component').then(c => c.MemberProfileComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
            },
            {
                path: 'followers',
                loadComponent: () => import('./follower/follower.component').then(c => c.FollowerComponent)
            },
            {
                path: 'following',
                loadComponent: () => import('./following/following.component').then(c => c.FollowingComponent)
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'server-error',
        loadComponent: () => import('./server-error/server-error.component').then(c => c.ServerErrorComponent)
    },
    {
        path: '404',
        loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)
    },
    {
        path: '**',
        pathMatch: 'full',
        loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)
    },
]
