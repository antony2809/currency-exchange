import { NgModule } from '@angular/core';

import { ConversionHistoryComponent } from './containers';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { StorageModule } from '@currency-exchange/platform/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    StorageModule,
    RouterModule.forChild([
      { path: '', component: ConversionHistoryComponent },
    ]),
  ],
  declarations: [ConversionHistoryComponent],
})
export class ConversionHistoryModule {}
