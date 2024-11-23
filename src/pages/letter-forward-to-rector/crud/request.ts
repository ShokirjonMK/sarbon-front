/** @format */

import instance from "config/_axios";

export const requesrData = async (
  letter_id: number | string | undefined,
  description: string | undefined,
  user_id: number | undefined,
  docBody: string | undefined,
  docNumber: string | undefined,
) => {
  
  const formdata = new FormData();

  formdata.append("letter_id", String(letter_id));
  formdata.append("user_id", String(user_id));
  if(docBody) formdata.append("body", docBody);
  if(description) formdata.append("description", String(description));
  if(docNumber) formdata.append("docNumber", String(description));

  const response = await instance({
    url: "/letter-outgoings",
    method: "POST",
    data: formdata,
  });
  
  return response.data;
};

export const changedocNumber = async (
  id: number | string | undefined,
  docNumber: string | undefined,
  docBody: string | undefined,
) => {
  
  const formdata = new FormData();

  if(docNumber) formdata.append("access_number", String(docNumber));
  if(docBody) formdata.append("body", docBody);

  const response = await instance({
    url: `/letter-outgoings/${id}`,
    method: "PUT",
    data: formdata,
  });
  
  return response.data;
};


export const changeLetterForwardToRectorStatus = async ({id, isTrue}: {id: number | undefined, isTrue: boolean}) => {

  const formdata = new FormData();
  formdata.append("status", isTrue ? '1' : "0");
  
  const response = await instance({
    url: `/letter-outgoings/${id}`,
    method: "PUT",
    data: formdata,
  });
  
  return response.data;
}