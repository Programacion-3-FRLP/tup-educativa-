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

  async login(): Promise<void> {
    this.loading = true;

    try {
      const unsubscribe = this.authService.listenAuthState(async (user) => {
        if (user) {
          unsubscribe();
          await this.router.navigate(['/items']);
        }
      });

      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión con Google', error);
      this.loading = false;
    }
  }
}