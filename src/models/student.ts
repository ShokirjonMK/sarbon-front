import { ILanguage } from "components/Structure/header/components/types";
import { IBasic } from "./base";
import { IFaculty } from "./edu_structure";
import {
  ICourse,
  IEduForm,
  IEduPlan,
  IEduSemestr,
  IEduType,
  IEduYear,
  IGroup,
} from "./education";
import IUsers, { IProfile, IUserField } from "./user";
import { ISimple } from "./other";
import { ISubject, ISubjectCategory } from "./subject";

export interface IStudent extends IBasic {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  username: string;
  avatar: string;
  categoryOfCohabitant?: any;
  category_of_cohabitant_id: number | null;
  course_id: number | null;
  description: string | null;
  diplom_date: string | null;
  diplom_number: string | null;
  diplom_seria: string | null;
  diplom_file: string | null;
  direction_id: number | null;
  edu_form_id: number | null;
  edu_lang_id: number | null;
  edu_plan_id: number | null;
  edu_type_id: number | null;
  edu_year_id: number | null;
  faculty_id: number | null;
  is_contract: number;
  tutor_id: number;
  last_education: string | null;
  live_location: string | null;
  parent_phone: string | null;
  partners_count: null | string;
  res_person_phone: null | string;
  residence_status_id: number | null;
  social_category_id: number | null;
  user_id: number;
  student_category_id: number | null;
  group_id: number | null;
  type: 1 | 2;
  edu_language_id: number | null;
  form_of_payment_id: number | null;
  status: number;
  studentAttendReasonCount?: number | null | any

  father_fio?: string | null;
  father_number?: number | null;
  father_info?: string | null;
  mather_fio?: string | null;
  mather_number?: number | null;
  mather_info?: string | null;

  user?: IUserField;
  profile?: IProfile;
  studentAttendsCount?: number;
  studentCategory?: any;
  residenceStatus?: ISimple;
  studentSubjectRestrict?: ISimple;
  country?: ISimple;
  region?: ISimple;
  area?: ISimple;
  permanentCountry?: ISimple;
  permanentRegion?: ISimple;
  permanentArea?: ISimple;
  socialCategory?: ISimple;
  course?: ICourse;
  faculty?: IFaculty;
  eduLang?: ILanguage;
  nationality?: ISimple;
  direction?: ISimple;
  citizenship?: ISimple;
  eduPlan?: IEduPlan;
  eduType?: IEduType;
  eduYear?: IEduYear;
  group?: IGroup;
  eduForm?: IEduForm;
  tutor?: IUsers
  // studentAttends?: IStudentAttend[],
  // eduPlan?: IEducationPlan
  // eduType?: IEducationType
  // eduForm?: IEducationForm
  // eduYear?: IEducationYear
  // attends?: IStudentAttend[]
}

export interface IAttend extends IBasic {
  date: string;
  edu_plan_id: number;
  edu_semestr_id: number;
  edu_year_id: number;
  faculty_id: number;
  reason: number | null
  id: number;
  order: number;
  status: number;
  student_ids: number[];
  subject_category_id: number;
  subject_id: number;
  time_table_id: number;
  type: number;
  student?: any,
  timeTable?: ISimple;
  subject?: ISubject;
  subjectCategory?: ISubjectCategory;
  timeTableDate?: any
}

export interface IStudentAttendReason extends IBasic {
  description: string
  edu_plan_id: number
  edu_year_id: number
  end: number
  faculty_id: number
  file: string
  id: number
  is_confirmed: 0 | 1 | 2
  order: number
  start: number
  status: number
  student_id: number
  subject_id:any
  student: IStudent,
  eduSemestr?: IEduSemestr
}