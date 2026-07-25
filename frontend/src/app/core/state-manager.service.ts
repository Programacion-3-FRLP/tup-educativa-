import { inject, Injectable, signal } from '@angular/core';
import { Api } from './api';
import { Item } from './item.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  private readonly api = inject(Api);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly storageKey = 'items';

  private readonly itemsState = signal<Item[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal(false);

  readonly items = this.itemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly hasError = this.errorState.asReadonly();

  loadItems(): void {
    const cachedItems = this.localStorageService.get<Item[]>(this.storageKey);

    if (cachedItems) {
      this.itemsState.set(cachedItems);
      this.errorState.set(false);
      return;
    }

    this.loadFromApi();
  }

  refreshItems(): void {
    this.localStorageService.remove(this.storageKey);
    this.loadFromApi();
  }

  private loadFromApi(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(false);

    this.api.getItems().subscribe({
      next: (response) => {
        this.itemsState.set(response.results);
        this.localStorageService.save(this.storageKey, response.results);
        this.loadingState.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al obtener los alumnos', error);
        this.errorState.set(true);
        this.loadingState.set(false);
      },
    });
  }
}
