import { message } from "antd";
import instance from "config/_axios";
import dayjs from "dayjs";

export async function submitData(id: number | undefined, data: any, subject_id:number) {
    const formdata = new FormData();
        for (const key in data) {
            const totalHour = Number(dayjs(data[key]).format("HH"))*3600+Number(dayjs(data[key]).format("mm"))*60+Number(dayjs(data[key]).format("ss"))
            if(data[key] != undefined || data[key] != null){
                if(key === "status"){
                    formdata.append('status', data?.status ? "1" : "0")
                } else if(key === "allotted_time" || key === "duration_reading_time") {
                    formdata.append(key,  `${totalHour}`);
                } else {
                    formdata.append(key, data[key])
                }
            }
        }

        if(subject_id){
            formdata.append("subject_id", subject_id.toString())
        }


    const url = id ? `/subject-topics/${id}` : `/subject-topics`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata });
    return response.data;
}


export async function submitTopicOrderData(id: number | undefined, data: any, subject_id:number) {
    const formdata = new FormData();
        for (const key in data) {
            if(data[key] != undefined || data[key] != null){
                if(key === "status"){
                    formdata.append('status', data?.status ? "1" : "0")
                } else {
                    formdata.append(key, data[key])
                }
            }
        }


        if(subject_id){
            formdata.append("subject_id", subject_id.toString())
        }


    const url = id ? `/subject-topic/orders/${id}` : `/subject-topics`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata });
    return response.data;
}


export async function importTopicToExcel(subject_id: string | number, file: any) {
    if(!(subject_id && file)) return message.error("File yuklanmagan");

    const formdata = new FormData();

    formdata.append("subject_id", subject_id.toString());
    formdata.append("file", file);

    const response = await instance({ url: `/subject-topics/export`, method: "POST", data: formdata });
    return response.data;
}
