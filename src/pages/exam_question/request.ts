import instance from "config/_axios";

export const submitExamQuestions = async ( id: number | string | undefined, values: any ) => {

  const formdata = new FormData();

  for (const key in values) {
      if(values[key] && key !== 'kafedra_id') {
          if(key == "upload") {
              if(values[key]) formdata.append(key, values[key]);
          } else {
              if(values[key]) formdata.append(key, values[key]);
          }
      }
  }

  const url = id ? `/tests/${id}` : "/tests"
  const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });

  return response.data;
};