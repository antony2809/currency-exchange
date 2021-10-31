import { NgModule } from '@angular/core';
import { ConversionContainerComponent } from './containers';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { RatesApiModule } from '@currency-exchange/data/rates';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ConversionRatesHistoryComponent,
  ConversionRatesResultComponent,
  ConversionRatesSelectorComponent,
} from './components';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatRadioModule } from '@angular/material/radio';
import { StorageModule } from '@currency-exchange/platform/storage';

@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
    MatGridListModule,
    MatSnackBarModule,
    RatesApiModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgApexchartsModule,
    StorageModule,
    RouterModule.forChild([
      { path: '', component: ConversionContainerComponent },
    ]),
    MatIconModule,
  ],
  declarations: [
    ConversionContainerComponent,
    ConversionRatesSelectorComponent,
    ConversionRatesResultComponent,
    ConversionRatesHistoryComponent,
  ],
  providers: [DatePipe],
})
export class ConversionModule {}
