import instance from "config/_axios";
import i18next from "i18next";

export async function submitData(id: number | undefined, data: any) {
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

    const url = id ? `/groups/${id}` : `/groups`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata });
    return response.data;
}
  
export async function studentTransfer(id: string | undefined, type: number, data: string[]) {
    const formdata = new FormData();

    formdata.append('type', String(type))
    if(id) formdata.append('two_group', `${JSON.stringify({[id]: data})}`)

    const response = await instance({ url: "students/type", method: "POST", data: formdata });
    return response.data;
}
