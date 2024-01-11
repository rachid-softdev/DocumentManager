import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentListValidationComponent } from '../../admin/dashboard/document/document-list-validation/document-list-validation.component';
import { CategoryListComponent } from './category/category-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'categories', component: CategoryListComponent },
      { path: 'documents', component: DocumentListComponent },
      { path: 'documents-validation', component: DocumentListValidationComponent },
      { path: '**', redirectTo: 'documents' },
    ],
  },
  { path: '**', redirectTo: 'documents' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
