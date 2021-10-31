import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs/operators';
import { StorageService } from '@currency-exchange/platform/storage';
import {
  CONVERSION_RESULTS_STORAGE_KEY,
  ConversionResult,
} from '@currency-exchange/data/rates';

interface ConversionHistoryState {
  items: ConversionResult[];
}

const initialState = {
  items: [],
};

@Injectable()
export class ConversionHistoryStore extends ComponentStore<ConversionHistoryState> {
  constructor(private storage: StorageService) {
    super(initialState);
    this.onStoreInit();
  }

  public readonly items$ = this.select(({ items }) => [...items].reverse());

  public deleteResult = this.effect<string>((id$) =>
    id$.pipe(
      tap((id) => {
        const items = this.get().items.filter((item) => item.id !== id);
        this.patchState({
          items,
        });
        this.storage.set<ConversionResult[]>(
          CONVERSION_RESULTS_STORAGE_KEY,
          items
        );
      })
    )
  );

  private onStoreInit = this.effect<void>((void$) =>
    void$.pipe(
      tap(() => {
        const localData = this.storage.get<ConversionResult[]>(
          CONVERSION_RESULTS_STORAGE_KEY
        );
        if (localData) {
          this.patchState({ items: localData });
        }
      })
    )
  );
}
