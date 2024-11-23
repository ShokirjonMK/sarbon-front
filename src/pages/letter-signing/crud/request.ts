/** @format */

import { message } from "antd";
import instance from "config/_axios";

export const changeLetterIsOk = async ({id, is_ok, message: _message}: {id: number | string | undefined, is_ok: 0 | 1 | 2, message: string}) => {

  if(!id) return message.warning("letter-outgoing_id ni topilmadi");

  const formdata = new FormData();
  formdata.append("is_ok", String(is_ok));
  if(_message) formdata.append("message", _message);

  const response = await instance({
    url: `/letter-outgoings/is-ok/${id}`,
    method: "PUT",
    data: formdata,
  });

  return response.data;
}