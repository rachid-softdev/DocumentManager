import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category/category-list.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { DocumentListValidationComponent } from './document/document-list-validation/document-list-validation.component';
import { EmailTemplateComponent } from './email-template/email-template.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'categories', component: CategoryListComponent },
      { path: 'documents', component: DocumentListComponent },
      { path: 'documents-validation', component: DocumentListValidationComponent },
      { path: 'email-template', component: EmailTemplateComponent },
      { path: '**', redirectTo: 'categories' },
    ],
  },
  { path: '**', redirectTo: 'categories' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
