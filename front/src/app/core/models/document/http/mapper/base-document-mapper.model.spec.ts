import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';
import { BaseDocumentMapper } from './base-document-mapper.model';
import { TestBed } from '@angular/core/testing';

describe('BaseDocumentMapper', () => {
  it('should create an instance', () => {
    let baseUserMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      baseUserMapper = TestBed.inject(BaseUserMapper);
    });
    if (baseUserMapper) {
      expect(new BaseDocumentMapper(baseUserMapper)).toBeTruthy();
    } else {
      fail('Dependencies are null');
    }
  });
});
