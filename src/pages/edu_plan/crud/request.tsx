import instance from "config/_axios";
import dayjs from "dayjs";
import i18next from "i18next";

export async function submitEduPlan(id: number | undefined | string, data: any) {

    const formdata = new FormData();
    for (const key in data) {
        if(key === "status"){
            formdata.append(key, data[key] ? "1" : "0")
        } else if(key === "type"){
            formdata.append(key, data[key] ? "1" : "2")
        }else if(key === "name"){
            formdata.append(`name[${i18next?.language}]`, data[key])
        }else if(key === "description"){
            formdata.append(`description[${i18next?.language}]`, data[key])
        } else if(key === "first_start" || key === "first_end" || key === "second_start" || key === "second_end"){
            formdata.append(key, dayjs(data[key]).format("YYYY-MM-DD"))
        }else {
            formdata.append(key, data[key])
        }
    }
    
    const url = id != "0" ? `/edu-plans/${id}` : `/edu-plans`

    const response = await instance({ url, method: id != "0" ? "PUT" : "POST", data: formdata });
    return response.data;
}