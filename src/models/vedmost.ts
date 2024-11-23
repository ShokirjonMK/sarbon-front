import { IBasic } from "./base";

export interface IVedmost extends IBasic {
  id: number;
  vedomst: number;
  group_id: number;
  type: number;
  group?: any;
  edu_semestr_subject_id: number;
  eduSemestrSubject?: any;
  user_id: number,
  user?: any;
  exam_form_type: any,
  examFormType?: any;
  date: any;
  para_id: number;
  para?: any;
  room_id: number;
  room?: any
}
