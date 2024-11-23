import instance from "config/_axios";
import i18next from "i18next";

export async function submitData(id: number | undefined, data: any, teacherAccess: any) {
    const formdata = new FormData();
        for (const key in data) {
            if(data[key] != undefined || data[key] != null){
                if(key === "status"){
                    formdata.append('status', data?.status ? "1" : "0")
                }else if(key === "name"){
                    formdata.append(`name[${i18next?.language}]`, data[key])
                }else if(key === "description"){
                    formdata.append(`description[${i18next?.language}]`, data[key])
                }else {
                    formdata.append(key, data[key])
                }
            }
        }

        if(teacherAccess) {
            formdata.append("teacher_access", JSON.stringify(teacherAccess))
        }

    const url = id ? `/kafedras/${id}` : `/kafedras`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata });
    return response.data;
}
