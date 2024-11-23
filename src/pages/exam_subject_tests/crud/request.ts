import { message } from "antd";
import instance from "config/_axios";

export async function submitExamTest(id: string | undefined, data: any) {

    const formdata = new FormData();
    formdata.append("text", data["text"])
    formdata.append("subject_id", data["subject_id"]);
    formdata.append("language_id", data['language_id'])
    formdata.append("type", '2');
    if(data["exam_type_id"]) formdata.append("exam_type_id", data["exam_type_id"]);

    if(data["file"]) formdata.append("file", data["file"])

    const url = id ? `/tests/${id}` : `/tests`
    const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });
    return response.data;
}

export async function updateExamTestStatus(id: number, is_check: number) {

    const formdata = new FormData();
    formdata.append("is_checked", String(is_check))

    const response = await instance({ url: `/tests/is-check/${id}`, method: "PUT", data: formdata });
    return response.data;
}

export async function submitExamTestOption(id: number | undefined, data: any) {

    const formdata = new FormData();
    formdata.append("text", data["text"])
    formdata.append("is_correct", data["is_correct"] ? '1' : '0')
    if(!id) formdata.append("test_id", data["question_id"])

    if(data["file"]) formdata.append("file", data["file"])

    const url = id ? `/options/${id}` : `/options`
    const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });
    return response.data;
}

export async function importExamTestToExcel(subject_id: string | number | undefined, file: any, exam_type_id: string | number | undefined) {
    if(!(subject_id && file)) return message.error("File yuklanmagan");

    const formdata = new FormData();

    formdata.append("subject_id", subject_id.toString());
    formdata.append("exam_type_id", String(exam_type_id));
    formdata.append("upload", file);
    formdata.append("type", '2');

    const response = await instance({ url: `/tests/excel-import`, method: "POST", data: formdata });
    return response.data;
}
