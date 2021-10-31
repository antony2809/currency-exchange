import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CONVERSION_STORAGE_KEY,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  ExchangeRate,
} from '@currency-exchange/data/rates';
import { CurrencySelectorChanges } from '../../models';
import { map, startWith } from 'rxjs/operators';
import { combineLatest, ReplaySubject } from 'rxjs';
import { StorageService } from '@currency-exchange/platform/storage';

@Component({
  selector: 'ce-conversion-rates-selector',
  templateUrl: './conversion-rates-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionRatesSelectorComponent implements OnInit {
  @Input()
  public set rates(rates: ExchangeRate[]) {
    this.rates$.next(rates);
  }

  @Output()
  public convert = new EventEmitter<CurrencySelectorChanges>();

  private rates$ = new ReplaySubject<ExchangeRate[]>();

  public form = this.fb.group({
    amount: [1, Validators.compose([Validators.required, Validators.min(1)])],
    fromCurrency: [DEFAULT_FROM_CURRENCY, Validators.required],
    toCurrency: [DEFAULT_TO_CURRENCY, Validators.required],
  });

  public fromRates$ = combineLatest([
    this.rates$,
    this.form.controls.fromCurrency.valueChanges.pipe(startWith('')),
  ]).pipe(map(([rates, value]) => this.filterRates(value, rates)));

  public toRates$ = combineLatest([
    this.rates$,
    this.form.controls.toCurrency.valueChanges.pipe(startWith('')),
  ]).pipe(map(([rates, value]) => this.filterRates(value, rates)));

  constructor(private fb: FormBuilder, private storage: StorageService) {}

  public switchRates() {
    const { fromCurrency, toCurrency } = this.form.value;
    this.form.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
    });
  }

  public convertRates() {
    this.convert.emit(this.form.value);
  }

  public ngOnInit() {
    const { result } = this.storage.get(CONVERSION_STORAGE_KEY);
    if (result) {
      this.form.patchValue({
        fromCurrency: result.fromCurrency,
        toCurrency: result.toCurrency,
        amount: result.amount,
      });
    }
  }

  private filterRates(value: string, rates: ExchangeRate[]): ExchangeRate[] {
    return rates.filter((rate) =>
      rate.currency.toLowerCase().includes(value.toLowerCase())
    );
  }
}
