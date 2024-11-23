import { ColumnsType } from "antd/es/table";
import { TypeFormUIData, TypeSimpleIndexPageProps } from "../types";


// create expand data from formUIData
export const expandData = (formUIData: TypeSimpleIndexPageProps["formUIData"]) => {
  let expands = ""
  if (formUIData?.length) {
    formUIData?.filter(e => (e?.expand_name && !e?.onlyTable)).forEach(e => {
      expands += "," + e?.expand_name;
    })
  }
  return expands
}

//  create antd table column data from formUIData
export const formUIDataColums = (data: TypeFormUIData[], t: any) => {
  const arr: ColumnsType<any> = [];

  data?.forEach(e => {
    if(!e?.disabledTable){
      if (e?.type === "select") {
        arr.push({
          title: t(e?.label),
          render: e?.render ? e?.render : (element: any) => element[e?.expand_name ?? e?.name?.split("_id")[0]]?.name
        })
      } else {
        arr.push({
          title: t(e?.label),
          render: e?.render ? e?.render : (element: any) => element[e?.name]
        })
      }
    }
  });

  return arr
}