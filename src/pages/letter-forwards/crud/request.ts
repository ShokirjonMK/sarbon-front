/** @format */

import instance from "config/_axios";
import dayjs from "dayjs";

export const requesrData = async (
  id: number | string | undefined,
  data: any,
  letter_id: number | string | undefined
) => {
  
  console.log("forward is", id ? "bor": "yoq");
  
  const formdata = new FormData();
  for (const key in data) {
    if (data[key] != undefined || data[key] != null) {
      if(key == "date"){
        if (dayjs(data[key])) formdata.append("end", String(dayjs(data[key]).format('DD-MM-YYYY HH:mm')));
      } else if (key === "user_ids") {
        formdata.append("users", JSON.stringify({user_id: data[key]}));
      } else {
        formdata.append(key, data[key]);
      }
    }
  }

  formdata.append("status", '0');
  formdata.append("letter_id", String(letter_id));

  const _url = id ? `/letter-forwards/${id}` : "/letter-forwards";
  const response = await instance({
    url: _url,
    method: id ? "PUT" : "POST",
    data: formdata,
  });
  
  return response.data;
};


export const changeLetterForwardStatus = async ({id, isTrue}: {id: number, isTrue: boolean}) => {

  const formdata = new FormData();
  formdata.append("status", isTrue ? '1' : "0");
  
  const response = await instance({
    url: `/letter-forwards/${id}`,
    method: "PUT",
    data: formdata,
  });
  
  return response.data;
}

export const changeLetterReplyIsOk = async ({id, isOk, message}: {id: number, isOk: number, message: string}) => {

  const formdata = new FormData();
  formdata.append("message", message);
  formdata.append("is_ok", String(isOk));
  
  const response = await instance({
    url: `/letter-replies/is-ok/${id}`,
    method: "PUT",
    data: formdata,
  });
  
  return response.data;
}