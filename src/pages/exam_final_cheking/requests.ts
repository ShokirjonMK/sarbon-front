import instance from "config/_axios";

export const submitBall = async (id: number | string | undefined, ball: number, description: string) => {

    const formdata = new FormData();
    if(!!ball || ball === 0) formdata.append("student_ball", String(ball))
    if(!!description) formdata.append("description", description)
    
    const response = await instance({ url: `/exam-student-questions/update-ball/${id}`, method: "PUT", data: formdata });

    return response.data;
}

export const submitRating = async (id: number | string | undefined, status: 2 | 3) => {

    const formdata = new FormData();
    formdata.append("status", String(status))
    
    const response = await instance({ url: `/exam-students/rating/${id}`, method: "PUT", data: formdata });
    return response.data;
}