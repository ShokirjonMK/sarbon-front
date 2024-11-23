import instance from "config/_axios";

export async function submitGroups(user_id: string | undefined, data: {[key: string]: boolean} | undefined) {
    
    const formdata = new FormData();

    let ids = []

    for (const group_id in data) {
        if(data[group_id] != undefined || data[group_id] != null){
            if(data[group_id]) ids.push(group_id)
        }
    }

    formdata.append("groups", JSON.stringify({ids}))
    formdata.append("user_id", String(user_id))
    
    const response = await instance({ url: `/students/tutor`, method: "POST", data: formdata });
    return response.data;
}