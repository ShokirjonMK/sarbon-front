import { Col, Select } from "antd";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { FC, ReactNode, useEffect } from "react";
import { cf_filterOption, generateAntdColSpan } from "utils/others_functions";
import checkPermission from "utils/check_permission";
import { t } from "i18next";

export type TypeFilterSelect<T = any> = {
  url?: string,
  query_key?: string[]
  label: string,
  name: string,
  permission: string,
  value_name?: string,
  parent_name?: string,
  child_names?: string[],
  filter?: {[key: string]: string | number | undefined | string[]},
  all?: boolean,
  render?: (e: T) => ReactNode,
  span?: { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number } | number,
  staticData?: {id: number | string, name: string | JSX.Element}[],
  onChange?: (id: number, item?: any) => void,
  disable?: boolean
}
  
  const FilterSelect: FC<TypeFilterSelect> = ({ url, query_key, label, name, permission, parent_name, child_names, span, value_name, filter, all = false, render, staticData, onChange, disable }): JSX.Element => {

  const { urlValue: value, writeToUrl } = useUrlQueryParams({});

  const { data, isFetching, refetch } = useGetAllData({
    queryKey: [query_key ?? url, value.filter[parent_name ? parent_name : ""]],
    url: `${url?.includes("?") ? url : url + "?sort=-id"}${value_name ? "&expand=" + value_name : ""}${`&filter=${JSON.stringify({ ...(filter?.status ? filter : {...filter, ...( !all ? {status: 1} : {})}), ...( parent_name ? {[`${parent_name}`]: value.filter[parent_name]} : "" )})}`}`,
    urlParams: { "per-page": 0 },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !(staticData?.length || !checkPermission(permission)) && (!!parent_name && !!value.filter[parent_name])
    }
  })

  useEffect(() => {
    if (value.filter[name]) {
      if(!staticData?.length){
        refetch();
      }
    }
  }, []);

  const handleChange = (value: number) => {

    let selectedItem: any = {};

    selectedItem = data?.items?.find(i => i?.id === value);

    onChange && onChange(value, selectedItem)

    writeToUrl({ name, value, items: data?.items });
    child_names?.forEach(e => {
      writeToUrl({ name: e, value: '', items: [] });
    })
  }

  const handleClear = () => {
    writeToUrl({ name, value: '', items: [] });
    child_names?.forEach(e => {
      writeToUrl({ name: e, value: '', items: [] });
    })
  }

  return (
    checkPermission(permission) ?
      <Col {...generateAntdColSpan(span)}>
        <Select
          className="w-[100%]"
          placeholder={`${t(`Filter by ${label.toLowerCase()}`)}`}
          allowClear
          disabled={disable ? true : parent_name ? !value.filter[parent_name] : false}
          value={value.filter[name]}
          onChange={handleChange}
          onClear={handleClear}
          onFocus={() => !staticData && ( !data?.items?.length && refetch())}
          showSearch
          filterOption={cf_filterOption}
          loading={isFetching}
        >
          {
           !staticData?.length ? (data?.items?.length ?
              data.items.map((element: any) => !value_name ?
                <Select.Option key={element.id} value={element.id}>{ render ? render(element) : element?.name}</Select.Option>
                : <Select.Option key={element.id} value={element[`${value_name.toLowerCase()}_id`]}>{render ? render(element) : element[value_name]?.name}</Select.Option>)
              : value.item[name] ? [value.item[name]]?.map((element) => <Select.Option key={element.id} value={element.id}>{render ? render(element) : element?.name}</Select.Option>) : null)
            : staticData.map(i => <Select.Option key={i?.id} value={i.id}>{render ? render(i) : i?.name}</Select.Option>)
          }
        </Select>
      </Col>
      : <></>
  )
}

export default FilterSelect;