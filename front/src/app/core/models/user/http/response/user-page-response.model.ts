import { BaseUserResponse } from './base-user-response.model';

export class UserPageResponse {
  content: BaseUserResponse[] = [];
  empty: boolean = true;
  first: boolean = false;
  last: boolean = false;
  number: number = 0;
  numberOfElements: number = 0;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
  } = {
    offset: 0,
    pageNumber: 0,
    pageSize: 0,
    paged: false,
    unpaged: false,
    sort: {
      unsorted: false,
      sorted: false,
      empty: false,
    },
  };
  size: number = 0;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  } = {
    unsorted: false,
    sorted: false,
    empty: false,
  };
  totalElements: number = 0;
  totalPages: number = 0;
}
