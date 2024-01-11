import { BaseUserResponseAPI } from "../../../user/http/response/base-user-response-api.model";
import { BaseRoleResponseAPI } from "./base-role-response-api.model";

export type RoleResponseAPI = BaseRoleResponseAPI & {
  users: BaseUserResponseAPI[];
};
