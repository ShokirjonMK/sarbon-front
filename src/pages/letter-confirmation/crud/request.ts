/** @format */

import instance from "config/_axios";

export const changeLetterIsOk = async ({id, is_ok, message}: {id: number | undefined, is_ok: 0 | 1 | 2, message?: string}) => {

  const formdata = new FormData();
  formdata.append("is_ok", String(is_ok));
  if(message) formdata.append("message", message);
  
  const response = await instance({
    url: `/letters/is-ok/${id}`,
    method: "PUT",
    data: formdata,
  });
  
  return response.data;
}