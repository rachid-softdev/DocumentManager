import { BaseUserResponseAPI } from "../../../user/http/response/base-user-response-api.model";

export type BaseDocumentResponseAPI = {
  id?: string;
  title?: string;
  description?: string;
  file_url?: string;
  sender_user?: BaseUserResponseAPI;
  validator_user?: BaseUserResponseAPI;
  is_validated?: boolean;
  validated_at?: string;
};
