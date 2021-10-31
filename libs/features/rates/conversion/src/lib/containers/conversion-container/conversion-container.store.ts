import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  CONVERSION_RESULTS_STORAGE_KEY,
  CONVERSION_STORAGE_KEY,
  ConversionResult,
  DEFAULT_FROM_CURRENCY,
  ExchangeRate,
  RatesApiService,
} from '@currency-exchange/data/rates';
import { switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 } from 'uuid';

import { StorageService } from '@currency-exchange/platform/storage';
import { CurrencySelectorChanges } from '../../models';
import { Router } from '@angular/router';

export interface ConversionContainerState {
  loading: boolean;
  rates: ExchangeRate[];
  result?: ConversionResult;
  currentCurrency: string;
}

const initialState = {
  loading: true,
  rates: [],
  currentCurrency: DEFAULT_FROM_CURRENCY,
};

@Injectable()
export class ConversionContainerStore extends ComponentStore<ConversionContainerState> {
  constructor(
    private rateApiService: RatesApiService,
    private snackBar: MatSnackBar,
    private storage: StorageService,
    private router: Router
  ) {
    super(initialState);
    this.onStoreInit();
    this.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.storage.set<ConversionContainerState>(
          CONVERSION_STORAGE_KEY,
          value
        )
      );
  }

  public readonly loading$ = this.select(({ loading }) => loading);
  public readonly currentCurrency$ = this.select(
    ({ currentCurrency }) => currentCurrency
  );
  public readonly rates$ = this.select(({ rates }) => rates);
  public readonly result$ = this.select(({ result }) => result);

  public loadRates = this.effect<void>((void$) =>
    void$.pipe(
      switchMap(() =>
        this.rateApiService.fetchExchangeRates().pipe(
          tapResponse(
            (rates) => this.patchState({ rates, loading: false }),
            () => this.snackBar.open('Error fetching exchange rates')
          )
        )
      )
    )
  );

  public convert = this.effect<CurrencySelectorChanges>((changes$) =>
    changes$.pipe(
      withLatestFrom(this.rates$),
      tap(([changes, rates]) => {
        const fromCurrency = rates.find(
          (item) => item.currency === changes.fromCurrency
        );
        const toCurrency = rates.find(
          (item) => item.currency === changes.toCurrency
        );
        if (fromCurrency && toCurrency) {
          const result = {
            amount: changes.amount,
            fromCurrency: fromCurrency.currency,
            toCurrency: toCurrency.currency,
            amountConverted:
              (Number(fromCurrency.rate) / Number(toCurrency.rate)) *
              changes.amount,
            oneFromCurrencyConverted:
              Number(fromCurrency.rate) / Number(toCurrency.rate),
            oneToCurrencyConverted:
              Number(toCurrency.rate) / Number(fromCurrency.rate),
          };
          this.patchState({
            currentCurrency: fromCurrency.currency,
            result,
          });
          this.updateConversionResultStory(result);
        }
      })
    )
  );

  private updateConversionResultStory(result: ConversionResult) {
    const currentResults =
      this.storage.get<ConversionResult[]>(CONVERSION_RESULTS_STORAGE_KEY) ??
      [];
    result.date = new Date();
    result.id = v4();
    this.storage.set(CONVERSION_RESULTS_STORAGE_KEY, [
      ...currentResults,
      result,
    ]);
  }

  private onStoreInit = this.effect<void>((void$) =>
    void$.pipe(
      tap(() => {
        const navigationResultData =
          this.router.getCurrentNavigation()?.extras?.state?.result ??
          undefined;

        const localData = this.storage.get<ConversionContainerState>(
          CONVERSION_STORAGE_KEY
        );
        if (localData) {
          this.patchState({
            ...localData,
            ...(navigationResultData && { result: navigationResultData }),
          });
        }
      })
    )
  );
}
