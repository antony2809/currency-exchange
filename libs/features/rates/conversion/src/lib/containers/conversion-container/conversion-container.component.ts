import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConversionContainerStore } from './conversion-container.store';
import { CurrencySelectorChanges } from '../../models';

@Component({
  selector: 'ce-conversion-container',
  templateUrl: 'conversion-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversionContainerStore],
})
export class ConversionContainerComponent implements OnInit {
  public rates$ = this.componentStore.rates$;
  public result$ = this.componentStore.result$;
  public currentCurrency$ = this.componentStore.currentCurrency$;

  constructor(private componentStore: ConversionContainerStore) {}

  public ngOnInit() {
    this.componentStore.loadRates();
  }

  public convert(evt: CurrencySelectorChanges) {
    this.componentStore.convert(evt);
  }
}
