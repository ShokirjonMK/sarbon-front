import instance from "config/_axios";

export async function submitRole(role_name: number | undefined | string, data: any, permissions: string[] | undefined) {
    
    data.permissions = permissions
    for (const key in data) {
        if(!data[key]){
            delete data[key]   
        }
    }
    
    const response = await instance({ url: `/roles`, method: role_name != 0? "PUT" : "POST", data: JSON.stringify([data]) });
    return response.data;
}