import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  public set<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public get<T = unknown>(key: string) {
    try {
      return JSON.parse(this.storage.getItem(key) ?? '');
    } catch (e) {
      return null;
    }
  }

  public remove(key: string): void {
    this.storage.removeItem(key);
  }

  public clear(): void {
    this.storage.clear();
  }
}
