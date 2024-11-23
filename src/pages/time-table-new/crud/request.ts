import instance from "config/_axios";

export const submitTimeTable = async ( id: number | string | undefined, data: any, type: number | undefined) => {  
  
    const formdata = new FormData();
    if(data?.two_groups){
      formdata.append('two_group', '1');
      formdata.append("teacher_access_id", `${JSON.stringify([data?.teacher_access_id, data?.second_teacher_access_id])}`)
      formdata.append("room_id", `${JSON.stringify([data?.room_id, data?.second_room_id])}`)
      if(data?.groups) formdata.append('groups', `${JSON.stringify({id: data?.groups?.length ? data?.groups : [data?.groups]})}`)
      if(data?.week_id) formdata.append('week_id', data?.week_id)
      if(data?.para_id) formdata.append('para_id', data?.para_id)
      if(data?.start_date) formdata.append('start_date', data?.start_date)
      if(data?.week) formdata.append('week', data?.week)
      if(data?.subject_category_id) formdata.append('subject_category_id', data?.subject_category_id)
      if(type === 0 || type === 1 || type === 2) formdata.append('type', String(type))
      if(data?.hour) formdata.append('hour', data?.hour)
      if(data?.edu_semestr_subject_id) formdata.append('edu_semestr_subject_id', data?.edu_semestr_subject_id)
    } else {
      formdata.append('two_group', '0');
      formdata.append("teacher_access_id", data?.teacher_access_id)
      formdata.append("room_id", data?.room_id)
      if(data?.groups) formdata.append('groups', `${JSON.stringify({id: data?.groups?.length ? data?.groups : [data?.groups]})}`)
      if(data?.week_id) formdata.append('week_id', data?.week_id)
      if(data?.para_id) formdata.append('para_id', data?.para_id)
      if(data?.start_date) formdata.append('start_date', data?.start_date)
      if(data?.week) formdata.append('week', data?.week)
      if(data?.subject_category_id) formdata.append('subject_category_id', data?.subject_category_id)
      if(type === 0 || type === 1 || type === 2) formdata.append('type', String(type))
      if(data?.hour) formdata.append('hour', data?.hour)
      if(data?.edu_semestr_subject_id) formdata.append('edu_semestr_subject_id', data?.edu_semestr_subject_id)

    }
    
    const url = id != "0" ? `/timetables/${id}` : "/timetables"
    const response = await instance({ url, method: id != "0" ? "PUT" : "POST", data: formdata });

    return response.data;
};
  
export const addGroupToTimeTable = async ( ids: number | string | undefined, group_id: number | string | undefined) => {
  const formdata = new FormData();

  formdata.append("ids", String(ids));
  formdata.append("group_id", String(group_id));

  const response = await instance({ url: "timetables/add-group", method: "POST", data: formdata });

  return response.data;
};


export const changeTimeTableByDay = async ( time_table_id: number | string | undefined, data: any, dates: {[data_id: number]: {para_id: number, date: string}}) => {
  const formdata = new FormData();

  for (const key in data) {
    if(data[key] !== undefined && data[key] !== null){
      formdata.append(key, data[key])
    }
  }

  formdata.append("dates", JSON.stringify(dates));

  const response = await instance({ url: `timetables/${time_table_id}`, method: "PUT", data: formdata });

  return response.data;
};

export const changeTimeTableDate = async ( time_table_id: number | string | undefined, data: any) => {
  const formdata = new FormData();

  for (const key in data) {
    if(data[key] !== undefined && data[key] !== null){
      formdata.append(key, data[key])
    }
  }

  const response = await instance({ url: `timetables/${time_table_id}`, method: "PUT", data: formdata });

  return response.data;
};

export const addTimeTableDay = async ( time_table_id: number | string | undefined, data: any) => {
  
  const formdata = new FormData();

  if(data['hour']) formdata.append("hour", data['hour']);
  if(data['type']) formdata.append("type", data['type']);

  const response = await instance({ url: `timetables/add-day/${time_table_id}`, method: "PUT", data: formdata });

  return response.data;
};

export async function timetableStudentTransfer(ids: string | undefined | number, student_ids: string[] | number[]) {
  const formdata = new FormData();

  if(ids) formdata.append('ids_id', String(ids))
  if(student_ids) formdata.append('student_ids', `${JSON.stringify(student_ids)}`)

  const response = await instance({ url: "timetables/student-type", method: "POST", data: formdata });
  return response.data;
}