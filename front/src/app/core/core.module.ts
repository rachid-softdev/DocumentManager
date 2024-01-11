import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserStorageService } from './services/user-storage.service';
import { CategoryService } from './services/category/category.service';
import { DocumentService } from './services/document/document.service';
import { UserService } from './services/user/user.service';
import { EmailService } from './services/mail/email.service';
import { SelectivePreloadingStrategyService } from './services/preloading/selective-preloading-strategy.service';
import { EmailTemplateStorageService } from './services/mail/email-storage.service';
import { UserCategorySubscriptionService } from './services/user-category-subscription/user-category-subscription.service';
import { CategoryDocumentService } from './services/category-document/category-document.service';
import { BaseUserMapper } from './models/user/http/mapper/base-user-mapper.model';
import { BaseCategoryMapper } from './models/category/http/mapper/base-category-mapper.model';
import { CategoryMapper } from './models/category/http/mapper/category-mapper.model';
import { BaseDocumentMapper } from './models/document/http/mapper/base-document-mapper.model';
import { DocumentMapper } from './models/document/http/mapper/document-mapper.model';
import { BaseCategoryDocumentMapper } from './models/category-document/mapper/base-category-document-mapper.model';
import { CategoryDocumentMapper } from './models/category-document/mapper/category-document-mapper.model';
import { BaseUserCategorySubscriptionMapper } from './models/user-category-subscription/mapper/base-user-category-subscription-mapper.model';
import { UserCategorySubscriptionMapper } from './models/user-category-subscription/mapper/user-category-subscription-mapper.model';
import { UserMapper } from './models/user/http/mapper/user-mapper.model';
import { BaseRoleMapper } from './models/role/http/mapper/base-role-mapper.model';
import { RoleMapper } from './models/role/http/mapper/role-mapper.model';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    // Services
    AuthenticationService,
    CategoryService,
    DocumentService,
    UserService,
    UserStorageService,
    CategoryDocumentService,
    UserCategorySubscriptionService,
    SelectivePreloadingStrategyService,
    EmailService,
    EmailTemplateStorageService,
    // Mappers
    BaseUserMapper,
    UserMapper,
    BaseRoleMapper,
    RoleMapper,
    BaseCategoryMapper,
    CategoryMapper,
    BaseDocumentMapper,
    DocumentMapper,
    BaseCategoryDocumentMapper,
    CategoryDocumentMapper,
    BaseUserCategorySubscriptionMapper,
    UserCategorySubscriptionMapper,
  ],
})
export class CoreModule {}
