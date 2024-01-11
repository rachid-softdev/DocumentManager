import { TestBed } from '@angular/core/testing';

import { UserCategorySubscriptionService } from './user-category-subscription.service';

describe('UserCategorySubscriptionService', () => {
  let service: UserCategorySubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCategorySubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
