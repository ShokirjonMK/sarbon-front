import { message } from "antd";
import instance from "config/_axios";

export async function submitMarks(marks: {[std_id: number]: number} | undefined) {
    if(marks){
        const formdata = new FormData();
        formdata.append("student_ids", JSON.stringify(marks))

        const response = await instance({ url: `/student-marks/student-mark-update`, method: "POST", data: formdata });
        return response.data;
    } else {
        message.warning("Ballarni kiriting");
        return
    }
}