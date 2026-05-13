import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

  userAgent = '';

  user = {
    name: 'Ignacio Echave',
    email: 'ignacio@email.com',
    role: 'Administrador',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userAgent = navigator.userAgent;
    }
  }

  logout() {
    const confirmacion = confirm('¿Seguro que querés cerrar sesión?');

    if (confirmacion) {
      sessionStorage.removeItem('auth');
      this.router.navigate(['/login']);
    }
  }
}