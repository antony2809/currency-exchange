import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'conversion',
    loadChildren: () =>
      import('@currency-exchange/features/rates/conversion').then(
        (m) => m.ConversionModule
      ),
  },
  {
    path: 'conversion-history',
    loadChildren: () =>
      import('@currency-exchange/features/rates/conversion-history').then(
        (m) => m.ConversionHistoryModule
      ),
  },
  {
    path: '**',
    redirectTo: 'conversion',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
