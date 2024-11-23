/** @format */

import instance from "config/_axios";

export const requesrData = async (
  id: number | string | undefined,
  data: any
) => {
  const formdata = new FormData();

  if (data?.body) formdata.append("body", data?.body);
  if (data?.description)
    formdata.append("description", String(data?.description));

  const response = await instance({
    url: id ? `/document-decrees/${id}` : "/document-decrees",
    method: id ? "PUT" : "POST",
    data: formdata,
  });

  return response.data;
};

export const sendNoticeData = async (
  id: number | string | undefined,
) => {
  const formdata = new FormData();
  formdata.append("status", "1");

  const response = await instance({
    url: `/document-decrees/${id}`,
    method: "PUT",
    data: formdata,
  });

  return response.data;
};