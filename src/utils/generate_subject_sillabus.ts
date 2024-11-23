import { IEduSemestrExamsTypes, IEduSemestrSubjectCategoryTimes } from "models/subject";

type returnType = {
  edu_semestr_exams_types?: string,
  edu_semestr_subject_category_times?: string
}

/**
 * 
 * @param edu_semestr_exams_types edu_semestr_subject.eduSemestrExamsTypes (array)
 * @param edu_semestr_subject_category_times edu_semestr_subject.eduSemestrSubjectCategoryTimes (array)
 * @returns
  * \{
  * edu_semestr_exams_types?: string,
  * edu_semestr_subject_category_times?: string
  * \}  (object)
 */
export const generateSubjectSillabus = (edu_semestr_exams_types: IEduSemestrExamsTypes[], edu_semestr_subject_category_times: IEduSemestrSubjectCategoryTimes[]): returnType => {
  let _edu_semestr_exams_types: {[key: number]: number } = {}
  let _edu_semestr_subject_category_times: {[key: number]: number } = {};

  if(edu_semestr_exams_types){
    edu_semestr_exams_types?.forEach(e => {
      _edu_semestr_exams_types = {..._edu_semestr_exams_types, [e.exams_type_id]: e.max_ball}
    })
  }

  if(edu_semestr_subject_category_times){
    edu_semestr_subject_category_times?.forEach(e => {
      _edu_semestr_subject_category_times = {..._edu_semestr_subject_category_times, [e.subject_category_id]: e.hours}
    })
  }

  return {edu_semestr_exams_types: JSON.stringify(_edu_semestr_exams_types), edu_semestr_subject_category_times: JSON.stringify(_edu_semestr_subject_category_times)};
};