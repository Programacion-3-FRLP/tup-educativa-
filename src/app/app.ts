import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mi-proyecto');

  constructor(private router: Router) {}

  mostrarLayout(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }
}