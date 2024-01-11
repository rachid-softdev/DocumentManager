import { BaseCategoryResponseAPI } from "../../../category/http/response/base-category-response-api.model";
import { BaseDocumentResponseAPI } from "./base-document-response-api.model";

export type DocumentResponseAPI = BaseDocumentResponseAPI & {
  categories?: BaseCategoryResponseAPI[];
};
