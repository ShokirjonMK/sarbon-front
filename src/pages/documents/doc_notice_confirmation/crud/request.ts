/** @format */

import instance from "config/_axios";

export const docNoticeConfirm = async (
  id: string | undefined,
  type: number,
  message?: string | undefined,
  signature_user_id?: number | undefined
) => {
  const formdata = new FormData();
  formdata.append("type", type.toString());
  if(message) formdata.append("message", message);
  if(signature_user_id) formdata.append("signature_user_id", signature_user_id.toString());

  const response = await instance({
    url: `document-notifications/hr-update/${id}`,
    method: "PUT",
    data: formdata,
  });

  return response.data;
};