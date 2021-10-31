import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ConversionRatesHistoryStore,
  DEFAULT_DAYS,
  STORAGE_KEY,
} from './conversion-rates-history.store';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatRadioChange } from '@angular/material/radio';
import { StorageService } from '@currency-exchange/platform/storage';

type DataSection = 'table' | 'chart';

@Component({
  selector: 'ce-conversion-rates-history',
  templateUrl: './conversion-rates-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversionRatesHistoryStore],
})
export class ConversionRatesHistoryComponent implements OnInit, OnDestroy {
  @Input()
  public set currency(currency: string) {
    this.componentStore.updateCurrency(currency);
  }

  public currentSection$ = new BehaviorSubject<DataSection>('table');
  public items$ = this.componentStore.items$;
  public chart$ = this.componentStore.chart$;
  public statistics$ = this.componentStore.statistics$;
  public loading$ = this.componentStore.loading$;
  public displayedColumns = ['timestamp', 'rate'];
  public statisticsDisplayedColumns = ['label'];
  public statisticsDisplayedRows = ['label', 'rate'];

  public days = [7, 14, 30];

  public dayControl = new FormControl(DEFAULT_DAYS);

  private destroy$ = new Subject<void>();

  constructor(
    private componentStore: ConversionRatesHistoryStore,
    private storage: StorageService
  ) {}

  public ngOnInit() {
    this.dayControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.componentStore.updateDays(value));

    const { days } = this.storage.get(STORAGE_KEY);
    if (days) {
      this.dayControl.setValue(days);
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onRadioChange(evt: MatRadioChange) {
    this.currentSection$.next(evt.value);
  }
}
