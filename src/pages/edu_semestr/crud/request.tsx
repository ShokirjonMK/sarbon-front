import instance from "config/_axios";
import dayjs from "dayjs";
import i18next from "i18next";

export async function changeEduSemestr(id: number | undefined | string, data: any) {

    const formdata = new FormData();

    for (const key in data) {
        if(key == "status" || key == "is_checked"){
            formdata.append(key, data[key] ? "1" : "0")
        }else if(key === "name" || key === "description"){
            formdata.append(`${key}[${i18next?.language}]`, data[key])
        }else if(key === "start_date" || key === "end_date"){
            formdata.append(key, dayjs(data[key]).format("YYYY-MM-DD"))
        }else {
            formdata.append(key, data[key])
        }
    }
    
    const response = await instance({ url: `/edu-semestrs/${id}`, method: "PUT", data: formdata });
    return response.data;
}

