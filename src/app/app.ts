import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, TranslocoModule, MatButtonModule, MatMenuModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mi-proyecto');
  private translocoService = inject(TranslocoService);

  constructor(private router: Router) {}

  mostrarLayout(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }

  cambiarIdioma(idioma: string) {
    this.translocoService.setActiveLang(idioma);
  }
}
