import { TestBed } from '@angular/core/testing';

import { PublicMenuService } from './public-menu.service';

describe('PublicMenuService', () => {
  let service: PublicMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


