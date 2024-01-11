import { BaseCategoryResponseAPI } from "./base-category-response-api.model";

export type CategoryResponseAPI = BaseCategoryResponseAPI & {
  subcategories?: CategoryResponseAPI[];
};
