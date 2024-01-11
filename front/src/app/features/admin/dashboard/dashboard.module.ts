import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryListComponent } from './category/category-list.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { AccordionModule } from '../../../shared/components/accordion/accordion.module';
import { CategoryListCreateComponent } from './category/category-list-create/category-list-create.component';
import { CategoryListUpdateComponent } from './category/category-list-update/category-list-update.component';
import { CategoryListDeleteComponent } from './category/category-list-delete/category-list-delete.component';
import { CategoryListDetailComponent } from './category/category-list-detail/category-list-detail.component';
import { DocumentListCreateComponent } from './document/document-list/document-list-create/document-list-create.component';
import { DocumentListDetailComponent } from './document/document-list/document-list-detail/document-list-detail.component';
import { DocumentListDeleteComponent } from './document/document-list/document-list-delete/document-list-delete.component';
import { DocumentListUpdateComponent } from './document/document-list/document-list-update/document-list-update.component';
import { DocumentListValidationComponent } from './document/document-list-validation/document-list-validation.component';
import { EmailTemplateComponent } from './email-template/email-template.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CategoryListComponent,
    CategoryListCreateComponent,
    CategoryListUpdateComponent,
    CategoryListDeleteComponent,
    CategoryListDetailComponent,
    DocumentListComponent,
    DocumentListValidationComponent,
    DocumentListCreateComponent,
    DocumentListUpdateComponent,
    DocumentListDetailComponent,
    DocumentListDeleteComponent,
    EmailTemplateComponent,
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
    CategoryListCreateComponent,
    CategoryListUpdateComponent,
    CategoryListDeleteComponent,
    CategoryListDetailComponent,
    DocumentListComponent,
    DocumentListValidationComponent,
    DocumentListCreateComponent,
    DocumentListUpdateComponent,
    DocumentListDetailComponent,
   DocumentListDeleteComponent,
    EmailTemplateComponent,
  ],
  providers: [],
})
export class DashboardModule {}
