import { BaseRoleResponseAPI } from "../../../role/http/response/base-role-response-api.model";
import { BaseUserResponseAPI } from "./base-user-response-api.model";

export type UserResponseAPI = BaseUserResponseAPI & {
  roles?: BaseRoleResponseAPI[];
};

