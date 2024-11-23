import instance from "config/_axios";

export async function submitTest(id: string | undefined, data: any) {
    
    const formdata = new FormData();
    formdata.append("text", data["text"])
    formdata.append("level", data["level"])
    formdata.append("topic_id", data["topic_id"])
    formdata.append("type", "2")
    formdata.append("subject_id", data["subject_id"])
    formdata.append("language_id", data["language_id"])

    if(data["file"]) formdata.append("file", data["file"])

    const url = id != "0" ? `/tests/${id}` : `/tests`
    const response = await instance({ url, method: id != "0" ? "PUT" : "POST", data: formdata });
    return response.data;
}

export async function updateTestStatus(id: number, status: number) {
    
    const formdata = new FormData();
    formdata.append("status", String(status))

    const response = await instance({ url: `/tests/${id}`, method: "PUT", data: formdata });
    return response.data;
}
  
export async function submitTestOption(id: number | undefined, data: any) {
    
    const formdata = new FormData();
    formdata.append("text", data["text"])
    formdata.append("is_correct", data["is_correct"] ? '1' : '0')
    if(!id) formdata.append("test_id", data["test_id"])

    if(data["file"]) formdata.append("file", data["file"])

    const url = id ? `/options/${id}` : `/options`
    const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });
    return response.data;
}
  