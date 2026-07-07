import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoModalComponent } from './features/configuracion/info-modal/info-modal';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    TranslocoModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mi-proyecto');
  private translocoService = inject(TranslocoService);
  private dialog = inject(MatDialog);

  constructor(private router: Router) {}

  mostrarLayout(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }

  cambiarIdioma(idioma: string): void {
    this.translocoService.setActiveLang(idioma);
  }

  abrirInfo(): void {
    this.dialog.open(InfoModalComponent, {
      width: '25rem',
    });
  }
}
