import { FormInstance, Select } from "antd";
import useGetData from "hooks/useGetData";
import { FC, ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cf_filterOption } from "utils/others_functions";

export type TypeFormUISelect<T = any> = {
  url?: string,
  query_key?: any[] | string,
  label?: string,
  name: string,
  expand?: string,
  filter?: {[key: string]: string | number | undefined | Array<string | number>},
  is_expand_id?: boolean | undefined
  parent_name?: string,
  child_names?: string[],
  form: FormInstance<any>,
  disabled?: boolean,
  load?: boolean,
  data?: {id: number | string, name: string}[],
  second_parent?: string,
  render?: (e: T) => ReactNode,
  onchange?: any,
  multiselect?: boolean
}

const FormUISelect: FC<TypeFormUISelect> = ({ url = "", query_key, label, name, parent_name, child_names, expand, filter, is_expand_id, form, disabled = false, data: staticData, load, second_parent, render, onchange, multiselect = false }): JSX.Element => {

  const { t } = useTranslation();  

  const { data, isFetching, refetch } = useGetData<any>({
    queryKey: [ query_key ?? url, parent_name ? form?.getFieldValue(parent_name) : undefined, second_parent ? form?.getFieldValue(second_parent) : undefined, filter],
    url: `${url?.includes("?") ? url : url + "?sort=-id"}${expand ? "&expand=" + expand : ""}${`&filter=${JSON.stringify({ ...(filter?.status ? filter : {...filter, status: 1}), ...( parent_name ? {[`${parent_name}`]: form?.getFieldValue(parent_name)} : {}), ...( second_parent ? {[`${second_parent}`]: form?.getFieldValue(second_parent)} : {})})}`}`,
    urlParams: { "per-page": url === "nationalities" ? 100 : 0 },
    options: {
      enabled: second_parent ? 
                (!staticData?.length && (!!parent_name && !!form?.getFieldValue(parent_name)) && (!!second_parent && !!form?.getFieldValue(second_parent))) 
                : (!staticData?.length && (!!parent_name && !!form?.getFieldValue(parent_name))),
    }
  });

  // const { data, isFetching, refetch } = useGetAllData<any>({
  //   queryKey: [query_key ?? url, ],
  //   url: `${url?.includes("?") ? url : url + "?sort=-id"}${expand ? "&expand=" + expand : ""}${parent_name ? `&filter=${JSON.stringify({ [`${parent_name}`]: form?.getFieldValue(parent_name), [`${second_parent}`]: form?.getFieldValue(second_parent? second_parent : "") })}` : ""}`,
  //   urlParams: { "per-page": 0 },
  //   options: {
  //     enabled: second_parent ? (!staticData?.length && (!!parent_name && !!form?.getFieldValue(parent_name)) && (!!second_parent && !!form?.getFieldValue(second_parent))) : (!staticData?.length && (!!parent_name && !!form?.getFieldValue(parent_name)))
  //   }
  // }); 

  useEffect(() => {
    if(load){
      if(!staticData?.length){
        refetch();
      }
    }
  }, []);

  const handleChange = (value: number) => {
    // onchange && onchange(value);
    if(onchange) {
      let selectedItem: any = {}
      
      if( staticData?.length ) {
        selectedItem = staticData?.find(i => i?.id === value)
      } else {
        selectedItem = data?.items?.find(i => i?.id === value)
      }
      onchange(value, selectedItem)
    }

    form?.setFieldsValue({ [name]: value })

    if(child_names?.length)
      form?.resetFields(child_names)
  }

  const handleClear = () => {
    form.resetFields([name])

    if(child_names?.length)
      form.resetFields(child_names)
  }

  const selectTitle = (item:any) => {
    if(expand) {
      return item[expand]?.name ?? (item[expand]?.last_name + " " + item[expand]?.first_name + " " + item[expand]?.middle_name)
    } else {
      return item?.name ?? (item?.last_name + " " + item?.first_name + " " + item?.middle_name)
    }
  }


  const selectDisable = () => {
    if(parent_name) {
      if(second_parent){
        return !form?.getFieldValue(parent_name) || !form?.getFieldValue(second_parent)
      } else {
        return !form?.getFieldValue(parent_name)
      }
    } else {
      return disabled ? true : false
    }

  }
  return (
    <Select
      value={form.getFieldValue(name)}
      disabled={selectDisable()}
      onChange={handleChange}
      onClear={handleClear}
      onFocus={() => !staticData && ( !data?.items?.length && refetch())}
      loading={isFetching}
      placeholder={t(`Select ${label?.toLowerCase()}`) + " ..."}
      allowClear
      showSearch
      filterOption={cf_filterOption}
      mode={multiselect ? "multiple" : undefined}
      className="w-[100%]"
    >
      {
        staticData?.length ? staticData?.map((item, i) => (
          <Select.Option key={i} value={item?.id} >{item?.name}</Select.Option>
        )) : data?.items?.length ? (data?.items)?.map((item, i) => (
          <Select.Option key={i} value={(is_expand_id && expand) ? item[expand]?.id : item?.id} >{render ? render(item) : selectTitle(item)}</Select.Option>
        )) : null
      }
    </Select>
  )
}

export default FormUISelect;