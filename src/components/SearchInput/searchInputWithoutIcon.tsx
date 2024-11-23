import React, { FC } from 'react'
import { Input, InputNumber } from "antd"
import useDebounce from "hooks/useDebounce"
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useTranslation } from 'react-i18next';

type SearchInputWithoutIconPropsType = {
    setSearchVal: React.Dispatch<string>,
    duration?: number,
    filterKey: string,
    placeholder?: string ,
    width?: number | string,
    type?: "text" | "number"
}

const SearchInputWithoutIcon: FC<SearchInputWithoutIconPropsType> = ({ setSearchVal, duration = 1000, filterKey, placeholder = "Search", width, type }) => {

    const {t} = useTranslation()

    const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 9 });

    const debounse = useDebounce(urlValue.filter_like[filterKey], duration)

    React.useEffect(() => {
        setSearchVal(debounse ?? undefined)
    }, [debounse])

    if(type === "number"){
        return <InputNumber value={urlValue.filter_like[filterKey]} className={`w-[${width ?? 180}px] h-[32px]`} placeholder={`${t(placeholder)}...`} onChange={(e) => writeToUrl({ name: filterKey, value: e ?? "" })}/>
    }

    return <Input value={urlValue.filter_like[filterKey]} className={`w-[${width ?? 180}px] h-[32px]`} placeholder={`${t(placeholder)}...`} onChange={(e) => writeToUrl({ name: filterKey, value: e.target.value })}  allowClear/>

}

export default SearchInputWithoutIcon;