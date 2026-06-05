import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateManagerService } from '../core/state-manager.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Alumnos</h1>

    <ul>
      @for (user of items; track user) {
        <li>{{ user.name.first }} {{ user.name.last }}</li>
      }
    </ul>
  `,
})
export class UsersComponent implements OnInit {
  items: any[] = [];

  constructor(private stateManager: StateManagerService) {}

  ngOnInit(): void {
    this.stateManager.loadItems();

    this.stateManager.getItems().subscribe((items) => {
      this.items = items;
    });
  }
}
