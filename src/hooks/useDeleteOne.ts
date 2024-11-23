import { useState } from 'react';
import { message } from 'antd';
import instance from 'config/_axios';
import { Notification } from 'utils/notification';

export type TypeUseDeleteOne = {
    refetch: boolean,
    loading: boolean,
    fetch: (url: string) => void
}

const useDeleteOne = (): TypeUseDeleteOne => {
    const [refetch, setReFetch] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const fetch = async (url: string) => {
        try {
            setLoading(true);
            const response = await instance({ url, method: "DELETE" });

            if (response.data?.status) {
                Notification('success', 'delete', response.data?.message).then(() => setReFetch(!refetch));
            } else {
                Notification('error', 'delete', response.data?.message);
            }
            setLoading(false);

        } catch (error) {
            message.error("Something went wrong !", 1);
        } finally {
            setLoading(false);
        }
    }

    return { refetch, loading, fetch }
}

export default useDeleteOne;