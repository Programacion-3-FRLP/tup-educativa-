import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private translocoService = inject(TranslocoService);

  userAgent = '';

  user = {
    name: 'Ignacio Echave',
    email: 'ignacio@email.com',
    role: 'Administrador',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userAgent = navigator.userAgent;
    }
  }

  logout() {
    const mensajeConfirmacion = this.translocoService.translate('config.logoutConfirm');
    const confirmacion = confirm(mensajeConfirmacion);

    if (confirmacion) {
      sessionStorage.removeItem('auth');
      this.router.navigate(['/login']);
    }
  }
}
