import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = false;

  constructor(private router: Router) {}

  login() {
    this.loading = true;

    setTimeout(() => {
      sessionStorage.setItem('auth', 'true');
      this.router.navigate(['/items']);
    }, 2000);
  }
}
