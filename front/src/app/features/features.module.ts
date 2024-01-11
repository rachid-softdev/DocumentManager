import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { PublicModule } from './public/public.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LayoutModule, AdminModule, UserModule, PublicModule],
  exports: [AdminModule, UserModule, PublicModule],
})
export class FeaturesModule {}
