import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  authService = inject(AuthService);

  userAgent = '';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userAgent = navigator.userAgent;
    }
  }

  async logout(): Promise<void> {
    const confirmacion = confirm('¿Seguro que querés cerrar sesión?');

    if (confirmacion) {
      await this.authService.logout();
      await this.router.navigate(['/login']);
    }
  }
}
