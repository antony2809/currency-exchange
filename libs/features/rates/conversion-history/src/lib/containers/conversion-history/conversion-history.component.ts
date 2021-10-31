import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConversionHistoryStore } from './conversion-history.store';
import { Router } from '@angular/router';
import { ConversionResult } from '@currency-exchange/data/rates';

@Component({
  selector: 'ce-conversion-history',
  templateUrl: './conversion-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversionHistoryStore],
})
export class ConversionHistoryComponent {
  public items$ = this.componentStore.items$;
  public idHover = null;
  public displayedColumns = ['date', 'event', 'actions'];

  constructor(
    private componentStore: ConversionHistoryStore,
    private router: Router
  ) {}

  public deleteResult(id: string) {
    this.componentStore.deleteResult(id);
  }

  public viewResult(result: ConversionResult) {
    this.router.navigate(['/conversion'], { state: { result } });
  }
}
