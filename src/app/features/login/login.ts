import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { AnalyticsService } from '../../core/analytics.service';
import { AuthService } from '../../core/auth.service';

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
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  async login(): Promise<void> {
    this.loading = true;

    try {
      await this.authService.loginWithGoogle();
      await this.authService.waitForAuthState();

      if (this.authService.isAuthenticated()) {
        sessionStorage.setItem('auth', 'true');
        
        const user = this.authService.user();
        if (user && user.email) {
          sessionStorage.setItem('userEmail', user.email);
          this.analyticsService.logLogin(user.email);
          Sentry.setUser({ email: user.email });
          await this.router.navigate(['/items']);
          this.reportForcedLoginError(user.email);
          return;
        }

        await this.router.navigate(['/items']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google', error);
      this.loading = false;
    }
  }

  private reportForcedLoginError(email: string): void {
    Sentry.withScope((scope) => {
      scope.setUser({ email });
      scope.setTag('tp', '9');
      scope.setContext('usuario_autenticado', { email });
      Sentry.captureException(
        new Error('TP9: error forzado luego del inicio de sesión')
      );
    });
  }
}
