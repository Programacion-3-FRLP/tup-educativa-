import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StateManagerService } from '../../core/state-manager.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatMenuModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private translocoService = inject(TranslocoService);
  private stateManager = inject(StateManagerService);

  userAgent = '';

  // Al usar una función getter que ejecuta el Signal directo (), Angular
  // actualiza el HTML automáticamente apenas cambia el estado en el servicio.
  get user() {
    return this.stateManager.user();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userAgent = navigator.userAgent;
    }
  }

  enRutaCuenta(): boolean {
    return this.router.url === '/configuracion/cuenta';
  }

  cambiarIdioma(idioma: string) {
    this.translocoService.setActiveLang(idioma);
  }

  logout() {
    const mensajeConfirmacion = this.translocoService.translate(
      'config.logoutConfirm',
    );
    const confirmacion = confirm(mensajeConfirmacion);

    if (confirmacion) {
      sessionStorage.removeItem('auth');
      this.router.navigate(['/login']);
    }
  }
}
