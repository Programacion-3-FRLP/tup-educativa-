import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

interface StorageEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly defaultExpirationMs = 5 * 60 * 1000;

  save<T>(
    key: string,
    value: T,
    expirationMs = this.defaultExpirationMs,
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const entry: StorageEntry<T> = {
      value,
      expiresAt: Date.now() + expirationMs,
    };

    localStorage.setItem(key, JSON.stringify(entry));
  }

  get<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return null;
    }

    try {
      const entry = JSON.parse(storedValue) as StorageEntry<T>;

      if (Date.now() >= entry.expiresAt) {
        this.remove(key);
        return null;
      }

      return entry.value;
    } catch {
      this.remove(key);
      return null;
    }
  }

  remove(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
}
