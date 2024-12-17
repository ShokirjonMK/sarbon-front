import instance from "config/_axios";
import dayjs from "dayjs";

export async function submitData(id: string | undefined, data: any) {
    const formdata = new FormData();
    for (const key in data) {
        if(data[key] != undefined && data[key] != null && data[key] != ''){
            if(key === "role") {   
                formdata.append(key, JSON.stringify(data[key]))
            }else if(key === "birthday" || key === "passport_given_date" || key === "passport_issued_date") {   
                formdata.append(key, dayjs(data[key]).format("YYYY-MM-DD") );
            } else if(key === "passport_seria_and_number") {
                formdata.append("passport_serial", data[key]?.slice(0, 2));
                formdata.append("passport_number", data[key]?.slice(2, 10));
            } else {
                formdata.append(key, data[key])
            }
        }
    }

    const url = id ? `/users/${id}` : `/users`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata, params: {expand: "profile"} });
    return response.data;
}
  
export async function saveTeacherAccess(user_id: string | undefined | number, data: any) {
    const formdata = new FormData();
    formdata.append("teacher_access", JSON.stringify(data))

    const response = await instance({ url: `teacher-accesses/${user_id}`, method: "PUT", data: formdata });
    return response.data;
}
  

export async function saveUserAccess(user_id: string | undefined | number, data: any) {
    const formdata = new FormData();
    formdata.append('user_id', String(user_id))
    for (const key in data) {
        if(data[key] != undefined && data[key] != null && data[key] != ''){
            formdata.append(key, data[key])
        }
    }

    const response = await instance({ url: `user-accesses`, method: "POST", data: formdata });
    return response.data;
}