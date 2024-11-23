/** @format */

import i18next from "i18next";
import { InformerById } from "models/base";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { CLIENT_API } from "services/client.request";

const useGetOneData = <T = any>({
  queryKey,
  url,
  options,
  urlParams,
}: {
  queryKey: Array<string | number | undefined>;
  url: string;
  options?: UseQueryOptions<InformerById<T>>;
  urlParams?: Record<string | number, any>;
}) => {
  const response = useQuery<InformerById<T>>({
    queryKey: [...queryKey, i18next.language],
    queryFn: () => CLIENT_API.getOne({ url, _params: urlParams }),
    ...options,
  });

  return { ...response };
};

export default useGetOneData;
