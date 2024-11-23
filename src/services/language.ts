import { message } from "antd";
import instance from "config/_axios";


export const getLanguages = async (path_prefix?: string) => {
  try {

      const response = await instance({ url: `/languages${path_prefix ? '?' + path_prefix : ''}`, method: "GET" });

      if (response.data?.status === 1) {
          return response.data?.data
      } else {
          return new Error(response.data?.message)
      }
  } catch (error: any) {
      message.error(error?.response?.message)
  }
}