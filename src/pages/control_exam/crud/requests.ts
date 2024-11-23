import { message } from "antd";
import instance from "config/_axios";
import dayjs from "dayjs";

export const submitFinalExamControl = async (
  id: number | string | undefined,
  values: any
) => {
  const formdata = new FormData();
  
  for (const key in values) {
    if (key !== "faculty_id" || "edu_plan_id" || "edu_semestr_id") {
      if (values[key]) {
        if (key == "date") {
          if (dayjs(values[key])) {
            formdata.append("start_time", String(values[key]?.start_time))
            formdata.append("finish_time", String(values[key]?.finish_time))
          }
        } else if (key == "group_id") {
          formdata.append("groups", JSON.stringify(values[key]));
        } else {
          if (values[key]) formdata.append(key, values[key]);
        }
      }
    }
  }

  formdata.append("exams_type_id", "1");

  const url = id ? `/final-exams/${id}` : "/final-exams";
  const response = await instance({
    url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });

  return response.data;
};

export const finalExamCheckStudentMark = async (
  id: number | string | undefined,
  ball: number | undefined
) => {

  if(!ball) {
    const formdata = new FormData();
    formdata.append("ball", String(ball));

    const response = await instance({
      url: `/exam-control-students/rating/${id}`,
      method: id ? "PUT" : "POST",
      data: formdata,
    });

    return response.data;
  } else {
    message.warning("Baho qo'yilmagan!!!")
    return
  }
};

export const finalExamStatusCheck = async (
  id: number | string | undefined,
  status: number,
  type: number
) => {
  const formdata = new FormData();
  formdata.append("status", String(status + type - 1));

  const url =
    type === 2
      ? `/final-exams/confirm/${id}`
    : type === 3
      ? `/final-exams/confirm-two/${id}`
    : type === 4
      ? `/final-exams/in-charge/${id}`
      : type === 5
      ? `/final-exams/confirm-mudir/${id}`
      : type === 6
      ? `/final-exams/confirm-dean/${id}`
      : type === 7
      ? `/final-exams/last-confirm/${id}`
      : "";

  const response = await instance({ url, method: "PUT", data: formdata });

  return response.data;
};

export const finalExamTeacherAllotment = async (
  id: number | string | undefined,
  allotments: any
) => {
  const formdata = new FormData();
  formdata.append("teachers", allotments);

  const response = await instance({
    url: `/final-exams/exam-teacher-attach/${id}`,
    method: id ? "PUT" : "POST",
    data: formdata,
  });

  return response.data;
};

export async function submitMarks(
  exam_id: string | undefined,
  marks: { [std_id: number]: { a?: number; b?: number } } | undefined
) {
  let _ball: any = {};

  Object.entries(marks ?? {})?.map(([key, value]) => {
    // if(value?.a || (!value?.a && value?.b == undefined))
        _ball[key] = [value?.a ?? 0, value?.b ?? 0];
  });

  const formdata = new FormData();
  if (marks) formdata.append("students", JSON.stringify(_ball));

  const response = await instance({
    url: `/student-marks/final-exam/${exam_id}`,
    method: "PUT",
    data: formdata,
  });
  return response.data;
}

export async function changeStudentExamPermission(
  exam_id: string | undefined,
  marks: { [std_id: number]: { a?: number; b?: number } } | undefined
) {
  let _ball: any = {};

  Object.entries(marks ?? {})?.map(([key, value]) => {
    // if(value?.a || (!value?.a && value?.b == undefined))
        _ball[key] = [value?.a ?? 0, value?.b ?? 0];
  });

  const formdata = new FormData();
  if (marks) formdata.append("students", JSON.stringify(_ball));

  const response = await instance({
    url: `/student-marks/final-exam/${exam_id}`,
    method: "PUT",
    data: formdata,
  });
  return response.data;
}

export async function givingChance(id: string | number) {

  const response = await instance({
    url: `/final-exam-tests/add/${id}`,
    method: "PUT",
  });
  return response.data;
}

export async function changingStatus(id: string | number, status: number | string) {

  const formdata = new FormData();
  formdata.append("status", String(status));

  const response = await instance({
    url: `/final-exam-tests/${id}`,
    method: "PUT",
    data: formdata
  });
  return response.data; 
}

export async function changingFinalExamTestStart(id: string | number, values: {[key: string]: any}) {

  const formdata = new FormData();
  for (const key in values) {
    if (values[key]) {
      if (key == "date") {
        if (dayjs(values[key]?.start_time)) {
          formdata.append("start_time", String(values[key]?.start_time))
          formdata.append("finish_time", String(values[key]?.finish_time))
        }
      } else {
        formdata.append(key, values[key]);
      }
    }
  }

  const response = await instance({
    url: `/final-exam-test-starts/${id}`,
    method: "PUT",
    data: formdata
  });
  return response.data; 
}


export async function changingBall(id: number | undefined, ball: number | undefined) {

  const formdata = new FormData();
  formdata.append("ball", String(ball));

  const response = await instance({
    url: `/final-exam-test-starts/add-ball/${id}`,
    method: "PUT",
    data: formdata
  });
  return response.data; 
}