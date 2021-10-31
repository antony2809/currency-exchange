import { TestBed } from '@angular/core/testing';

import { StorageModule } from './storage.module';

describe('StorageModule', () => {
  let module: StorageModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageModule],
    });

    module = TestBed.inject(StorageModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
