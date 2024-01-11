import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategyService } from './core/services/preloading/selective-preloading-strategy.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/layout/layout.module').then((m) => m.LayoutModule),
  },
  // Not found
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false, // <-- debugging purposes only
      preloadingStrategy: SelectivePreloadingStrategyService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
