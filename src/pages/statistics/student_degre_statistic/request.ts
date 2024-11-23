import { message } from "antd";
import instance from "config/_axios";

export async function submitStudentVedomst(data: any) {
    if(data){
        const formdata = new FormData();

        formdata.append("studentMarks", JSON.stringify(data[Object.keys(data)[0]]))

        const response = await instance({ url: `/student-vedomsts/${Object.keys(data)[0]}`, method: "PUT", data: formdata });
        return response.data;
    } else {
        message.warning("Ballarni kiriting");
        return
    }
}