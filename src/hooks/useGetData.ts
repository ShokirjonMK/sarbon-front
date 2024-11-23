import { InformerDRDT } from "models/base";
import { UseQueryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { CLIENT_API } from "services/client.request";
import i18next from "i18next";
import { globalConstants } from "config/constants";

const useGetData = <T = any>({ queryKey, url, options, urlParams }: { queryKey: Array<string | number | undefined | any>, url: string, options?: UseQueryOptions<InformerDRDT<T>>, urlParams?: Record<string | number, any> }) => {

    const queryClient = useQueryClient();

    const response = useQuery<InformerDRDT<T>>({
        queryKey: [...queryKey, i18next.language],
        queryFn: () => CLIENT_API.getAll({ url, _params: urlParams }),
        staleTime: globalConstants.queryStaleTime,
        ...options,
    });

    if (!response.data && !response.isLoading && !response.error) {
        queryClient.prefetchQuery([...queryKey, i18next.language], () => CLIENT_API.getAll({ url, _params: urlParams }));
    }

    return { ...response }
}

export default useGetData;