import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout-routing.module';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    LayoutRoutingModule,
    RouterOutlet,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
