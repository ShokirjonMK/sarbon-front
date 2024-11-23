import instance from "config/_axios";
import { Notification } from "utils/notification";

export const delete_data = async (url: string, id: number | string, data?: any): Promise<any> => {
    const response = await instance(data ? { url: `${url}/${id}`, method: "DELETE", data: data } : { url: `${url}/${id}`, method: "DELETE" });

    if (response.data?.status) {
        Notification('success', 'delete', response.data?.message)
    } else {
        Notification('error', 'delete', response.data?.message)
    }

    return response
}