import { Injectable } from '@angular/core';

declare const gtag: (
  command: 'event',
  eventName: string,
  eventParams: Record<string, unknown>,
) => void;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  logEvent(
    eventName: string,
    eventParams: Record<string, unknown> = {},
  ): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventParams);
    } else {
      console.warn(`gtag is not defined. Event ${eventName} not logged.`);
    }
  }

  logLogin(email: string): void {
    this.logEvent('login', {
      method: 'Google',
      user_email: email,
    });
  }

  logLogout(): void {
    this.logEvent('logout');
  }

  logSearch(searchTerm: string): void {
    this.logEvent('search', {
      search_term: searchTerm,
    });
  }

  logSorting(field: string, ascending: boolean): void {
    this.logEvent('sort_items', {
      sort_field: field,
      sort_direction: ascending ? 'asc' : 'desc',
    });
  }
}
