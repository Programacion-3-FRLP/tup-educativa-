import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemsApiResponse } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://randomuser.me/api/?results=10';

  getItems(): Observable<ItemsApiResponse> {
    return this.http.get<ItemsApiResponse>(this.apiUrl);
  }
}
