import { IBasic } from "./base";
import { IDirection, IFaculty } from "./edu_structure";
import { IEduPlan, IEduSemestr, IGroup, IPara } from "./education";
import { IBuilding, IRoom } from "./infrastructure";
import { IStudentMark } from "./mark";
import { IStudent } from "./student";
import { IExamType, ISubject } from "./subject";
import IUsers, { IUserField } from "./user";

export interface IExam extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface IExamControls extends IBasic {
  id: number;
  name: string;
  subject_id: number;
  group_id: number;
  start_time: number;
  finish_time: number;
  type: string | number;
  duration: number;
  max_ball: number;
  question: string;
  upload_file: any;
}

export interface IExamQuestions extends IBasic {
  id: number;
  subject_id: number;
  language_id: number;
  language: any;
  subject: any;
  text: string;
  file: any;
  type: number;
  status: number;
  is_checked: number;
  exam_type_id?: number;
  examType?: any;
}

export interface IFinalExamGroup extends IBasic {
  id: number;
  direction_id: number;
  edu_plan_id: number;
  faculty_id: number;
  language_id: number;
  order: number;
  status: number;
  time_table: any;
  unical_name: string;
}

export interface IFinalExamQuestion extends IBasic {
  exam_student_id: number;
  id: number;
  student_ball: number;
  student_id: number;
  type: number;
  description: string;
  question: {
    answer_file: string;
    answer_text: string;
    file: string;
    text: string;
    student_option: number;
    option?: Array<{
      created_at: number;
      created_by: number;
      file: string;
      id: number;
      is_correct: number;
      order: number;
      status: number;
      test_id: number;
      text: string;
      updated_at: number;
      updated_by: number;
    }>;
  };
}

export interface IExamStudent extends IBasic {
  id: number;
  course_id: number;
  direction_id: number;
  edu_plan_id: number;
  edu_semestr_id: number;
  exam_id: number;
  exam_teacher_user_id: number;
  faculty_id: number;
  group_id: number;
  language_id: number;
  max_ball: number;
  semestr_id: number;
  status: number;
  student_ball: number;
  student_id: number;
  subject_id: number;
  type: number;
  student?: IStudent;
  exam?: IFinalExam;
  examStudentQuestion?: IFinalExamQuestion[];
}


export interface IFinalExam extends IBasic {
  id: number;
  course_id: number;
  description: string;
  direction_id: number;
  duration: number;
  edu_plan_id: number;
  edu_semestr_id: number;
  edu_semestr_subject_id: number;
  subject_id: number;
  edu_year_id: number;
  exam_type_id: number;
  faculty_id: number;
  file: string;
  name: string;
  question: string;
  start_time: number;
  finish_time: number;
  max_ball: number;
  question_count: number;
  semestr_id: number;
  status: number;
  type: number;
  subject?: ISubject;
  faculty?: IFaculty;
  direction?: IDirection;
  eduPlan?: IEduPlan;
  eduYear? : any,
  timeTableGroup?: IFinalExamGroup[];
  examStudentsCheckCount?: number;
  examStudentsCount?: number;
  examStudentsCheck?: IExamStudent[];
  examStudents?: IExamStudent[];
  eduSemestrSubject?: any;
  eduSemestr?: IEduSemestr;
  user?: any;
  para?: IPara;
  building?: IBuilding;
  room?: IRoom;
  group?: IGroup;
  para_id: number;
  group_id: number;
  date: string;
  user_id: number;
  building_id: number;
  room_id: number;
  vedomst: number;
  studentMark?: IStudentMark[];
  eduSemestrExamsType?: any;
  examsType?: IExamType;
  groups?: IFinalExam[];
  finalExamConfirm?: any[];
  studentMarkVedomst?: IStudentMarkVedomst[];
  exam_type: number;
  exam_form_type: number;
  lang_id: number
}

export interface IStudentMarkVedomst {
  id: number;
  attend: number;
  ball: number;
  created_at: number;
  created_by: number;
  edu_semestr_exams_type_id: number;
  edu_semestr_subject_id: number;
  group_id: number;
  order: number;
  passed: number;
  status: number;
  studentMark?: IStudentMark;
}
