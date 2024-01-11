import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { AccordionModule } from '../../../shared/components/accordion/accordion.module';
import { DocumentListCreateComponent } from './document-list/document-list-create/document-list-create.component';
import { DocumentListDetailComponent } from './document-list/document-list-detail/document-list-detail.component';
import { CategoryListComponent } from './category/category-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CategoryListComponent,
    DocumentListComponent,
    DocumentListCreateComponent,
    DocumentListDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    /* Importation du module SharedModule pour les app-custom-paginator et app-toast exportés */
    SharedModule,
    AccordionModule,
    TranslateModule,
  ],
  exports: [
    DashboardComponent,
    CategoryListComponent,
    DocumentListComponent,
    DocumentListCreateComponent,
    DocumentListDetailComponent,
  ],
  providers: [],
})
export class DashboardModule {}
