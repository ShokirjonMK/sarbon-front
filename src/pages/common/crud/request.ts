/** @format */

import instance from "config/_axios";
import i18next from "i18next";
import { TypeFormUIData } from "../types";
import dayjs from "dayjs";

export const requesrData = async (
  url: string,
  id: number | undefined,
  data: any,
  formUIData: TypeFormUIData[]
) => {
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != (undefined || null)) {
      if (key === "status") {
        formdata.append("status", data?.status ? "1" : "0");
      } else if (key === "name") {
        formdata.append(`name[${i18next?.language}]`, data[key]);
      } else if (key === "description") {
        formdata.append(`description[${i18next?.language}]`, data[key]);
      } else if (
        formUIData.find(
          (e) =>
            e.name === key &&
            (e.type === "date" || e.type === "time") &&
            !e?.onlyTable
        )
      ) {
        formdata.append(key, String(dayjs(data[key])));
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  const _url = id ? `/${url}/${id}` : url;
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  return response.data;
};
