import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [TranslocoModule, MatButtonModule, MatMenuModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private translocoService = inject(TranslocoService);

  authService = inject(AuthService);

  userAgent = '';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userAgent = navigator.userAgent;
    }
  }

  cambiarIdioma(idioma: string) {
    this.translocoService.setActiveLang(idioma);
  }

  async logout(): Promise<void> {
    const mensajeConfirmacion = this.translocoService.translate('config.logoutConfirm');
    const confirmacion = confirm(mensajeConfirmacion);

    if (!confirmacion) {
      return;
    }

    try {
      await this.authService.logout();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}