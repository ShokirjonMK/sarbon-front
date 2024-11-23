/** @format */

import instance from "config/_axios";

export const docNoticeConfirm = async (
  id: string | undefined,
  type: number,
  message?: string | undefined,
  user_id?: string | undefined
) => {
  const formdata = new FormData();
  formdata.append("type", type.toString());
  if(message) formdata.append("message", message);
  if(user_id) formdata.append("user_id", user_id);

  const response = await instance({
    url: `document-notifications/signature-update/${id}`,
    method: "PUT",
    data: formdata,
  });

  return response.data;
};