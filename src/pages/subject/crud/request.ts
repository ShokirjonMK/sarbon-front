/** @format */

import instance from "config/_axios";
import { TypeSillabusData } from "../components/sillabus";


export const updateData = async (
  id: number | string | undefined,
  data: any,
) => {
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if (key === "status") {
        formdata.append("status", data?.status ? "1" : "0");
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  const _url = id ? `/subjects/${id}` : "/subjects";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  return response.data;
};

export const requesrData = async (
  id: number | string | undefined,
  data: any,
  {edu_semestr_exams_types, edu_semestr_subject_category_times}: TypeSillabusData
) => {
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if (key === "status") {
        formdata.append("status", data?.status ? "1" : "0");
      } else if (key === "eduForms") {
        formdata.append("eduForms", JSON.stringify(data?.eduForms));
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  if(edu_semestr_exams_types)
    formdata.append("edu_semestr_exams_types", edu_semestr_exams_types);
  if(edu_semestr_subject_category_times)
    formdata.append("edu_semestr_subject_category_times", edu_semestr_subject_category_times);

  const _url = id ? `/subjects/${id}` : "/subjects";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  return response.data;
};
