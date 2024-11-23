/** @format */

import instance from "config/_axios";
import { message } from "antd";

export const requesrData = async (
  id: number | string | undefined,
  data: any,
  order?: number,
  topic_id?: string | undefined,
  type?: number,
  status?: boolean
) => {
  const formdata = new FormData();
  if (id || (topic_id && !id)) {
    // if(data["text"] || data["file_file"] || data["file_image"] || data["file_video"] || data["file_audio"]){
      for (const key in data) {
        if (data[key] != undefined || data[key] != null) {
          if (key === "status") {
            formdata.append("status", data?.status ? "1" : "0");
          } else if (key?.includes("file")) {
            formdata.append(key, data[key]?.file?.originFileObj);
          } else {
            formdata.append(key, data[key]);
          }
        }
      }

      if (status) formdata.append("status", status ? "1" : "0");
      if (topic_id) formdata.append("subject_topic_id", topic_id);
      if (type) formdata.append("type", type.toString());
      if (order) formdata.append("order", order.toString());

      const _url = id ? `/subject-contents/${id}` : "/subject-contents";
      const response = await instance({
        url: _url,
        method: id ? "PUT" : "POST",
        data: formdata,
      });
      return response.data;
    // } else {
    //   message.warning("Ma'lumotlarni to'ldirish shart")
    // }
  } else {
    message.warning("Not found subject_topic_id");
  }
};
