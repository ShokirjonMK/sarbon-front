import { IBasic } from "./base";

export interface IDepartment extends IBasic {
  id: number;
  parent_id: number;
  name: string;
  status: number;
  parent: any;
  type: number;
  description?: string | number;
  types?: { id: number; name: string };
  leader?: any;
}

export interface IKafedra extends IBasic {
  id: number;
  faculty_id: number;
  direction_id: number;
  name: string;
  description: string;
  status: number;
  leader?: any;
  faculty: any;
  direction: any;
}

export interface IFaculty extends IBasic {
  id: number;
  user_id: number;
  name: string;
  description: string;
  status: number;
  leader: any;
}

export interface IDirection extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
  code: number;
  order: number
}

export interface IUserAccess extends IBasic {
  id: number;
  user_access_type_id: number;
  user_id: number;
  role_name: string;
  jobTitle: string;
  table_id: number;
  is_leader: number;
  user: any;
  loadRate?: {
    id: number;
    work_rate_id: number | null;
    work_load_id: number | null;
    workRate: {
      id: number;
      type: string;
    };
    workLoad: {
      id: number;
      name: string;
    };
  }[];
}
