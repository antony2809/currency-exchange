import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('SessionStorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.inject(StorageService);
  });

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      configurable: true,
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      configurable: true,
      value: localStorage,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set item to local storage', () => {
    service.set('key', { a: 1 });
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'key',
      JSON.stringify({ a: 1 })
    );
  });

  it('should get item from local storage', () => {
    service.get('key');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('key');
  });

  it('should remove item from local storage', () => {
    service.remove('key');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('key');
  });

  it('should clear local storage', () => {
    service.clear();
    expect(window.localStorage.clear).toHaveBeenCalledWith();
  });
});
