import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConversionResult } from '@currency-exchange/data/rates';

@Component({
  selector: 'ce-conversion-rates-result',
  templateUrl: './conversion-rates-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionRatesResultComponent {
  @Input()
  public result: ConversionResult | undefined;
}
