import instance from "config/_axios";
import i18next from "i18next";

export async function submitData(id: number | undefined, data: any, table_id: number | string | undefined, user_access_type_id: number | string | undefined, teacherAccess: any , leader?: number) {
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if (key === "status") {
        formdata.append("status", data?.status ? "1" : "0");
      } else if (key === "name") {
        formdata.append(`name[${i18next?.language}]`, data[key]);
      } else if (key === "description") {
        formdata.append(`description[${i18next?.language}]`, data[key]);
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  if(leader || leader === 0){
    formdata.append("is_leader", JSON.stringify(leader))
  }

  if(teacherAccess && (user_access_type_id === 2)){
    formdata.append("teacher_access", JSON.stringify(teacherAccess))
  }

  if(table_id) {
    formdata.append("table_id", table_id.toString())
    if(user_access_type_id) formdata.append("user_access_type_id", user_access_type_id?.toString())

    const url = id ? `/user-accesses/${id}` : `/user-accesses`;
    const response = await instance({
      url,
      method: id ? "PUT" : "POST",
      data: formdata,
    });
    return response.data;
  }
}
