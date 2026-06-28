import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Configuracion } from './features/configuracion/configuracion';
import { Items } from './features/items/items';
import { Cuenta } from './features/configuracion/cuenta/cuenta';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'configuracion',
    canActivate: [authGuard],
    component: Configuracion,
    children: [{ path: 'cuenta', component: Cuenta }],
  },
  { path: 'items', canActivate: [authGuard], component: Items },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
