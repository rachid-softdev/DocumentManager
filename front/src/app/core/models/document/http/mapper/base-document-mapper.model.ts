import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';
import { BaseDocumentResponseAPI } from '../response/base-document-response-api.model';
import { BaseDocumentResponse } from '../response/base-document-response.model';

@Injectable()
export class BaseDocumentMapper implements Deserialize<BaseDocumentResponse> {
  
  constructor(private readonly _baseUserMapper: BaseUserMapper) {}

  destructor() {}

  deserialize(input: BaseDocumentResponseAPI): BaseDocumentResponse {
    const {
      id = '',
      title = '',
      description = '',
      file_url = '',
      sender_user = null,
      validator_user = null,
      is_validated = false,
      validated_at = '',
    } = input || {};
    const baseUserResponseSenderUser = sender_user ? this._baseUserMapper.deserialize(sender_user) : null;
    const baseUserResponseValidatorUser = validator_user ? this._baseUserMapper.deserialize(validator_user) : null;
    const documentResponse = new BaseDocumentResponse(
      id,
      title,
      description,
      file_url,
      baseUserResponseSenderUser,
      is_validated,
      baseUserResponseValidatorUser,
      validated_at,
    );
    return documentResponse;
  }
}
