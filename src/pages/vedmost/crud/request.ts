import instance from "config/_axios";
import i18next from "i18next";

export async function submitData(id: number | undefined, data: any) {
    const formdata = new FormData();
        for (const key in data) {
            if(data[key] != undefined || data[key] != null){
                if(key === "status"){
                    formdata.append('status', data?.status ? "1" : "0")
                }else if(key === "name"){
                    formdata.append(`name[${i18next?.language}]`, data[key])
                }else if(key === "description"){
                    formdata.append(`description[${i18next?.language}]`, data[key])
                }else if(key === "edu_plan_id" || key === "edu_semestr_id" || key === "building_id"){

                }else if (key === "date") {
                  formdata.append(key, formatDate(data[key]));
                }else{
                    formdata.append(key, data[key])
                }
            }
        }

    const url = id ? `/final-exams/${id}` : `/final-exams`
    const response = await instance({ url, method: id? "PUT" : "POST", data: formdata });
    return response.data;
}

function formatDate(dateString:string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}