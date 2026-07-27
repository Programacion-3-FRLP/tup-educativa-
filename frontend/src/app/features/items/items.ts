import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { StateManagerService } from '../../core/state-manager.service';

type SortField = 'name' | 'age';

@Component({
  selector: 'app-items',
  imports: [FormsModule, TranslocoModule],
  templateUrl: './items.html',
  styleUrl: './items.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Items implements OnInit {
  private readonly stateManager = inject(StateManagerService);

  readonly items = this.stateManager.items;
  readonly loading = this.stateManager.loading;
  readonly hasError = this.stateManager.hasError;

  readonly searchText = signal('');
  readonly sortField = signal<SortField>('name');
  readonly sortAscending = signal(true);

  readonly filteredItems = computed(() => {
    const text = this.searchText().trim().toLowerCase();

    const filtered = this.items().filter((item) => {
      const fullName = `${item.name.first} ${item.name.last}`.toLowerCase();

      return (
        fullName.includes(text) ||
        item.email.toLowerCase().includes(text) ||
        item.location.country.toLowerCase().includes(text) ||
        item.location.state.toLowerCase().includes(text) ||
        item.location.city.toLowerCase().includes(text)
      );
    });

    return filtered.sort((first, second) => {
      const direction = this.sortAscending() ? 1 : -1;

      if (this.sortField() === 'age') {
        return (first.dob.age - second.dob.age) * direction;
      }

      return first.name.first.localeCompare(second.name.first) * direction;
    });
  });

  ngOnInit(): void {
    this.stateManager.loadItems();
  }

  updateSearchText(value: string): void {
    this.searchText.set(value);
  }

  sortByName(): void {
    this.changeSorting('name');
  }

  sortByAge(): void {
    this.changeSorting('age');
  }

  refreshItems(): void {
    this.stateManager.refreshItems();
  }

  private changeSorting(field: SortField): void {
    if (this.sortField() === field) {
      this.sortAscending.update((ascending) => !ascending);
      return;
    }

    this.sortField.set(field);
    this.sortAscending.set(true);
  }
}
