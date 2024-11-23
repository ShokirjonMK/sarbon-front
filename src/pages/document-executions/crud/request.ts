/** @format */

import instance from "config/_axios";
import dayjs from "dayjs";

export const requesrData = async (
  id: number | string | undefined,
  data: any
) => {
  
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if(key == "date"){
        if (dayjs(data[key][0])) formdata.append("start", String(dayjs(data[key][0]).format('DD-MM-YYYY HH:mm')));
        if (dayjs(data[key][1])) formdata.append("end", String(dayjs(data[key][1]).format('DD-MM-YYYY HH:mm')));
      } else if (key === "qr_type" || key === "coming_type") {
        formdata.append(key, data[key] ? "1" : "0");
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  formdata.append("status", '0');

  const _url = id ? `/document-executions/${id}` : "/document-executions";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  
  return response.data;
};
