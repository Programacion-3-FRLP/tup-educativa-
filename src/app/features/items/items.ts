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

  sortByName() {

  this.sortAsc = !this.sortAsc;

  this.filteredItems.sort((a, b) => {

    const nameA = a.name.first;
    const nameB = b.name.first;

    if (nameA < nameB) return this.sortAsc ? -1 : 1;
    if (nameA > nameB) return this.sortAsc ? 1 : -1;
    return 0;

  });

}

  ngOnInit() {

  if (isPlatformBrowser(this.platformId)) {

    const data = localStorage.getItem('items');
    const timestamp = localStorage.getItem('items_timestamp');
    const now = Date.now();

    if (data && timestamp && (now - Number(timestamp) < 300000)) {

      this.items = JSON.parse(data);
      this.filteredItems = [...this.items];
      this.loading = false;

    } else {

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
          this.loading = false;
        }
      });

    }

  }

}
  
  filterItems() {
    this.filteredItems = this.items.filter(item => {
      const fullName = item.name.first + ' ' + item.name.last;

      return fullName.toLowerCase().includes(this.searchText.toLowerCase());    
    });
  }
}

