import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor() { }

  public logEvent(eventName: string, eventParams: Record<string, any> = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventParams);
    } else {
      console.warn(`gtag is not defined. Event ${eventName} not logged.`);
    }
  }

  public logLogin(email: string) {
    this.logEvent('login', {
      method: 'Google',
      user_email: email,
    });
  }

  public logLogout() {
    this.logEvent('logout');
  }

  public logSearch(searchTerm: string) {
    this.logEvent('search', {
      search_term: searchTerm,
    });
  }

  public logSorting(field: string, ascending: boolean) {
    this.logEvent('sort_items', {
      sort_field: field,
      sort_direction: ascending ? 'asc' : 'desc',
    });
  }
}
