/** @format */

import instance from "config/_axios";

export const updateSubjectSemestr = async (
  id: number | string | undefined,
  data: any,
) => {
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if (key === "status") {
        formdata.append("status", data?.status ? "1" : "0");
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  const _url = id ? `/subject-semestrs/${id}` : "/subject-semestrs";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  return response.data;
};