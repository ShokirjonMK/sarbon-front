import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { AxiosRequestConfig } from "axios";
import instance from "config/_axios";

const SignIn = createAsyncThunk(
    'user/SignIn',
    async (data: { type: string, data?: any, role?: string }, { rejectWithValue }) => {
        try {
            const options: AxiosRequestConfig = data.type === 'login' ? { url: '/auth/login', method: 'POST', data: data?.data ?? null } : { url: '/users/me?expand=profile,userAccess,teacherAccess', method: 'GET', params: { is_main: '1', role: data?.role ?? "" } };
            const response = await instance(options);
            const _data = response.data;
            if (_data?.status === 1) {
                if(data.type === "login") window.location.reload();
                // window.location.reload();
                if (!_data?.data?.permissions?.length) {
                    message.error("ERR: user permissions are invalid !!!");
                } else {
                    if (_data?.data?.access_token) {
                        localStorage.setItem('access_token', _data.data.access_token);
                    }
                }
                return _data;
            }
            else {
                return rejectWithValue(new Error("Error !"))
            }
        } catch (error: any) {
            return rejectWithValue(error.response);
        }
    }
)

export default SignIn;