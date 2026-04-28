import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone : true,
  imports: [],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
private router = inject(Router);

logout() {
  const confirmacion = confirm('¿Seguro que querés cerrar sesión?');

  if (confirmacion) {
    sessionStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
}
