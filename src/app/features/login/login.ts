import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
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