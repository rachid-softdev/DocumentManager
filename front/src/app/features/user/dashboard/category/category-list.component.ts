import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../../core/services/category/category.service';
import { CategoryResponse } from '../../../../core/models/category/http/response/category-response.model';
import { CategoryMapper } from '../../../../core/models/category/http/mapper/category-mapper.model';
import { CategoryResponseAPI } from '../../../../core/models/category/http/response/category-response-api.model';
import { UserCategorySubscriptionService } from '../../../../core/services/user-category-subscription/user-category-subscription.service';
import { UserCategorySubscriptionMapper } from '../../../../core/models/user-category-subscription/mapper/user-category-subscription-mapper.model';
import { BaseCategoryResponse } from '../../../../core/models/category/http/response/base-category-response.model';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { UserCategorySubscriptionCreateRequest } from '../../../../core/models/user-category-subscription/request/user-category-subscription-create-request.model';
import { BaseUserResponse } from '../../../../core/models/user/http/response/base-user-response.model';
import { UserCategorySubscriptionResponse } from '../../../../core/models/user-category-subscription/response/user-category-subscription-response.model';
import { UserCategorySubscriptionResponseAPI } from '../../../../core/models/user-category-subscription/response/user-category-subscription-response-api.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryService],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private _collapsing: boolean = false;
  private _categories: CategoryResponse[] = [];
  private _usersCategoriesSubscription: UserCategorySubscriptionResponse[] = [];
  private _userResponse: BaseUserResponse | null = null;

  constructor(
    private readonly _categoryService: CategoryService,
    private readonly _categoryMapper: CategoryMapper,
    private readonly _userCategorySubscriptionService: UserCategorySubscriptionService,
    private readonly _userCategorySubscriptionMapper: UserCategorySubscriptionMapper,
    private readonly _authenticationService: AuthenticationService,
    private readonly _toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this._userResponse = this._authenticationService.getUser;
    this.loadCategories();
    this.loadUsersCategoriesSubscription();
  }

  ngOnDestroy(): void {
    this._categories = [];
  }

  public get getCollapsing(): boolean {
    return this._collapsing;
  }
  public set setCollapsing(collapsing: boolean) {
    this._collapsing = collapsing;
  }

  public get getCategoryService(): CategoryService {
    return this._categoryService;
  }

  public get getCategoryMapper(): CategoryMapper {
    return this._categoryMapper;
  }

  public get getCategories(): CategoryResponse[] {
    return this._categories;
  }

  public set setCategories(categories: CategoryResponse[]) {
    this._categories = categories;
  }

  public get getUserResponse(): BaseUserResponse | null {
    return this._userResponse;
  }

  public set setUserResponse(userResponse: BaseUserResponse | null) {
    this._userResponse = userResponse;
  }

  public get getUsersCategoriesSubscriptions(): UserCategorySubscriptionResponse[] {
    return this._usersCategoriesSubscription;
  }

  public set setUsersCategoriesSubscriptions(usersCategoriesSubscriptions: UserCategorySubscriptionResponse[]) {
    this._usersCategoriesSubscription = usersCategoriesSubscriptions;
  }

  searchByName: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value;
      if (!value || value.length === 0) {
        this.loadCategories();
        return;
      }
      this.searchByName = value;
      this.setCategories = this._categories.filter((category) =>
        category.getName.toLowerCase().includes(this.searchByName.toLowerCase()),
      );
    }
  }

  public loadCategories(): void {
    this._categoryService.getAllCategories().subscribe((response: CategoryResponseAPI[]) => {
      this.setCategories =
        response.map((categoryResponseAPI: CategoryResponseAPI) => {
          return this._categoryMapper.deserialize(categoryResponseAPI);
        }) || [];
    });
  }

  public loadUsersCategoriesSubscription(): void {
    this._userCategorySubscriptionService
      .getAllUsersCategoriesSubscriptionsByUserId(this.getUserResponse?.getId ?? "")
      .subscribe((response: UserCategorySubscriptionResponseAPI[]) => {
        this.setUsersCategoriesSubscriptions =
          response.map((userCategorySubscriptionResponseAPI: UserCategorySubscriptionResponseAPI) => {
            return this._userCategorySubscriptionMapper.deserialize(userCategorySubscriptionResponseAPI);
          }) || [];
      });
  }

  public isUserSubscribed(category: BaseCategoryResponse): boolean {
    return this._usersCategoriesSubscription.some((subscription) => subscription.getCategory?.getId === category.getId);
  }

  public onCategorySubscribeClick(categoryResponse: BaseCategoryResponse): void {
    const baseUserResponse: BaseUserResponse | null = this._authenticationService.getUser;
    const userCategorySubscriptionCreateRequest = new UserCategorySubscriptionCreateRequest(
      baseUserResponse,
      categoryResponse,
    );
    this._userCategorySubscriptionService
      .createUserCategorySubscription(userCategorySubscriptionCreateRequest)
      .subscribe({
        next: (userCategorySubscriptionResponseAPI: UserCategorySubscriptionResponseAPI) => {
          const userCategorySubscriptionResponse: UserCategorySubscriptionResponse =
            this._userCategorySubscriptionMapper.deserialize(userCategorySubscriptionResponseAPI);
          this.loadCategories();
          this.loadUsersCategoriesSubscription();
          this._toastrService.success(
            'Vous êtes maintenant abonné à la catégorie ' + userCategorySubscriptionResponse.getCategory?.getName,
            'Nouveau abonnement',
          );
        },
        error: (error) => {
          this._toastrService.error(
            "Une erreur est survenue lors de l'abonnement à la catégorie " + error?.error?.message,
            'Erreur abonnement',
          );
        },
      });
  }

  public onCategoryUnsubscribeClick(category: BaseCategoryResponse): void {
    this._userCategorySubscriptionService
      .deleteUserCategorySubscription(this.getUserResponse?.getId ?? '', category.getId)
      .subscribe({
        next: () => {
          this.loadCategories();
          this.loadUsersCategoriesSubscription();
          this._toastrService.success(
            'Vous êtes maintenant désabonné de la catégorie ' + category.getName,
            'Désabonnement',
          );
        },
        error: (error) => {
          this._toastrService.error(
            'Une erreur est survenue lors du désabonnement de la catégorie ' + error?.error?.message,
            'Erreur désabonnement',
          );
        },
      });
  }
}
