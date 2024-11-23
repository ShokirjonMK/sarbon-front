import React from 'react'
import { Input } from "antd"
import useDebounce from "hooks/useDebounce"
import {SearchFilled} from '@fluentui/react-icons'
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useTranslation } from 'react-i18next';

const SearchInput = ({ setSearchVal, duration = 1000, width, className, placeholder }: { setSearchVal: React.Dispatch<string>, duration?: number, width?: number | "full", className?: string, placeholder?: string }) => {
    const { urlValue, writeToUrl } = useUrlQueryParams({});
    const debounse = useDebounce(urlValue.q, duration);
    const {t} = useTranslation()

    React.useEffect(() => {
        setSearchVal(debounse)
    }, [debounse])

    return <Input value={urlValue.q} className={`w-[${width === "full" ? "100%" : width+"px"}] h-[32px] ${className}`} placeholder={ placeholder ? `${t(placeholder)}` : `${t("Search by name")}...`} prefix={<SearchFilled fontSize={20} color='#b9b9b9' />} onChange={(e) => writeToUrl({ name: "q", value: e.target.value })}  allowClear/>

}

export default SearchInput;