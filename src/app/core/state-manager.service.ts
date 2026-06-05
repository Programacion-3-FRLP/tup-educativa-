import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Api } from './api';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  private items$ = new BehaviorSubject<any[]>([]);

  constructor(
    private api: Api,
    private localStorageService: LocalStorageService,
  ) {}

  getItems(): Observable<any[]> {
    return this.items$.asObservable();
  }

  loadItems(): void {
    const cached = this.localStorageService.get<any[]>('items');
    if (cached) {
      this.items$.next(cached);
    } else {
      this.loadFromApi();
    }
  }

  loadFromApi(): void {
    this.api.getItems().subscribe((response: any) => {
      this.items$.next(response.results);

      this.localStorageService.save('items', response.results);
    });
  }
}
