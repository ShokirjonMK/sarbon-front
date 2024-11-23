import instance from "config/_axios";
import dayjs from "dayjs";

export const submitExamControl = async ( id: number | string | undefined, values: any ) => {

    const formdata = new FormData();

    for (const key in values) {
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

    const url = id ? `/exam-controls/${id}` : "/exam-controls"
    const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });

    return response.data;
};

export const examCheckStudentMark = async (id: number | string | undefined, ball:number | undefined) => {

    const formdata = new FormData();
    formdata.append("ball", String(ball))
    
    const response = await instance({ url: `/exam-control-students/rating/${id}`, method: id ? "PUT" : "POST", data: formdata });

    return response.data;
}
  