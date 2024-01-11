import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from '../public/public.component';
import { HomeModule } from './home/home.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PublicComponent],
  imports: [CommonModule, RouterOutlet, SharedModule, HomeModule, AuthenticationModule, PublicRoutingModule],
  exports: [PublicComponent, AuthenticationModule],
})
export class PublicModule {}
