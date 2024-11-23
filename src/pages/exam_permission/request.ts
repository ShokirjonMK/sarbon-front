import instance from "config/_axios";

export async function submitMarks(exam_type_id: number | undefined, marks: {[std_id: number]: number} | undefined, group_id: number | undefined) {
    
    const formdata = new FormData();
    if(exam_type_id) formdata.append("edu_semestr_exams_type_id", String(exam_type_id))
    if(group_id) formdata.append("student_ids", JSON.stringify({[group_id]: marks}))
    
    const response = await instance({ url: `/student-marks`, method: "POST", data: formdata });
    return response.data;
}