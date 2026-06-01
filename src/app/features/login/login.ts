import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  async login() {
    this.loading = true;

    try {
      const result = await this.authService.loginWithGoogle();
      console.log('Usuario logueado:', result.user);

      this.router.navigate(['/items']);
    } catch (error) {
      console.error('Error al iniciar sesión con Google', error);
      this.loading = false;
    }
  }
}
