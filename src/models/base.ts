/** @format */

import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";

export interface IBasic {
  created_at: number;
  created_by: number;
  updated_at: number | null;
  updated_by: number | null;
  createdBy?: ICreateOrUpdateBy;
  updatedBy?: ICreateOrUpdateBy;
}

export interface ICreateOrUpdateBy {
  avatar: string;
  email: string | null;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
  role: string[];
  status: number;
  username: string;
}

export type I_meta = {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
};

export type I_links = {
  first: { href: string };
  last: { href: string };
  self: { href: string };
};

export type InformerDRDT<T = any> = {
  items: Array<T>;
  _meta: I_meta;
  _links: I_links;
};

export type InformerById<T = any> = {
  data: T;
  message: string;
  status: number;
};

export type IRefetch = <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<InformerById<any>, unknown>>;
