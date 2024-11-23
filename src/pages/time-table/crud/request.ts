import instance from "config/_axios";

export const submitTimeTable = async ( id: number | string | undefined, data: any, type: string | undefined) => {
    const formdata = new FormData();
    for (const key in data) {
      if (data[key] != undefined || data[key] != null) {
        if(key == "groups") {
          formdata.append(key, `${JSON.stringify({0: data[key]})}`);
        } else if(key == "two_groups") {
          if(data[key]){
            formdata.append(key, '1');
          } else {
            formdata.append(key, '0');
          }
        } else {
          formdata.append(key, data[key]);
        }
      }
    }
    if(type && type != '0'){
      formdata.append("type", type);
    }
    const url = id != "0" ? `/time-tables/${id}` : "/time-tables"
    const response = await instance({ url, method: id != "0" ? "PUT" : "POST", data: formdata });

    return response.data;
};
  
export const addGroupToTimeTable = async ( time_table_id: number | string | undefined, group_id: number | string | undefined) => {
  const formdata = new FormData();

  formdata.append("time_table_id", String(time_table_id));
  formdata.append("group_id", String(group_id));

  const response = await instance({ url: "time-tables/create-add-group", method: "POST", data: formdata });

  return response.data;
};