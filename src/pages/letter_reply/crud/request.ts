/** @format */

import instance from "config/_axios";
import dayjs from "dayjs";

export const requesrData = async (
  id: number | string | undefined,
  letter_forward_item_id: number | string | undefined,
  data: any,
  file: any
) => {

  const formdata = new FormData();

  if(file?.length && !file[0]?.url) formdata.append("file", file[0]?.originFileObj);
  formdata.append("description", data["description"]);
  formdata.append("letter_forward_item_id", String(letter_forward_item_id));

  const _url = id ? `/letter-replies/${id}` : "/letter-replies";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });

  return response.data;
};

export const requestReply = async (
  id: number,
) => {

  const formdata = new FormData();

  formdata.append("status", "1");

  const response = await instance({
    url: `/letter-replies/${id}`,
    method: "PUT",
    data: formdata,
  });

  return response.data;
};
