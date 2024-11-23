/** @format */

import { UploadFile } from "antd";
import instance from "config/_axios";
import dayjs from "dayjs";

export const requesrData = async (
  id: number | string | undefined,
  data: any,
  fileListIlova: UploadFile[]
) => {
  
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if(key == "date"){
        if (dayjs(data[key][0])) formdata.append("start", String(dayjs(data[key][0]).format('DD-MM-YYYY HH:mm')));
        if (dayjs(data[key][1])) formdata.append("end", String(dayjs(data[key][1]).format('DD-MM-YYYY HH:mm')));
      } else if (key === "qr_type" || key === "coming_type") {
        formdata.append(key, data[key] ? "1" : "0");
      } else if (key === "file") {
        if(data[key]) formdata.append("file", data[key]?.file?.originFileObj);
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  formdata.append("status", '0');

  fileListIlova?.forEach((element: any) => {
    if(element?.originFileObj) formdata.append("upload[]", element?.originFileObj);
  });

  const _url = id ? `/documents/${id}` : "/documents";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  
  return response.data;
};
