import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { isNonNullish } from '@currency-exchange/utilities';
import { combineLatest, of } from 'rxjs';
import {
  ExchangeRateHistory,
  RatesApiService,
} from '@currency-exchange/data/rates';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { mapRatesToChart } from '../../utils';
import { StorageService } from '@currency-exchange/platform/storage';

export const DEFAULT_DAYS = 7;
export const DATE_FORMAT = 'yyyy-MM-ddTHH:mm:ss';
export const STORAGE_KEY = 'rates-history';

interface ConversionRatesHistoryState {
  loading: boolean;
  currency?: string;
  days: number;
  items?: ExchangeRateHistory[];
}

const initialState = {
  loading: true,
  days: DEFAULT_DAYS,
};

@Injectable()
export class ConversionRatesHistoryStore extends ComponentStore<ConversionRatesHistoryState> {
  constructor(
    private ratesApiServices: RatesApiService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private storage: StorageService
  ) {
    super(initialState);
    this.onStoreInit();
    this.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.storage.set<ConversionRatesHistoryState>(STORAGE_KEY, value)
      );
  }

  public readonly loading$ = this.select(({ loading }) => loading);

  public readonly items$ = this.select(({ items }) => items).pipe(
    filter(isNonNullish)
  );

  public readonly statistics$ = this.items$.pipe(
    map((items) => [...items].sort((a, b) => Number(a.rate) - Number(b.rate))),
    switchMap((items) => {
      if (items.length === 0) {
        return [];
      }

      const lowest = items[0].rate;
      const highest = items[items.length - 1]?.rate;
      const average =
        items.reduce((acc, item) => acc + Number(item.rate), 0) / items.length;

      return of([
        { label: 'Lowest', rate: lowest },
        { label: 'Highest', rate: highest },
        { label: 'Average', rate: average },
      ]);
    })
  );

  public readonly chart$ = this.items$.pipe(
    map((items) => mapRatesToChart(items))
  );

  public readonly currency$ = this.select(({ currency }) => currency, {
    debounce: true,
  }).pipe(filter(isNonNullish), distinctUntilChanged());

  public readonly days$ = this.select(({ days }) => days, {
    debounce: true,
  }).pipe(distinctUntilChanged());

  public readonly params$ = combineLatest([this.currency$, this.days$]);

  public updateCurrency(currency: string) {
    this.patchState({ currency });
  }

  public updateDays(days: number) {
    this.patchState({
      days,
    });
  }

  public loadHistory = this.effect<[string, number]>((params$) =>
    params$.pipe(
      switchMap(([currency, days]) => {
        const [fromDate, toDate] = this.getFromAndToDates(days);
        return this.ratesApiServices
          .fetchCurrencyHistory(currency, fromDate, toDate)
          .pipe(
            tapResponse(
              (items) =>
                this.patchState({
                  items: items.sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  ),
                  loading: false,
                }),
              () => {
                this.snackBar.open('Error fetching currency history');
                this.patchState({ loading: false });
              }
            )
          );
      })
    )
  )(this.params$);

  public setLoading = this.effect<[string, number]>((params$) =>
    params$.pipe(tap(() => this.patchState({ loading: true })))
  )(this.params$);

  private getFromAndToDates(days: number) {
    const fromDate = new Date();
    const toDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    return [
      `${this.datePipe.transform(fromDate, DATE_FORMAT)}Z`,
      `${this.datePipe.transform(toDate, DATE_FORMAT)}Z`,
    ];
  }

  private onStoreInit = this.effect<void>((void$) =>
    void$.pipe(
      tap(() => {
        const localData =
          this.storage.get<ConversionRatesHistoryState>(STORAGE_KEY);
        if (localData) {
          this.patchState({ ...localData });
        }
      })
    )
  );
}
