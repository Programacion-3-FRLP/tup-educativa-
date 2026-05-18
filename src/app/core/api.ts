import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private http: HttpClient) {}
  
  getItems() {
    return this.http.get('https://randomuser.me/api/?results=10');
  }
}