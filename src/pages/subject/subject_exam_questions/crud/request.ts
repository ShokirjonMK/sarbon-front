/** @format */

import { message } from "antd";
import instance from "config/_axios";

export const requesrData = async (
  id: number | string | undefined,
  subject_id: number | undefined,
  data: any,
  file: any
) => {
  if (subject_id) {
    const formdata = new FormData();
    for (const key in data) {
      if (data[key] != undefined || data[key] != null) {
          formdata.append(key, data[key]);
      }
    }

    if(file?.length) formdata.append("upload", file[0]?.originFileObj);
    formdata.append("subject_id", subject_id.toString());
    formdata.append("type", "1");

    const _url = id ? `/tests/${id}` : "/tests";
    const response = await instance({
      url: _url,
      method: id ? "PUT" : "POST",
      data: formdata,
    });
    return response.data;
  } else {
    message.error("Subject_id topilmadi!!!");
  }
};
