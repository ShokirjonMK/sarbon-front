import instance from "config/_axios";
import dayjs from "dayjs";

export const submitFinalExamControl = async ( id: number | string | undefined, values: any ) => {

    const formdata = new FormData();

    for (const key in values) {
        if(key !== "faculty_id") {
            if(values[key]) {
                if(key == "date"){
                    if (dayjs(values[key][0])) formdata.append("start", String(dayjs(values[key][0]).format('DD-MM-YYYY HH:mm')));
                    if (dayjs(values[key][1])) formdata.append("finish", String(dayjs(values[key][1]).format('DD-MM-YYYY HH:mm')));
                } else if(key == "upload_file") {
                    if(values[key]) formdata.append(key, values[key]);
                } else {
                    if(values[key]) formdata.append(key, values[key]);
                }
            }
        }
    }

    formdata.append("exam_type_id", '3')

    const url = id ? `/exams/${id}` : "/exams"
    const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });

    return response.data;
};

export const finalExamCheckStudentMark = async (id: number | string | undefined, ball:number | undefined) => {

    const formdata = new FormData();
    formdata.append("ball", String(ball))
    
    const response = await instance({ url: `/exam-control-students/rating/${id}`, method: id ? "PUT" : "POST", data: formdata });

    return response.data;
}

export const finalExamStatusCheck = async (id: number | string | undefined, status:number | undefined, order: 1 | 2 | 3 | 4 | 5) => {

    const formdata = new FormData();
    formdata.append("status", String(status))
    
    const url = order === 1 ? `/exams/${id}`
                : order === 2 ? `/exams/exam-check/${id}` 
                : order === 3 ? `/exams/exam-finish/${id}` 
                : order === 4 ? `/exams/allotment/${id}`
                : order === 5 ? `/exams/exam-notify/${id}`
                : ""

    const response = await instance({ url, method: "PUT", data: formdata });

    return response.data;
}


export const finalExamTeacherAllotment = async (id: number | string | undefined, allotments: any) => {

    const formdata = new FormData();
    formdata.append("teachers", allotments)
    
    const response = await instance({ url: `/exams/exam-teacher-attach/${id}`, method: id ? "PUT" : "POST", data: formdata });

    return response.data;
}