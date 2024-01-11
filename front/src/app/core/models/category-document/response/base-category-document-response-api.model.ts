import { BaseCategoryResponseAPI } from "../../category/http/response/base-category-response-api.model";
import { BaseDocumentResponseAPI } from "../../document/http/response/base-document-response-api.model";

export type BaseCategoryDocumentResponseAPI = {
  category?: BaseCategoryResponseAPI;
  document?: BaseDocumentResponseAPI;
};
