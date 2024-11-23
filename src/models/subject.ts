import { ContentType } from "pages/subject_content";
import { IBasic } from "./base";
import { IKafedra } from "./edu_structure";
import { IEduForm, IEduType, ISemestr } from "./education";

export interface ISubject extends IBasic {
  id: number;
  name: string;
  course: number;
  description?: string;
  kafedra_id: number;
  semestr_id: number;
  edu_form_id: number;
  edu_type_id: number;
  parent_id: number | null;
  type: number;
  status: number;
  credit: number | null;
  edu_semestr_exams_types: string | null;
  edu_semestr_subject_category_times: string | null;
  parent?: ISubject;
  semestr?: ISemestr;
  kafedra?: IKafedra;
  eduType?: IEduType;
  eduForm?: IEduForm;
  subjectVedomst?: Array<{
    created_at: number;
    created_by: number;
    edu_plan_id: number;
    edu_semestr_id: number;
    edu_semestr_subject_id: number;
    id: number;
    order: number;
    status: number;
    type: number;
    updated_at: number;
    updated_by: number;
  }>;
  subjectType?: ISubjectType;
}

export interface ISubjectType extends IBasic {
  id: number;
  name: string;
  status: number;
}


export interface ISubjectCategory extends IBasic {
  id: number;
  name: string;
  status: number;
}

export interface IExamType extends IBasic {
  id: number;
  name: string;
  status: number;
}

export interface ISubjectTopic extends IBasic {
  id: number;
  name: string;
  description: string;
  hours: number;
  teacher_access_id: number;
  subject_id: number;
  lang_id: number;
  subject_category_id: number;
  teacherAccess: any;
  subject: any;
  subjectCategory: any;
  parent_id?: number | undefined,
  lang: any;
  status: number;
  order: number;
  allotted_time: number | string ,
  attempts_count: number,
  duration_reading_time: number | string,
  test_count: number,
  min_percentage: number
}

export interface ISubjectContent extends IBasic {
  id: number;
  text: string | null;
  description: string | null;
  file: string | null;
  subject_topic_id: number;
  file_extension: string;
  lang_id: number;
  type: number;
  status: number;
  order: number;
  types?: ISubjectContentTypes;
}

export interface ISubjectContentTypes {
  type: ContentType;
  id: number;
  size: number;
  extension: string;
}

export interface IEduSemestrSubjectCategoryTimes {
  id: number;
  hours: number;
  status: number;
  subject_category_id: number;
  subject_id: number;
  edu_semestr_subject_id: number
  edu_semestr_id: number
}

export interface IEduSemestrExamsTypes {
  id: number;
  max_ball: number;
  status: number;
  exams_type_id: number
  subject_id: number;
  edu_semestr_subject_id: number
  edu_semestr_id: number
}
