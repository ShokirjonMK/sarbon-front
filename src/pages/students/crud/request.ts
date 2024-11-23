import instance from "config/_axios";
import dayjs from "dayjs";

export async function submitData(id: string | undefined, data: any) {
    const formdata = new FormData();

    for (const key in data) {
        if(data[key] != undefined || data[key] != null){
            if(key === "birthday" || key === "passport_given_date" || key === "passport_issued_date") {
                formdata.append(key, dayjs(data[key]).format("YYYY-MM-DD") );
            } else if(key === "passport_seria_and_number") {
                formdata.append("passport_serial", data[key]?.slice(0, 2));
                formdata.append("passport_number", data[key]?.slice(3, 10));
            } else {
                formdata.append(key, data[key])
            }
        }
    }

    const url = id ? `/students/${id}` : `/students`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata });
    return response.data;
}


export async function updateStudentGroup(id: string | undefined, data: any) {
    const formdata = new FormData();

    for (const key in data) {
        if(data[key] != undefined || data[key] != null){
            formdata.append(key, data[key])
        }
    }

    const response = await instance({ url: `/student-groups/${id}`, method: "PUT", data: formdata });
    return response.data;
}