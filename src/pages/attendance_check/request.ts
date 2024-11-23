import instance from "config/_axios";
import dayjs from "dayjs";

export const submitReasonAttend = async ( id: number | string | undefined, values: any ) => {

    const formdata = new FormData();

    for (const key in values) {
      if(key == "date"){
        if (dayjs(values[key][0])) formdata.append("start", String(dayjs(values[key][0]).unix()));
        if (dayjs(values[key][1])) formdata.append("end", String(dayjs(values[key][1]).unix()));
      } else if(key == "file") {
        if(values[key]) formdata.append(key, values[key]);
      } else {
        if(values[key]) formdata.append(key, values[key]);
      }
    }

    const url = id ? `/timetable-reasons/${id}` : "/timetable-reasons"
    const response = await instance({ url, method: id ? "PUT" : "POST", data: formdata });

    return response.data;
  };
  
  export const checkStatus = async ( id: number | string | undefined, type: 1 | 2 | undefined ) => {
    
    const formdata = new FormData();
    formdata.append("is_confirmed", String(type))

    const url = type === 1 ? `/timetable-reasons/${id}` : `/timetable-reasons/${id}`

    const response = await instance({ url, method: "PUT", data: formdata });

    return response.data;
  };