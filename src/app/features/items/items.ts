import { Component, inject, OnInit } from '@angular/core';
import { Api } from '../../core/api';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './items.html',
  styleUrl: './items.css',
})
export class Items implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private api = inject(Api);

  items: any[] = [];
  filteredItems: any[] = [];

  searchText = '';
  loading = true;
  sortAsc = true;
  errorMessage = '';

  ngOnInit() {
  if (!isPlatformBrowser(this.platformId)) {
    this.loading = false;
    return;
  }

  const data = localStorage.getItem('items');
  const timestamp = localStorage.getItem('items_timestamp');
  const now = Date.now();

  if (data && timestamp && now - Number(timestamp) < 300000) {
    this.items = JSON.parse(data);
    this.filteredItems = [...this.items];
    this.loading = false;
    return;
  }

  this.api.getItems().subscribe({
    next: (res: any) => {
      this.items = res.results;
      this.filteredItems = [...this.items];

      localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('items_timestamp', now.toString());

      this.loading = false;
    },
    error: (err: any) => {
      console.error(err);
      this.errorMessage = 'Ocurrió un problema al obtener los alumnos.';
      this.loading = false;
    },
  });
}

  filterItems() {
    const text = this.searchText.toLowerCase();

    this.filteredItems = this.items.filter(item => {
      const fullName = `${item.name.first} ${item.name.last}`.toLowerCase();
      const email = item.email.toLowerCase();
      const country = item.location.country.toLowerCase();
      const state = item.location.state.toLowerCase();
      const city = item.location.city.toLowerCase();

      return (
        fullName.includes(text) ||
        email.includes(text) ||
        country.includes(text) ||
        state.includes(text) ||
        city.includes(text)
      );
    });
  }

  sortByName() {
    this.sortAsc = !this.sortAsc;

    this.filteredItems.sort((a, b) => {
      const nameA = a.name.first.toLowerCase();
      const nameB = b.name.first.toLowerCase();

      if (nameA < nameB) return this.sortAsc ? -1 : 1;
      if (nameA > nameB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  sortByAge() {
    this.sortAsc = !this.sortAsc;

    this.filteredItems.sort((a, b) => {
      return this.sortAsc
        ? a.dob.age - b.dob.age
        : b.dob.age - a.dob.age;
    });
  }
}