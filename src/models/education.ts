import { IBasic } from "./base";
import { IFaculty } from "./edu_structure";
import { IStudent } from "./student";
import { ISubject } from "./subject";
import { IUserField } from "./user";


export interface IEduForm extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface IEduType extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface IEduYear extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
  type: number;
  year: number;
}

export interface ICourse extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface ISemestr extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
  type: number;
  course?: ICourse;
}

export interface IEduPlan extends IBasic {
  course: number
  description: string
  direction: any
  direction_id: number
  eduType: IEduType
  eduYear: IEduYear
  eduForm: IEduForm
  edu_form_id: number
  edu_type_id: number
  edu_year_id: number
  faculty: IFaculty
  faculty_id: number
  first_end: string
  first_start: string
  id: number
  is_deleted?: number
  name: string
  order: number
  second_end: string
  second_start: string
  status: number
  type: number
}

export interface IEduSemestr extends IBasic {
  course: ICourse
  is_checked: number
  description: string
  semestr?: any
  direction: any
  direction_id: number
  eduType: IEduType
  eduYear: IEduYear
  eduForm: IEduForm
  eduPlan: IEduPlan
  edu_form_id: number
  edu_type_id: number
  edu_year_id: number
  faculty: IFaculty
  faculty_id: number
  id: number
  is_deleted?: number
  name: string
  order: number
  end_date: string
  start_date: string
  status: number
  type: number
  eduSemestrSubjects: ISubject[]
}

export interface IGroup extends IBasic {
  id: number,
  faculty: any,
  direction: any,
  eduPlan: any,
  languages: any,
  faculty_id: number,
  direction_id: number,
  edu_plan_id: number,
  unical_name: string,
  language_id: number,
  eduSemestrs?: IEduSemestr[]
  activeEduSemestr?: IEduSemestr
  student?: IStudent[]
}


export interface IPara extends IBasic {
  id: number,
  name: string,
  start_time: number,
  end_time: number
}
