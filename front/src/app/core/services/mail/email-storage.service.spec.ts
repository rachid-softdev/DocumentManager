import { TestBed } from '@angular/core/testing';
import { EmailTemplateStorageService } from './email-storage.service';

describe('EmailTemplateStorageService', () => {
  let service: EmailTemplateStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailTemplateStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
