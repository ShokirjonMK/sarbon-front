import instance from "config/_axios";

export const transferStudentSemestr = async ( values: any ) => {

  const formdata = new FormData();

  for (const key in values) {
    if(values[key]) formdata.append(key, values[key]);
  }

  const response = await instance({ url: `student-groups`, method: "POST", data: formdata });

  return response.data;
};