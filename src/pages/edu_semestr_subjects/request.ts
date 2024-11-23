import instance from "config/_axios";
import { TypeSillabusData } from "pages/subject/components/sillabus";

export async function attachSubject(event: boolean, edu_semestr_id: any, subject_id: any, edu_semestr_subject_id: any) {

    const formdata = new FormData();

    formdata.append("edu_semestr_id", edu_semestr_id)
    formdata.append("subject_id", subject_id)

    const url = event ? `/edu-semestr-subjects` : `/edu-semestr-subjects/${edu_semestr_subject_id}`
    const response = await instance({ url, method: event ? "POST" : "DELETE", data: formdata });
    return response.data;
}

export const submitEduSemestrSubject = async (
    id: number | string | undefined,
    data: any,
    {edu_semestr_exams_types, edu_semestr_subject_category_times}: TypeSillabusData
  ) => {
    const formdata = new FormData();
    for (const key in data) {
      if (data[key] != undefined || data[key] != null) {
        formdata.append(key, data[key]);
      }
    }
  
    if(edu_semestr_exams_types)
      formdata.append("EduSemestrExamType", edu_semestr_exams_types);
    if(edu_semestr_subject_category_times)
      formdata.append("SubjectCategory", edu_semestr_subject_category_times);
  
    const response = await instance({ url: `/edu-semestr-subjects/${id}`, method:"PUT", data: formdata });

    return response.data;
  };
  