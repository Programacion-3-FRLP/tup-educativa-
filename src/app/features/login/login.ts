import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = false;

  constructor(private router: Router) {}

  login() {
    this.loading = true;

    setTimeout(() => {
      const email = 'usuario.prueba@educactiva.com';

      sessionStorage.setItem('auth', 'true');
      sessionStorage.setItem('userEmail', email);

      Sentry.setUser({
        email,
      });

      Sentry.captureException(
        new Error(`Error forzado luego del login. Usuario: ${email}`)
      );

      this.router.navigate(['/items']);
    }, 2000);
  }
}